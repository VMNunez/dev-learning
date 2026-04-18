import { Component, inject, signal, computed } from '@angular/core';
import { MealService } from '../../services/meal.service';
import type { Meal } from '../../models/meal.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favourites-page',
  imports: [RouterLink],
  templateUrl: './favourites-page.html',
  styleUrl: './favourites-page.css',
})
export class FavouritesPage {
  private mealService = inject(MealService);
  selectedCategory = signal<string>('');
  favourites = this.mealService.favourites;

  isFavourite(id: string) {
    return this.favourites().some((favourite) => favourite.idMeal === id);
  }

  toggleFavourite(favourite: Meal, event: MouseEvent) {
    event.stopPropagation();
    if (this.isFavourite(favourite.idMeal)) {
      this.mealService.deleteFavourite(favourite.idMeal);
      this.filteredFavourites().length === 0 && this.selectedCategory.set('');
    } else {
      this.mealService.addFavourite(favourite);
    }
  }

  allCategories = computed(() => {
    return [...new Set(this.favourites().map((meal) => meal.strCategory))];
  });

  onSelectedCategory(category: string) {
    this.selectedCategory.set(category);
  }

  filteredFavourites = computed(() =>
    this.selectedCategory() === ''
      ? this.favourites()
      : this.favourites().filter((favourite) => favourite.strCategory === this.selectedCategory()),
  );
}
