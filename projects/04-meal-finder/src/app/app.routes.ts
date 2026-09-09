import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/search-page/search-page').then((m) => m.SearchPage),
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./pages/meal-detail-page/meal-detail-page').then((m) => m.MealDetailPage),
  },
  {
    path: 'favourites',
    loadComponent: () =>
      import('./pages/favourites-page/favourites-page').then((m) => m.FavouritesPage),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found-page/not-found-page').then((m) => m.NotFoundPage),
  },
];
