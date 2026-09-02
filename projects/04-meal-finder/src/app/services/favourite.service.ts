import { computed, effect, Injectable, signal } from '@angular/core';
import type { Meal } from '../models/meal.model';

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  private readonly _favourites = signal<Meal[]>(
    JSON.parse(localStorage.getItem('favourites') ?? '[]'),
  );

  readonly favourites = this._favourites.asReadonly();

  readonly favouriteIds = computed(() => new Set(this.favourites().map((meal) => meal.idMeal)));

  constructor() {
    effect(() => {
      localStorage.setItem('favourites', JSON.stringify(this.favourites()));
    });
  }

  addFavourite(meal: Meal) {
    this._favourites.update((meals) => [...meals, meal]);
  }

  deleteFavourite(mealId: string) {
    this._favourites.update((meals) => meals.filter((meal) => meal.idMeal !== mealId));
  }
}
