import { Routes } from '@angular/router';
import { SearchPage } from './pages/search-page/search-page';
import { MealDetailPage } from './pages/meal-detail-page/meal-detail-page';

export const routes: Routes = [
  {
    path: '',
    component: SearchPage,
  },
  {
    path: 'detail/:id',
    component: MealDetailPage,
  },
];
