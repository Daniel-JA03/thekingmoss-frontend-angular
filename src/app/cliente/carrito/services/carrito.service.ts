import { Injectable } from '@angular/core';
import { ProductoCard } from '../../../interface/entities/producto.interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';
import { PedidoService } from '../../../admin/pedido/services/pedido.service';
import { DetallePedidoRequest } from '../../../interface/entities/detalle-pedido.interface';
import { PedidoRequest, TipoEstadoPedido } from '../../../interface/entities/pedido.interface';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: { producto: ProductoCard; cantidad: number }[] = [];
  
  // ✅ Emite cambios cuando el carrito cambia
  private carritoSubject = new BehaviorSubject<{ producto: ProductoCard; cantidad: number }[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  constructor(
    private router: Router,
    private pedidoService: PedidoService
  ) {}

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


  comprar() {
    const isAuthenticated = !!localStorage.getItem('token');

    if (!isAuthenticated) {
      Swal.fire({
        title: 'Debes iniciar sesión',
        text: 'Por favor, inicia sesión para realizar la compra.',
        icon: 'warning',
        confirmButtonText: 'Ir a Login'
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    if (this.carrito.length === 0) {
      Swal.fire('Carrito vacío', 'No hay productos para comprar.', 'info');
      return;
    }

    // Obtener datos del usuario desde localStorage
    const username = localStorage.getItem('username');
    const usuarioId = Number(localStorage.getItem('usuarioId')); // ❗ Asegúrate de que esto exista

    // Si no tienes el usuarioId, puedes decodificar el JWT o hacer un /me
    if (!usuarioId) {
      Swal.fire('Error', 'No se pudo obtener el ID del usuario.', 'error');
      return;
    }

    // Mapear carrito a detalles del pedido
    const detalles: DetallePedidoRequest[] = this.carrito.map(item => ({
      productoId: item.producto.idProducto,
      cantidad: item.cantidad
    }));

    // Crear el pedido
    const pedido: PedidoRequest = {
      fechaPedido: new Date(),
      tipoEntrega: 'DOMICILIO', // puedes cambiarlo
      informacionPedido: `Pedido de ${username}`,
      instruccionEntrega: 'Dejar en puerta',
      tipoEstadoPedido: TipoEstadoPedido.GENERADO,
      usuarioId: usuarioId,
      detalles: detalles
    };

    // ✅ Enviar al backend
    this.pedidoService.agregarPedido(pedido).subscribe({
      next: (response) => {
        Swal.fire({
          title: '¡Compra realizada!',
          text: `Tu pedido #${response.pedidoId} ha sido procesado.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.vaciarCarrito();
      },
      error: (err) => {
        console.error('Error al crear el pedido', err);
        Swal.fire('Error', 'No se pudo procesar el pedido. Inténtalo más tarde.', 'error');
      }
    });
  }

  vaciarCarrito() {
    this.carrito = [];
    this.actualizarCarrito();
  }

  private actualizarCarrito() {
    this.carritoSubject.next([...this.carrito]); // Emite una copia
  }
}
