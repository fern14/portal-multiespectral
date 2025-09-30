import { Injectable, inject } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AuthService } from './Auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenMonitorService {
  private authService = inject(AuthService);
  private monitorSubscription?: Subscription;
  private readonly CHECK_INTERVAL = 60000;

  startMonitoring(): void {
    if (this.monitorSubscription) {
      return;
    }

    this.monitorSubscription = interval(this.CHECK_INTERVAL).subscribe(() => {
      this.checkTokenValidity();
    });
  }

  stopMonitoring(): void {
    if (this.monitorSubscription) {
      this.monitorSubscription.unsubscribe();
      this.monitorSubscription = undefined;
    }
  }

  private checkTokenValidity(): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      this.authService.logout();
      return;
    }

    if (this.authService.isTokenExpired()) {
      this.authService.refreshToken().subscribe({
        next: (success) => {
          if (!success) {
            this.authService.logout();
          }
        },
        error: (error) => {
          this.authService.logout();
        }
      });
    }
  }

  isTokenExpiringSoon(): boolean {
    const timeRemaining = this.authService.getTokenTimeRemaining();
    return timeRemaining <= 300;
  }

  getFormattedTimeRemaining(): string {
    const seconds = this.authService.getTokenTimeRemaining();

    if (seconds <= 0) return 'Expirado';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (remainingSeconds > 0) parts.push(`${remainingSeconds}s`);

    return parts.join(' ');
  }
}
