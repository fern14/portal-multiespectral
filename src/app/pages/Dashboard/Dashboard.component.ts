import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/Weather.service';
import { WeatherData } from '../../models/Weather.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './Dashboard.component.html',
  styleUrl: './Dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  weatherData: WeatherData | null = null;
  loading = true;
  error = false;

  colheitaPercentual = 84;

  ultimasColheitas = [
    { mes: 'Agosto', valor: 120, percentual: 100 },
    { mes: 'Julho', valor: 90, percentual: 75 },
    { mes: 'Junho', valor: 80, percentual: 67 },
    { mes: 'Maio', valor: 70, percentual: 58 }
  ];

  getArcLength(): number {
    return 282.7;
  }

  getArcOffset(): number {
    const totalLength = this.getArcLength();
    return totalLength - (totalLength * this.colheitaPercentual / 100);
  }

  dateCard: { day: string, month: string, dayOfWeek: string } = { day: '', month: '', dayOfWeek: '' };

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
    this.loadWeatherData();
    this.dateCard = {
      day: new Date().getDate().toString(),
      month: new Date().toLocaleDateString('pt-BR', { month: 'long' }),
      dayOfWeek: new Date().toLocaleDateString('pt-BR', { weekday: 'long' })
    };
  }

  loadWeatherData() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.loadWeatherByCoordinates(lat, lon);
        },
        (error) => {
          console.log('Geolocalização negada ou indisponível, usando cidade padrão');
          this.loadWeatherByCity('Vitoria,BR');
        },
        {
          timeout: 10000,
          enableHighAccuracy: true
        }
      );
    } else {
      console.log('Geolocalização não suportada, usando cidade padrão');
      this.loadWeatherByCity('Vitoria,BR');
    }
  }

  loadWeatherByCoordinates(lat: number, lon: number) {
    this.weatherService.getWeatherByCoordinates(lat, lon).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do clima por coordenadas:', err);
        this.loadWeatherByCity('Vitoria,BR');
      }
    });
  }

  loadWeatherByCity(city: string) {
    this.weatherService.getCurrentWeather(city).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do clima:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  getWeatherIcon(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  getWeatherIconBackground(iconCode: string): string {
    const weatherType = iconCode.substring(0, 2);

    switch (weatherType) {
      case '01':
        return 'bg-gradient-to-br from-yellow-100 to-orange-200';
      case '02':
      case '03':
      case '04':
        return 'bg-gradient-to-br from-gray-100 to-blue-200';
      case '09':
      case '10':
        return 'bg-gradient-to-br from-blue-200 to-blue-300';
      case '11':
        return 'bg-gradient-to-br from-gray-300 to-gray-400';
      case '13':
        return 'bg-gradient-to-br from-blue-50 to-white';
      case '50':
        return 'bg-gradient-to-br from-gray-200 to-gray-300';
      default:
        return 'bg-gradient-to-br from-blue-100 to-blue-200';
    }
  }
}
