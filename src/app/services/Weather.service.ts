import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherData } from '../models/Weather.interface';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '6b818ab2512deca23d201db83e68bdc5';
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) { }

  getCurrentWeather(city: string = 'Vitoria,BR'): Observable<WeatherData> {
    const url = `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric&lang=pt_br`;
    return this.http.get<WeatherData>(url);
  }

  getWeatherByCoordinates(lat: number, lon: number): Observable<WeatherData> {
    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=pt_br`;
    return this.http.get<WeatherData>(url);
  }
}
