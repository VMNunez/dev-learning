import { Component, input } from '@angular/core';
import type { WeatherResponse } from '../../models/weather.model';
import { DecimalPipe } from '@angular/common';
import { getIconUrl } from '../../utils/weather.utils';

@Component({
  selector: 'app-weather-card',
  imports: [DecimalPipe],
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.css',
})
export class WeatherCard {
  protected getIconUrl = getIconUrl;

  weather = input<WeatherResponse | null>();
}
