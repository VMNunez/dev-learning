import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FavouriteService } from './services/favourite.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private favouriteService = inject(FavouriteService);

  favouritesNumber = computed(() => this.favouriteService.favourites().length);
}
