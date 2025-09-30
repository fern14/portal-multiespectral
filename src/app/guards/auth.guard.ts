import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/Auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    const token = localStorage.getItem('access_token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    if (this.authService.isTokenExpired()) {
      return new Promise((resolve) => {
        this.authService.refreshToken().subscribe({
          next: (success) => {
            if (success) {
              resolve(true);
            } else {
              this.router.navigate(['/login']);
              resolve(false);
            }
          },
          error: () => {
            this.router.navigate(['/login']);
            resolve(false);
          }
        });
      });
    }

    this.authService.setAuthenticated(true);
    return true;
  }
}
