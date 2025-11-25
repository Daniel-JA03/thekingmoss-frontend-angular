
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { CarritoService } from '../../carrito/services/carrito.service';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy{
  isScrolled = false;
  mobileMenuOpen = false;
  cartCount = 0

  private destroy$ = new Subject<void>(); // limpiar suscripciones

  constructor(
    private authService: AuthService, 
    private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.checkScroll()
    this.actualizarContadorCarrito()

    // Escuchar cambios en el carrito
    this.carritoService.carritoCambio$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.actualizarContadorCarrito();
      });
      // Escuchar cierre de sesión
      this.authService.logout$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cartCount = 0; // Reiniciar contador al cerrar sesión
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private actualizarContadorCarrito() {
    if (this.authService.isAutheticated()) {
      this.carritoService.obtenerCarrito().subscribe({
        next: (items) => {
          this.cartCount = items.reduce((sum: number, item: any) => sum + item.cantidad, 0);
        },
        error: (err) => {
          console.warn('No se pudo cargar el carrito:', err);
          this.cartCount = 0;
        } 
      })
    } else {
      this.cartCount = 0
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll()
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false
  }

  private checkScroll() {
    this.isScrolled = window.scrollY > 50
  }

  isAuthenticated(): boolean {
    return this.authService.isAutheticated()
  }

  logout(): void {
    this.authService.logout()
  }

  addToCart(producto: any) {
    this.cartCount++
  }
}
