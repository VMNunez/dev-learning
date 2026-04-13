import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { MealResponse } from '../models/meal.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private http = inject(HttpClient);

  searchMeals(name: string): Observable<MealResponse> {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`;
    return this.http.get<MealResponse>(url);
  }

  getMealById(id: string): Observable<MealResponse> {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    return this.http.get<MealResponse>(url);
  }
}
