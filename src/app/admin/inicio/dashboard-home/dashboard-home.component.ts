import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductoResponse } from '../../../interface/entities/producto.interface';
import { ProductoImagenResponse, ProductoSinImagen } from '../../../interface/entities/producto-imagen.interface';
import { ProductoService } from '../../producto/services/producto.service';
import { PedidoService } from '../../pedido/services/pedido.service';
import { PedidoResponse, TipoEstadoPedido } from '../../../interface/entities/pedido.interface';
import Swal from 'sweetalert2';
import { ProductoImagenService } from '../../producto/services/producto-imagen.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CrearProducComponent } from '../../producto/crear-produc/crear-produc.component';

import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CrearProducComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {
  // Tarjetas de resumen
  totalProductos = 0;
  totalPedidos = 0;
  pedidosGenerados = 0;

  // Productos con bajo stock
  productosBajoStock: ProductoResponse[] = [];

  productoSeleccionado: ProductoResponse | null = null

  // Notificaciones
  productosSinImagen: ProductoSinImagen[] = [];
  mostrarNotificaciones = false;

  // Acceso al enum
  TipoEstadoPedido = TipoEstadoPedido;

  constructor(
    private productoService: ProductoService,
    private pedidoService: PedidoService,
    private productoImagenService: ProductoImagenService,
    // private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    // Cargar productos
    this.productoService.obtenerListaProductos().subscribe({
      next: (productos: ProductoResponse[]) => {
        this.totalProductos = productos.length;
        this.productosBajoStock = productos.filter(p => p.stock < 10);

        // Detectar productos sin imagen
        this.productoImagenService.obtenerListaProductosImagen().subscribe({
          next: (imagenes: ProductoImagenResponse[]) => {
            const productosConImagen = imagenes.map(img => img.productoId);
            this.productosSinImagen = productos
              .filter(p => !productosConImagen.includes(p.idProducto))
              .map(p => ({
                idProducto: p.idProducto,
                nombreProducto: p.nombreProducto
              }));
          },
          error: (err) => {
            console.error('Error al cargar imágenes:', err);
            // Si falla, asumimos todos sin imagen
            this.productosSinImagen = productos.map(p => ({
              idProducto: p.idProducto,
              nombreProducto: p.nombreProducto
            }));
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
      }
    });

    // Cargar pedidos
    this.pedidoService.obtenerListaPedidos().subscribe({
      next: (pedidos: PedidoResponse[]) => {
        this.totalPedidos = pedidos.length;
        this.pedidosGenerados = pedidos.filter(p => p.tipoEstadoPedido === TipoEstadoPedido.GENERADO).length;
      },
      error: (err) => {
        console.error('Error al cargar pedidos:', err);
        Swal.fire('Error', 'No se pudieron cargar los pedidos', 'error');
      }
    });
  }

  get mensajeNotificacion(): string {
    const count = this.productosSinImagen.length;
    if (count === 0) return 'No tienes productos sin imagen.';
    if (count === 1) return `Tienes 1 producto sin imagen.`;
    return `Tienes ${count} productos sin imagen.`;
  }

  editarProducto(producto: ProductoResponse): void {
    this.productoSeleccionado = { ...producto }

    const modalElement = document.getElementById('nuevoProductoModal')
    if(modalElement) {
      const modal = new bootstrap.Modal(modalElement)
      modal.show()
    }
  }
}