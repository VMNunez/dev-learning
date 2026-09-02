import { Component, computed, input, output } from '@angular/core';
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

  favouriteLabel = computed(() =>
    this.isFavourite()
      ? `Remove ${this.meal().strMeal} from favourites`
      : `Add ${this.meal().strMeal} to favourites`,
  );

  onToggle() {
    this.favouriteToggled.emit(this.meal());
  }
}
