import { Component, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MealService } from '../../services/meal.service';
import type { Meal, MealResponse } from '../../models/meal.model';
import { Location } from '@angular/common';
import { map } from 'rxjs';
import { FavouriteService } from '../../services/favourite.service';

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

  mealId = toSignal(this.activatedRoute.paramMap.pipe(map((params) => params.get('id'))), {
    initialValue: null,
  });

  mealDetails = signal<Meal | null>(null);
  isLoading = signal<boolean>(false);
  hasLoad = signal<boolean>(false);

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
      this.hasLoad.set(false);

      const subscription = this.mealService.getMealById(id).subscribe({
        next: (mealResponse: MealResponse) => {
          this.mealDetails.set(mealResponse.meals?.[0] ?? null);
          this.isLoading.set(false);
          this.hasLoad.set(true);
        },
        error: (err) => {
          console.error(err);
          this.mealDetails.set(null);
          this.isLoading.set(false);
          this.hasLoad.set(true);
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
    this.location.back();
  }
}
