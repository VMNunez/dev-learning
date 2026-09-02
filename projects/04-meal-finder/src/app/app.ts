import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FavouriteService } from './services/favourite.service';
import { NavigationHistoryService } from './services/navigation-history.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private favouriteService = inject(FavouriteService);

  // Injected here only so it starts counting navigations at bootstrap, not on first use.
  private navigationHistory = inject(NavigationHistoryService);

  favouritesNumber = computed(() => this.favouriteService.favourites().length);
}
