import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';

export const routes: Routes = [
  // Ruta inicial redirige a login
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  // Auth
  { path: 'login', component: LoginComponent },

  {
    path: 'admin/dashboard',
    component: DashboardComponent
  }
];
