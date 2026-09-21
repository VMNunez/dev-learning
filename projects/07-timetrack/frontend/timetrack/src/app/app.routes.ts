import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { noAuthGuard } from './core/guards/no-auth-guard';
import { managerGuard } from './core/guards/manager-guard';
import { roleMatch } from './core/guards/role-match';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Log in',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        title: 'Dashboard',
        canMatch: [roleMatch('EMPLOYEE')],
        loadComponent: () =>
          import('./pages/dashboard/employee-dashboard/employee-dashboard').then(
            (m) => m.EmployeeDashboard,
          ),
      },
      {
        path: 'dashboard',
        title: 'Dashboard',
        canMatch: [roleMatch('MANAGER')],
        loadComponent: () =>
          import('./pages/dashboard/manager-dashboard/manager-dashboard').then(
            (m) => m.ManagerDashboard,
          ),
      },
      {
        path: 'entries',
        title: 'Entries',
        loadComponent: () => import('./pages/entries/entries').then((m) => m.Entries),
      },
      {
        path: 'projects',
        title: 'Projects',
        canActivate: [managerGuard],
        loadComponent: () => import('./pages/projects/projects').then((m) => m.Projects),
      },
      {
        path: 'approvals',
        title: 'Approvals',
        canActivate: [managerGuard],
        loadComponent: () => import('./pages/approvals/approvals').then((m) => m.Approvals),
      },
      {
        path: 'team',
        title: 'Team',
        canActivate: [managerGuard],
        loadComponent: () => import('./pages/team/team').then((m) => m.Team),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
