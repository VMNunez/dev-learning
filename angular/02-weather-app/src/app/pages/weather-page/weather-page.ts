import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { WeatherService } from './services/weather.service';
import { WeatherForm } from './components/weather-form/weather-form';
import { WeatherCard } from './components/weather-card/weather-card';
import type { ForecastItem, ForecastResponse, WeatherResponse } from './models/weather.model';
import { forkJoin } from 'rxjs';
import { WeatherForecast } from './components/weather-forecast/weather-forecast';

@Component({
  selector: 'app-weather-page',
  imports: [WeatherForm, WeatherCard, WeatherForecast],
  templateUrl: './weather-page.html',
  styleUrl: './weather-page.css',
})
export class WeatherPage implements OnInit {
  private weatherService = inject(WeatherService);

  weatherResponse = signal<WeatherResponse | null>(null);
  forecastResponse = signal<ForecastResponse | null>(null);
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.onCitySearch('Madrid');
  }

  onCitySearch(city: string) {
    this.isLoading.set(true);
    this.weatherResponse.set(null);
    this.forecastResponse.set(null);
    this.errorMessage.set('');
    forkJoin([
      this.weatherService.getWeather(city),
      this.weatherService.getForecast(city),
    ]).subscribe({
      next: ([weatherData, forecastData]) => {
        this.weatherResponse.set(weatherData);
        this.forecastResponse.set(forecastData);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('City not found. Please try again');
        this.isLoading.set(false);
      },
    });
  }

  dailyForecast = computed(() => {
    const forecast = this.forecastResponse();
    if (!forecast) return [];
    return forecast.list.filter((item) => item.dt_txt.includes('12:00:00'));
  });
}
