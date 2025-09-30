import { Injectable, inject, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take, finalize, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthHelperService } from '../services/AuthHelper.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private injector = inject(Injector);
  private router = inject(Router);
  private authHelper = inject(AuthHelperService);

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isApiRequest(req) && !this.isAuthRequest(req)) {
      const token = localStorage.getItem('access_token');
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isAuthRequest(req)) {
          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private isApiRequest(req: HttpRequest<any>): boolean {
    return req.url.includes('/api/v1/');
  }

  private isAuthRequest(req: HttpRequest<any>): boolean {
    return req.url.includes('/auth/token') ||
           req.url.includes('/auth/refresh') ||
           req.url.includes('/auth/login') ||
           req.url.includes('/auth/logout');
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.refreshToken().pipe(
        switchMap((success: boolean) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(success);

          if (success) {
            this.authHelper.setAuthenticated(true);
            const newToken = localStorage.getItem('access_token');
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next.handle(newReq);
          } else {
            this.authHelper.setAuthenticated(false);
            this.router.navigate(['/login']);
            throw new Error('Sessão expirada. Você foi desconectado.');
          }
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authHelper.setAuthenticated(false);
          this.router.navigate(['/login']);
          console.error('Falha na requisição para:', req.url);
          return throwError(() => error);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(result => result !== null),
        take(1),
        switchMap(success => {
          if (success) {
            const newToken = localStorage.getItem('access_token');
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next.handle(newReq);
          } else {
            throw new Error('Sessão expirada. Você foi desconectado.');
          }
        })
      );
    }
  }

  private refreshToken(): Observable<boolean> {
    const http = this.injector.get(HttpClient);
    const baseUrl = 'http://localhost:8000/api/v1/';
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      console.error('Refresh token não encontrado');
      return new Observable<boolean>(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', refreshToken);

    return http.post<any>(
      `${baseUrl}auth/refresh`,
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

          console.log('Token renovado com sucesso');
          return true;
        }

        console.log('Falha ao renovar token');
        return false;
      }),
      catchError(error => {
        console.error('Falha ao renovar o token:', error);
        return new Observable<boolean>(observer => {
          observer.next(false);
          observer.complete();
        });
      })
    );
  }
}
