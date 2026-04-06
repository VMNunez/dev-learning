import { Component, inject, signal, OnInit } from '@angular/core';
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
export class WeatherPage implements OnInit {
  private weatherService = inject(WeatherService);

  weatherResponse = signal<WeatherResponse | null>(null);
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.onCitySearch('Madrid');
  }

  onCitySearch(city: string) {
    this.isLoading.set(true);
    this.weatherResponse.set(null);
    this.errorMessage.set('');
    this.weatherService.getWeather(city).subscribe({
      next: (weatherData) => {
        this.weatherResponse.set(weatherData);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('City not found. Please try again');
        this.isLoading.set(false);
      },
    });
  }
}
