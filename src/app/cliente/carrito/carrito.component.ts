import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { CarritoService } from './services/carrito.service';
import { CarritoResponse } from '../../interface/entities/carrito.interfaces';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth/services/auth.service';
import { PedidoService } from '../../admin/pedido/services/pedido.service';
import { DetallePedidoRequest } from '../../interface/entities/detalle-pedido.interface';
import { PedidoRequest, TipoEstadoPedido } from '../../interface/entities/pedido.interface';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {
  carrito: CarritoResponse[] = [];
  loading = false;
  isAutheticated = false;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private pedidoService: PedidoService,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.isAutheticated = this.authService.isAutheticated();
    if (this.isAutheticated) {
      this.cargarCarrito();
    }
  }

  trackByProducto(index: number, item: CarritoResponse): number {
    return item.producto.productoId;
  }

  cargarCarrito(): void {
    this.loading = true;
    this.carritoService.obtenerCarrito().subscribe({
      next: (data) => {
        this.carrito = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el carrito', err);
        this.loading = false;
      }
    })
  }

  cambiarCantidad(idProducto: number, cambio: number): void {
    const item = this.carrito.find(i => i.producto.productoId === idProducto);
    if (!item) return;

    const nuevaCantidad = item.cantidad + cambio;
    if (nuevaCantidad < 1) {
      this.eliminar(idProducto);
      return;
    }

    if (nuevaCantidad > item.producto.stock) {
      Swal.fire({
        title: 'Stock insuficiente',
        text: `Solo hay ${item.producto.stock} unidades disponibles.`,
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    this.carritoService.actualizarCantidad({ productoId: idProducto, cantidad: nuevaCantidad }).subscribe({
      next: () => this.cargarCarrito(),
      error: () => {} // ya manejado en el servicio
    });
  }

  eliminar(idProducto: number): void {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: '¿Estás seguro de eliminar este producto del carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carritoService.eliminarProducto(idProducto).subscribe({
          next: () => this.cargarCarrito(),
          error: () => {}
        });
      }
    });
  }

  vaciarCarrito(): void {
    if (this.carrito.length === 0) return;

    Swal.fire({
      title: '¿Vaciar carrito?',
      text: 'Se eliminarán todos los productos.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carritoService.vaciarCarrito().subscribe({
          next: () => this.cargarCarrito(),
          error: () => {}
        });
      }
    });
  }

  calcularTotal(): number {
    return this.carrito.reduce(
      (total, item) => total + (item.producto.precioUnitario * item.cantidad), 0
    )
  }

  comprar() {
    const isAutheticated = this.authService.isAutheticated();

    if (!isAutheticated) {
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

    const usuarioId = this.authService.getUserId();
    const username = localStorage.getItem('username');

    if (!usuarioId) {
      Swal.fire('Error', 'No se pudo obtener el ID del usuario.', 'error');
      return;
    }

    // mapear carrito a detalles de pedido
    const detalles: DetallePedidoRequest[] = this.carrito.map(item => ({
      productoId: item.producto.productoId,
      cantidad: item.cantidad
    }))

    // usar email del usuario autenticado
    const email = this.authService.getEmail() || 'cliente@thekingmoss.com';

    // Crear pedido
    const pedido: PedidoRequest = {
      fechaPedido: new Date(),
      tipoEntrega: 'DOMICILIO',
      informacionPedido: `Pedido de ${username || 'usuario'}`,
      instruccionEntrega: 'Dejar en puerta',
      tipoEstadoPedido: TipoEstadoPedido.GENERADO,
      usuarioId: +usuarioId,
      detalles: detalles
    }

    // Enviar al backend
    this.pedidoService.agregarPedido(pedido).subscribe({
      next: (response) => {

         // ✅ Solo redirige, no recargues el carrito
        this.router.navigate(['/checkout', response.pedidoId]);

        Swal.fire({
          title: '¡Compra iniciada!',
          text: `Tu pedido #${response.pedidoId} está listo para pagar.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        // ✅ Vacía el carrito localmente
        this.carrito = [];
        this.carritoService.emitirCambio(); // notifica al navbar
      },
      error: (err) => {
        console.error('Error al crear el pedido', err);
        
        // Obtener el mensaje de error del backend
        let mensaje = 'No se pudo procesar el pedido. Inténtalo más tarde.';
        if (err.error?.message) {
          mensaje = err.error.message;
        } else if (err.message) {
          mensaje = err.message;
        }

        // Si el mensaje contiene "Stock insuficiente", extraer el nombre del producto
        if (mensaje.includes('Stock insuficiente')) {
          const match = mensaje.match(/para el producto:\s*([^[\]]+)/);
          if (match && match[1]) {
            const nombreProducto = match[1].trim();
            mensaje = `El producto "${nombreProducto}" tiene stock insuficiente.`;
          }
        }

        Swal.fire({
          title: 'Error',
          text: mensaje,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    })

  }

}
