import { Component, inject, OnInit, signal } from '@angular/core';
import { MealService } from '../../services/meal.service';
import type { Meal, MealResponse } from '../../models/meal.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-page',
  imports: [RouterLink],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css',
})
export class SearchPage implements OnInit {
  private mealService = inject(MealService);
  meals = signal<Meal[]>([]);

  ngOnInit(): void {
    this.onSearchMeals('chicken');
  }

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
