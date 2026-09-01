import { Component, inject, signal, effect } from '@angular/core';
import { MealService } from '../../services/meal.service';
import type { Meal, MealResponse } from '../../models/meal.model';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FavouriteService } from '../../services/favourite.service';

@Component({
  selector: 'app-search-page',
  imports: [RouterLink],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css',
})
export class SearchPage {
  private mealService = inject(MealService);
  private favouriteService = inject(FavouriteService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  meals = signal<Meal[]>([]);
  hasSearched = signal<boolean>(false);
  searchTerm = signal<string>('');
  hasError = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  private queryTerm = toSignal(
    this.activatedRoute.queryParamMap.pipe(map((params) => params.get('q') ?? '')),
    { initialValue: '' },
  );

  constructor() {
    effect((onCleanup) => {
      const term = this.queryTerm().trim();
      this.searchTerm.set(term);

      if (!term) {
        this.meals.set([]);
        this.hasSearched.set(false);
        return;
      }

      this.isLoading.set(true);
      this.hasError.set(false);

      const subscription = this.mealService.searchMeals(term).subscribe({
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

      onCleanup(() => subscription.unsubscribe());
    });
  }

  onSearchMeals(meal: string) {
    const term = meal.trim();
    if (!term) return;

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { q: term },
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
