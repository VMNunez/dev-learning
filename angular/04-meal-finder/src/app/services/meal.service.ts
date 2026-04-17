import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import type { Meal, MealResponse } from '../models/meal.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private http = inject(HttpClient);
  favourites = signal<Meal[]>(JSON.parse(localStorage.getItem('favourites') ?? '[]'));

  constructor() {
    effect(() => {
      localStorage.setItem('favourites', JSON.stringify(this.favourites()));
    });
  }

  searchMeals(name: string): Observable<MealResponse> {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`;
    return this.http.get<MealResponse>(url);
  }

  getMealById(id: string): Observable<MealResponse> {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    return this.http.get<MealResponse>(url);
  }

  addFavourite(meal: Meal) {
    this.favourites.update((meals) => [...meals, meal]);
  }

  deleteFavourite(mealId: string) {
    this.favourites.update((meals) => meals.filter((meal) => meal.idMeal !== mealId));
  }
}
