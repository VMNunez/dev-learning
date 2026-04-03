import { Component, output } from '@angular/core';

@Component({
  selector: 'app-weather-form',
  imports: [],
  templateUrl: './weather-form.html',
  styleUrl: './weather-form.css',
})
export class WeatherForm {
  cityToSearch = output<string>();
}
