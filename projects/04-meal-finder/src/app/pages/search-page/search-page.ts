import { Component, inject, signal, DestroyRef } from '@angular/core';
import { MealService } from '../../services/meal.service';
import type { Meal, MealResponse } from '../../models/meal.model';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FavouriteService } from '../../services/favourite.service';

@Component({
  selector: 'app-search-page',
  imports: [RouterLink],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css',
})
export class SearchPage {
  private mealService = inject(MealService);
  private destroyRef = inject(DestroyRef);
  private favouriteService = inject(FavouriteService);
  meals = signal<Meal[]>([]);
  hasSearched = signal<boolean>(false);
  searchTerm = signal<string>('');
  hasError = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  onSearchMeals(meal: string) {
    const term = meal.trim();
    if (!term) return;

    this.isLoading.set(true);
    this.hasError.set(false);
    this.mealService
      .searchMeals(term)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (mealResponse: MealResponse) => {
          this.meals.set(mealResponse.meals ?? []);
          this.hasSearched.set(true);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.hasError.set(true);
          this.hasSearched.set(true);
          this.isLoading.set(false);
        },
      });
  }

  isFavourite(id: string) {
    return this.favouriteService.favourites().some((meal) => meal.idMeal === id);
  }

  toggleFavourite(meal: Meal, event: MouseEvent) {
    event.stopPropagation();
    this.isFavourite(meal.idMeal)
      ? this.favouriteService.deleteFavourite(meal.idMeal)
      : this.favouriteService.addFavourite(meal);
  }
}
