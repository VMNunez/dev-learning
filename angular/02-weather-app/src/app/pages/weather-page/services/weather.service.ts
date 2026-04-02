import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private http = inject(HttpClient);

  getWeather(city: string) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}&units=metric`;
  }
}
