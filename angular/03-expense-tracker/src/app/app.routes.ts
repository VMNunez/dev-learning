import { Routes } from '@angular/router';
import { AddTransactionPage } from './pages/add-transaction-page/add-transaction-page';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';

export const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
  },
  {
    path: 'add',
    component: AddTransactionPage,
  },
];
