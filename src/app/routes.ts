import {Routes} from '@angular/router';
import {CanActivateComponentSidenav} from './pages/component-sidenav/component-sidenav-can-load-guard';

export const MATERIAL_DOCS_ROUTES: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: '', pathMatch: 'full',
    loadChildren: () => import('./pages/homepage').then(m => m.HomepageModule)
  },
  {path: 'categories', redirectTo: '/crm/categories'},
  {
    path: 'guides',
    loadChildren: () => import('./pages/guide-list').then(m => m.GuideListModule)
  },
  {
    path: 'guide/:id',
    loadChildren: () => import('./pages/guide-viewer').then(m => m.GuideViewerModule)
  },
  {
    path: ':section',
    canActivate: [CanActivateComponentSidenav],
    loadChildren: () =>
      import('./pages/component-sidenav/component-sidenav').then(m => m.ComponentSidenavModule)
  },
  {path: '**', redirectTo: ''},
];
