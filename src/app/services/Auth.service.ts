import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthHelperService } from './AuthHelper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authHelper = inject(AuthHelperService);
  private baseUrl = 'http://localhost:8000/api/v1/';

  private isRefreshing = false;
  private failedQueue: Array<{resolve: Function, reject: Function}> = [];

  public isAuthenticated$ = this.authHelper.isAuthenticated$;

  constructor() {
  }

  private processQueue(error: any = null): void {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(null);
      }
    });
    this.failedQueue = [];
  }

  checkAuthenticationStatus(): void {
    this.http.get(`${this.baseUrl}users/me`, {
      observe: 'response'
    }).subscribe({
      next: () => {
        this.authHelper.setAuthenticated(true);
      },
      error: () => {
        this.authHelper.setAuthenticated(false);
      }
    });
  }

  refreshToken(): Observable<boolean> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('Refresh token não encontrado'));
    }

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', refreshToken);

    return this.http.post(
      `${this.baseUrl}auth/refresh`,
      body.toString(),
      {
        headers,
        observe: 'response'
      }
    ).pipe(
      map((response: any) => {
        if (response.ok && response.body) {
          const tokenData = response.body;
          localStorage.setItem('access_token', tokenData.access_token);
          localStorage.setItem('expires_in', tokenData.expires_in.toString());
          localStorage.setItem('token_type', tokenData.token_type);

          const now = Date.now();
          const expiresAt = now + (tokenData.expires_in * 1000);
          localStorage.setItem('expires_at', expiresAt.toString());

          this.authHelper.setAuthenticated(true);
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Falha ao renovar o token:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  handle401Error(): Observable<boolean> {
    if (this.isRefreshing) {
      return new Observable(observer => {
        this.failedQueue.push({
          resolve: () => observer.next(true),
          reject: (error: any) => observer.error(error)
        });
      });
    }

    this.isRefreshing = true;

    return this.refreshToken().pipe(
      tap(success => {
        this.isRefreshing = false;
        if (success) {
          this.processQueue();
        } else {
          this.processQueue(new Error('Sessão expirada'));
        }
      }),
      catchError(error => {
        this.isRefreshing = false;
        this.processQueue(error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.clearTokens();

    this.authHelper.setAuthenticated(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.authHelper.isAuthenticated();
  }

  setAuthenticated(authenticated: boolean): void {
    this.authHelper.setAuthenticated(authenticated);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('expires_at');
    if (!expiresAt) {
      return true;
    }

    const expirationTime = parseInt(expiresAt, 10);
    const now = Date.now();

    const bufferTime = 5 * 60 * 1000;

    return now >= (expirationTime - bufferTime);
  }

  getTokenTimeRemaining(): number {
    const expiresAt = localStorage.getItem('expires_at');
    if (!expiresAt) {
      return 0;
    }

    const expirationTime = parseInt(expiresAt, 10);
    const now = Date.now();
    const timeRemaining = Math.max(0, expirationTime - now);

    return Math.floor(timeRemaining / 1000);
  }

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('token_type');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user_data');
  }
}
