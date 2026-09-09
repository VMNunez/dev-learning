import { Component, output } from '@angular/core';

@Component({
  selector: 'app-weather-form',
  imports: [],
  templateUrl: './weather-form.html',
  styleUrl: './weather-form.css',
})
export class WeatherForm {
  cityToSearch = output<string>();

  submit(value: string) {
    const city = value.trim();
    if (!city) return;

    this.cityToSearch.emit(city);
  }
}
