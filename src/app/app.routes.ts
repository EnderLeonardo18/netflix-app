import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NexusDashboardComponent } from './pages/nexus-dashboard/nexus-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Netflix - Inicio'
  },
  {
    path: 'nexus-admin',
    component: NexusDashboardComponent,
    title: 'Netflix - Nexus Panel'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
