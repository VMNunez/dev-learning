import { Component, inject, signal } from '@angular/core';
import { MealService } from '../../services/meal.service';
import type { Meal, MealResponse } from '../../models/meal.model';

@Component({
  selector: 'app-search-page',
  imports: [],
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
}
