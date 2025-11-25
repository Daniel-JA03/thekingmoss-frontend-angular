
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { CarritoService } from '../../cliente/carrito/services/carrito.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  username: string | null = '';
  roles: string[] = [];
  expiresAt: string | null = '';

  currentYear = new Date().getFullYear();
  companyName = 'The King Moss';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private carritoService: CarritoService
  ){}

  logout(): void {
  this.carritoService.onLogin()
  localStorage.clear()

  this.authService.logout();
  this.router.navigate(['/']);
  }
}
