import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/Auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    const token = localStorage.getItem('access_token');

    if (token && !this.authService.isTokenExpired()) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
