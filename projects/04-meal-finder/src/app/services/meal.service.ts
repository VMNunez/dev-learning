import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Meal, MealResponse } from '../models/meal.model';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private http = inject(HttpClient);

  private readonly baseUrl = 'https://www.themealdb.com/api/json/v1/1';

  searchMeals(name: string): Observable<Meal[]> {
    const params = new HttpParams().set('s', name);

    return this.http.get<MealResponse>(`${this.baseUrl}/search.php`, { params }).pipe(
      map((response) => response.meals ?? []),
      this.handleFailure('search meals'),
    );
  }

  getMealById(id: string): Observable<Meal | null> {
    const params = new HttpParams().set('i', id);

    return this.http.get<MealResponse>(`${this.baseUrl}/lookup.php`, { params }).pipe(
      map((response) => response.meals?.[0] ?? null),
      this.handleFailure('load the meal'),
    );
  }

  private handleFailure<T>(action: string) {
    return (source: Observable<T>) =>
      source.pipe(
        catchError((error: unknown) => {
          console.error(`MealService: could not ${action}`, error);
          return throwError(() => new Error(`Could not ${action}.`));
        }),
      );
  }
}
