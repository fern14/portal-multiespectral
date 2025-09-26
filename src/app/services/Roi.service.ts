import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoiService {
  $url = signal<string>('/api/v1/');
  $http = inject(HttpClient);

  constructor() { }

}
