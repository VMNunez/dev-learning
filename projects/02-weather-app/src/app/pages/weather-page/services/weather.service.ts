import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import type { ForecastResponse, WeatherResponse } from '../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  getWeather(city: string) {
    return this.http.get<WeatherResponse>(`${this.baseUrl}/weather`, {
      params: this.buildParams(city),
    });
  }

  getForecast(city: string) {
    return this.http.get<ForecastResponse>(`${this.baseUrl}/forecast`, {
      params: this.buildParams(city),
    });
  }

  private buildParams(city: string) {
    return new HttpParams().set('q', city).set('appid', environment.apiKey).set('units', 'metric');
  }
}
