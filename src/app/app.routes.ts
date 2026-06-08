import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'nexus/proxy',
    loadComponent: () => import('./pages/proxy-config/proxy-config.component').then(m => m.ProxyConfigComponent)
  },
  {
    path: 'nexus/finanzas',
    loadComponent: () => import('./pages/finances/finances.component').then(m => m.FinancesComponent)
  },
  {
    path: 'nexus/cache',
    loadComponent: () => import('./pages/predictive-cache/predictive-cache.component').then(m => m.PredictiveCacheComponent)
  },
  {
    path: 'nexus/trueque',
    loadComponent: () => import('./pages/data-sharing/data-sharing.component').then(m => m.DataSharingComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
