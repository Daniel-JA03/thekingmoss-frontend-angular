import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { RouterModule } from '@angular/router';
import { ProductoCard } from '../../interface/entities/producto.interface';
import { CarritoService } from './services/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent implements OnInit {
  carrito: { producto: ProductoCard; cantidad: number }[] = []

  constructor(private carritoService: CarritoService) {}


  ngOnInit(): void {
    this.carrito = this.carritoService.obtenerCarrito()
  }

  cambiarCantidad(idProducto: number, cambio: number) {
  const item = this.carrito.find(item => item.producto.idProducto === idProducto);
  if (item) {
    const nuevaCantidad = item.cantidad + cambio;
    this.carritoService.actualizarCantidad(idProducto, nuevaCantidad);
    this.carrito = this.carritoService.obtenerCarrito(); // Actualiza vista
  }
}

  eliminar(idProducto: number) {
    this.carritoService.eliminarDelCarrito(idProducto);
    this.carrito = this.carritoService.obtenerCarrito(); // Actualiza vista
  }

  calcularTotal(): number {
    return this.carritoService.calcularTotal();
  }

  comprar() {
    this.carritoService.comprar();
  }

}
