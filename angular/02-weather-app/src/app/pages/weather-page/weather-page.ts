import { Component, inject, signal } from '@angular/core';
import { WeatherService } from './services/weather.service';
import { WeatherForm } from './components/weather-form/weather-form';
import { WeatherCard } from './components/weather-card/weather-card';
import type { WeatherResponse } from './models/weather.model';

@Component({
  selector: 'app-weather-page',
  imports: [WeatherForm, WeatherCard],
  templateUrl: './weather-page.html',
  styleUrl: './weather-page.css',
})
export class WeatherPage {
  private weatherService = inject(WeatherService);

  weatherResponse = signal<WeatherResponse | null>(null);

  onCitySearch(city: string) {
    this.weatherService.getWeather(city).subscribe({
      next: (weatherData) => this.weatherResponse.set(weatherData),
      error: (err) => console.log(err),
    });
  }
}
