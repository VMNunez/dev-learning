import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealService } from '../../services/meal.service';
import type { Meal, MealResponse } from '../../models/meal.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-meal-detail-page',
  imports: [RouterLink],
  templateUrl: './meal-detail-page.html',
  styleUrl: './meal-detail-page.css',
})
export class MealDetailPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private mealService = inject(MealService);
  mealId: string | null = null;
  mealDetails = signal<Meal | null>(null);
  favouriteMeals = this.mealService.favourites;
  isFavourite = computed(() => this.favouriteMeals().some((meal) => meal.idMeal === this.mealId));

  ngOnInit(): void {
    this.mealId = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadMeal(this.mealId as string);
  }

  loadMeal(id: string): void {
    this.mealService.getMealById(id).subscribe({
      next: (mealResponse: MealResponse) => {
        this.mealDetails.set(mealResponse.meals[0]);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  toggleFavourite(meal: Meal) {
    this.isFavourite()
      ? this.mealService.deleteFavourite(this.mealId as string)
      : this.mealService.addFavourite(meal);
  }
}
