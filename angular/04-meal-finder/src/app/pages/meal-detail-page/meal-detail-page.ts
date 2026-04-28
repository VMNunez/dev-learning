import { Component, inject, OnInit, signal, computed, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MealService } from '../../services/meal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Meal, MealResponse } from '../../models/meal.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-meal-detail-page',
  imports: [],
  templateUrl: './meal-detail-page.html',
  styleUrl: './meal-detail-page.css',
})
export class MealDetailPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private mealService = inject(MealService);
  private destroyRef = inject(DestroyRef);
  private location = inject(Location);

  mealId: string | null = null;
  mealDetails = signal<Meal | null>(null);
  isLoading = signal<boolean>(false);
  hasLoad = signal<boolean>(false);
  isFavourite = computed(() => this.favouriteMeals().some((meal) => meal.idMeal === this.mealId));
  favouriteMeals = this.mealService.favourites;

  ngOnInit(): void {
    this.mealId = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadMeal(this.mealId as string);
  }

  loadMeal(id: string): void {
    this.isLoading.set(true);
    this.mealService
      .getMealById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (mealResponse: MealResponse) => {
          this.mealDetails.set(mealResponse.meals[0]);
          this.isLoading.set(false);
          this.hasLoad.set(true);
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
          this.hasLoad.set(true);
        },
      });
  }

  toggleFavourite(meal: Meal) {
    this.isFavourite()
      ? this.mealService.deleteFavourite(this.mealId as string)
      : this.mealService.addFavourite(meal);
  }

  goBack() {
    this.location.back();
  }
}
