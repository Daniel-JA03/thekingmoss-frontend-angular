import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  isScrolled = false;
  mobileMenuOpen = false;
  cartCount = 0

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.checkScroll()
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
