import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'signin',
    data: { footer: 'none' },
    loadComponent: () =>
      import('./features/auth/signin/signin.component').then(
        (m) => m.SigninComponent,
      ),
  },
  {
    path: 'register',
    data: { footer: 'none' },
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./features/menu/menu/menu.component').then(
        (m) => m.MenuComponent,
      ),
  },
  {
    path: 'cart',
    data: { footer: 'compact' },
    loadComponent: () =>
      import('./features/cart/cart.component').then((m) => m.CartComponent),
  },
];
