import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { UserRequest } from '../models/User.interface';
import { GenericResponse } from '../models/GenericResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  $user = new BehaviorSubject<any | null>(null);
  $http = inject(HttpClient);

  $url = signal<string>('http://localhost:8000/api/v1/');

  constructor() { }

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

    return this.$http.post<GenericResponse>(
      this.$url() + 'auth/token',
      body.toString(),
      { headers }
    );
  }
}