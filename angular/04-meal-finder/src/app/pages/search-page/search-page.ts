import { Component, inject, signal } from '@angular/core';
import { MealService } from '../../services/meal.service';
import type { Meal, MealResponse } from '../../models/meal.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-page',
  imports: [RouterLink],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css',
})
export class SearchPage {
  private mealService = inject(MealService);
  meals = signal<Meal[]>([]);

  onSearchMeals(meal: string) {
    this.mealService.searchMeals(meal).subscribe({
      next: (mealResponse: MealResponse) => {
        this.meals.set(mealResponse.meals);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  isFavourite(id: string) {
    return this.mealService.favourites().some((meal) => meal.idMeal === id);
  }

  toggleFavourite(meal: Meal, event: MouseEvent) {
    event.stopPropagation();
    this.isFavourite(meal.idMeal)
      ? this.mealService.deleteFavourite(meal.idMeal)
      : this.mealService.addFavourite(meal);
  }
}
