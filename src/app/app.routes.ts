import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  // Ruta inicial redirige a login
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  // Auth
  { path: 'login', component: LoginComponent }
];
