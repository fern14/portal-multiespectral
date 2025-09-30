import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthHelperService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  setAuthenticated(authenticated: boolean): void {
    this.isAuthenticatedSubject.next(authenticated);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
