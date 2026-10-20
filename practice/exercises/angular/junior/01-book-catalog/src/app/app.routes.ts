import { Routes } from '@angular/router';

// One demo route per exercise that has something to show. Given, not an answer file.
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'ex03' },
  {
    path: 'ex03',
    title: 'Ex 3 — ¿Por qué está vacía?',
    loadComponent: () => import('./ex03-empty-states/empty-states').then((m) => m.EmptyStates),
  },
  {
    path: 'ex04/:id',
    title: 'Ex 4 — Detalle',
    loadComponent: () => import('./ex04-book-detail/book-detail').then((m) => m.BookDetail),
  },
  { path: '**', redirectTo: 'ex03' },
];
