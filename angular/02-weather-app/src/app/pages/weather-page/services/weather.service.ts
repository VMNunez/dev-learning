import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import type { WeatherResponse } from '../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private http = inject(HttpClient);

  getWeather(city: string) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${environment.apiKey}&units=metric`;

    return this.http.get<WeatherResponse>(apiUrl);
  }
}
