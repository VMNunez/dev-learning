import { Component, input } from '@angular/core';
import type { WeatherResponse } from '../../models/weather.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-weather-card',
  imports: [DecimalPipe],
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.css',
})
export class WeatherCard {
  weather = input<WeatherResponse | null>();

  getIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}
