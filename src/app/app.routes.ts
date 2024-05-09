import { Routes } from '@angular/router';
import { AuthGuardService } from './services/auth/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'profile',
    canActivate: [AuthGuardService],
    loadComponent: () =>
      import('./pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'devs',
    canActivate: [AuthGuardService],
    loadComponent: () =>
      import('./pages/devs/devs.page').then((m) => m.DevsPage),
  },
  {
    path: 'bookmarks',
    canActivate: [AuthGuardService],
    loadComponent: () =>
      import('./pages/bookmarks/bookmarks.page').then((m) => m.BookmarksPage),
  },
];
