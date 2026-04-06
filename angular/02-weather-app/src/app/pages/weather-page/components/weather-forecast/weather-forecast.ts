import { Component, input } from '@angular/core';
import { ForecastItem } from '../../models/weather.model';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { getIconUrl } from '../../utils/weather.utils';

@Component({
  selector: 'app-weather-forecast',
  imports: [DecimalPipe, SlicePipe],
  templateUrl: './weather-forecast.html',
  styleUrl: './weather-forecast.css',
})
export class WeatherForecast {
  protected getIconUrl = getIconUrl;

  forecast = input<ForecastItem[]>([]);
}
