import { Component, inject, signal, computed } from '@angular/core';
import type { Meal } from '../../models/meal.model';
import { RouterLink } from '@angular/router';
import { FavouriteService } from '../../services/favourite.service';

@Component({
  selector: 'app-favourites-page',
  imports: [RouterLink],
  templateUrl: './favourites-page.html',
  styleUrl: './favourites-page.css',
})
export class FavouritesPage {
  private favouriteService = inject(FavouriteService);
  selectedCategory = signal<string>('');
  favourites = this.favouriteService.favourites;

  isFavourite(id: string) {
    return this.favourites().some((favourite) => favourite.idMeal === id);
  }

  toggleFavourite(favourite: Meal, event: MouseEvent) {
    event.stopPropagation();
    if (this.isFavourite(favourite.idMeal)) {
      this.favouriteService.deleteFavourite(favourite.idMeal);
      if (this.filteredFavourites().length === 0) {
        this.selectedCategory.set('');
      }
    } else {
      this.favouriteService.addFavourite(favourite);
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
