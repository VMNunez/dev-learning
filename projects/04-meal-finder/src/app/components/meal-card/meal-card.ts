import { Component, input, output } from '@angular/core';
import type { Meal } from '../../models/meal.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-meal-card',
  imports: [RouterLink],
  templateUrl: './meal-card.html',
  styleUrl: './meal-card.css',
})
export class MealCard {
  meal = input.required<Meal>();
  isFavourite = input.required<boolean>();

  favouriteToggled = output<Meal>();

  onToggle(event: MouseEvent) {
    event.stopPropagation();
    this.favouriteToggled.emit(this.meal());
  }
}
