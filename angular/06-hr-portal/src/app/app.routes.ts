import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { deactivateGuard } from './core/guards/deactivate-guard';
import { noAuthGuard } from './core/guards/no-auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard-page/dashboard-page').then((m) => m.DashboardPage),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin-page/admin-page').then((m) => m.AdminPage),
  },
  {
    path: 'employees',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/employee-page/employee-page').then((m) => m.EmployeePage),
  },
  {
    path: 'departments',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./pages/department-page/department-page').then((m) => m.DepartmentPage),
  },
  {
    path: 'departments/new',
    canActivate: [authGuard, adminGuard],
    canDeactivate: [deactivateGuard],
    loadComponent: () =>
      import('./pages/department-page/department-form/department-form').then(
        (m) => m.DepartmentForm,
      ),
  },
  {
    path: 'departments/edit/:id',
    canActivate: [authGuard, adminGuard],
    canDeactivate: [deactivateGuard],
    loadComponent: () =>
      import('./pages/department-page/department-form/department-form').then(
        (m) => m.DepartmentForm,
      ),
  },
  {
    path: 'leave-requests',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/leave-request-page/leave-request-page').then((m) => m.LeaveRequestPage),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
