import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, tap, Observable, map, catchError, throwError } from 'rxjs';
import { UserRequest } from '../models/User.interface';
import { GenericResponse } from '../models/GenericResponse.interface';
import { AuthService } from './Auth.service';
import { TokenMonitorService } from './TokenMonitor.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  $user = new BehaviorSubject<any | null>(null);
  $http = inject(HttpClient);
  authService = inject(AuthService);
  tokenMonitor = inject(TokenMonitorService);

  $url = signal<string>('http://localhost:8000/api/v1/');

  constructor() {
    setTimeout(() => {
      const token = localStorage.getItem('access_token');
      if (token && !this.authService.isTokenExpired()) {
        this.authService.setAuthenticated(true);

        const savedUserData = localStorage.getItem('user_data');
        if (savedUserData) {
          try {
            const userData = JSON.parse(savedUserData);
            this.$user.next(userData);
          } catch (error) {
            console.error('Erro ao carregar dados salvos do usuário:', error);
          }
        }

        this.tokenMonitor.startMonitoring();
      }
    }, 100);
  }

  createUser(request: UserRequest) {
    return this.$http.post<GenericResponse>(this.$url(), request);
  }

  login(request: UserRequest) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('username', request.email);
    body.set('password', request.senha);
    body.set('grant_type', 'password');

    return this.$http.post<LoginResponse>(
      this.$url() + 'auth/token',
      body.toString(),
      { headers }
    ).pipe(
      tap(response => {
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          localStorage.setItem('expires_in', response.expires_in.toString());
          localStorage.setItem('token_type', response.token_type);

          const now = Date.now();
          const expiresAt = now + (response.expires_in * 1000);
          localStorage.setItem('expires_at', expiresAt.toString());

        }

        this.authService.setAuthenticated(true);

        this.getUserData().subscribe();

        this.tokenMonitor.startMonitoring();
      })
    );
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.tokenMonitor.stopMonitoring();

    this.authService.logout();
    this.$user.next(null);
    localStorage.removeItem('user_data');
  }

  isTokenExpired(): boolean {
    return this.authService.isTokenExpired();
  }

  getTokenTimeRemaining(): number {
    return this.authService.getTokenTimeRemaining();
  }

  getAccessToken(): string | null {
    return this.authService.getAccessToken();
  }

  getRefreshToken(): string | null {
    return this.authService.getRefreshToken();
  }

  checkAuthStatus(): Observable<boolean> {
    return this.$http.get(`${this.$url()}users/me`, {
      observe: 'response'
    }).pipe(
      map(response => {
        const isAuth = response.ok;
        this.authService.setAuthenticated(isAuth);
        if (isAuth && response.body) {
          this.$user.next(response.body);
          localStorage.setItem('user_data', JSON.stringify(response.body));
        }
        return isAuth;
      }),
      catchError((error) => {
        console.error('Erro ao verificar status de autenticação:', error);
        this.authService.setAuthenticated(false);
        this.$user.next(null);
        localStorage.removeItem('user_data');
        return [false];
      })
    );
  }

  getUserData(): Observable<any> {
    return this.$http.get(`${this.$url()}users/me`).pipe(
      tap(userData => {
        this.$user.next(userData);
        localStorage.setItem('user_data', JSON.stringify(userData));
      }),
      catchError(error => {
        console.error('Erro ao buscar dados do usuário:', error);
        this.$user.next(null);
        localStorage.removeItem('user_data');
        return throwError(() => error);
      })
    );
  }

  refreshUserData(): Observable<any> {
    return this.getUserData();
  }

  getCachedUserData(): any {
    const savedUserData = localStorage.getItem('user_data');
    if (savedUserData) {
      try {
        return JSON.parse(savedUserData);
      } catch (error) {
        console.error('Erro ao carregar dados salvos do usuário:', error);
        return null;
      }
    }
    return null;
  }
}

interface LoginResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}