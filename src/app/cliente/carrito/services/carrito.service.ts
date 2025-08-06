import { Injectable } from '@angular/core';
import { ProductoCard } from '../../../interface/entities/producto.interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: { producto: ProductoCard; cantidad: number }[] = [];
  
  // ✅ Emite cambios cuando el carrito cambia
  private carritoSubject = new BehaviorSubject<{ producto: ProductoCard; cantidad: number }[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  constructor(private router: Router) {}

  // ✅ Método corregido: agregarAlCarrito
  agregarAlCarrito(producto: ProductoCard, cantidad: number = 1) {
    const item = this.carrito.find(item => item.producto.idProducto === producto.idProducto);
    if (item) {
      item.cantidad += cantidad;
    } else {
      this.carrito.push({ producto, cantidad });
    }
    this.actualizarCarrito(); // Notifica cambios
  }

  obtenerCarrito() {
    return this.carrito;
  }

  actualizarCantidad(idProducto: number, nuevaCantidad: number) {
  const item = this.carrito.find(item => item.producto.idProducto === idProducto);
  
  if (item) {
    // ✅ Validar que no supere el stock
    if (nuevaCantidad > 0 && nuevaCantidad <= item.producto.stock) {
      item.cantidad = nuevaCantidad;
      this.actualizarCarrito();
    } else if (nuevaCantidad > item.producto.stock) {
      Swal.fire({
        title: 'Stock insuficiente',
        text: `Solo hay ${item.producto.stock} unidades disponibles.`,
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
    // Si cantidad <= 0, se elimina (ya lo manejas en eliminarDelCarrito)
  }
}

  eliminarDelCarrito(idProducto: number) {
    this.carrito = this.carrito.filter(item => item.producto.idProducto !== idProducto);
    this.actualizarCarrito();
  }

  calcularTotal(): number {
    return this.carrito.reduce((total, item) => total + (item.producto.precioUnitario * item.cantidad), 0);
  }

  vaciarCarrito() {
    this.carrito = [];
    this.actualizarCarrito();
  }

  private actualizarCarrito() {
    this.carritoSubject.next([...this.carrito]); // Emite una copia
  }

  comprar() {
    const isAuthenticated = !!localStorage.getItem('token');

    if (isAuthenticated) {
      Swal.fire({
        title: '¡Compra realizada!',
        text: 'Tu pedido se ha procesado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.vaciarCarrito();
    } else {
      Swal.fire({
        title: 'Debes iniciar sesión',
        text: 'Por favor, inicia sesión para realizar la compra.',
        icon: 'warning',
        confirmButtonText: 'Ir a Login'
      }).then(() => {
        this.router.navigate(['/login']);
      });
    }
  }
}
