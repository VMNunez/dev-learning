import { Component, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MealService } from '../../services/meal.service';
import type { Meal } from '../../models/meal.model';
import { Location } from '@angular/common';
import { map } from 'rxjs';
import { FavouriteService } from '../../services/favourite.service';
import { NavigationHistoryService } from '../../services/navigation-history.service';

@Component({
  selector: 'app-meal-detail-page',
  imports: [],
  templateUrl: './meal-detail-page.html',
  styleUrl: './meal-detail-page.css',
})
export class MealDetailPage {
  private activatedRoute = inject(ActivatedRoute);
  private mealService = inject(MealService);
  private favouriteService = inject(FavouriteService);
  private location = inject(Location);
  private router = inject(Router);
  private navigationHistory = inject(NavigationHistoryService);

  mealId = toSignal(this.activatedRoute.paramMap.pipe(map((params) => params.get('id'))), {
    initialValue: null,
  });

  mealDetails = signal<Meal | null>(null);
  isLoading = signal<boolean>(false);
  loadFinished = signal<boolean>(false);
  hasError = signal<boolean>(false);

  isFavourite = computed(() => this.favouriteService.favouriteIds().has(this.mealId() ?? ''));
  favouriteLabel = computed(() => {
    const name = this.mealDetails()?.strMeal ?? 'this meal';
    return this.isFavourite() ? `Remove ${name} from favourites` : `Add ${name} to favourites`;
  });

  constructor() {
    effect((onCleanup) => {
      const id = this.mealId();
      if (!id) return;

      this.isLoading.set(true);
      this.loadFinished.set(false);
      this.hasError.set(false);

      const subscription = this.mealService.getMealById(id).subscribe({
        next: (meal: Meal | null) => {
          this.mealDetails.set(meal);
          this.isLoading.set(false);
          this.loadFinished.set(true);
        },
        error: () => {
          this.mealDetails.set(null);
          this.hasError.set(true);
          this.isLoading.set(false);
          this.loadFinished.set(true);
        },
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }

  toggleFavourite(meal: Meal) {
    const id = this.mealId();
    if (!id) return;

    this.isFavourite()
      ? this.favouriteService.deleteFavourite(id)
      : this.favouriteService.addFavourite(meal);
  }

  goBack() {
    if (this.navigationHistory.canGoBack()) {
      this.location.back();
      return;
    }

    this.router.navigate(['/']);
  }
}
