import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductoCard, ProductoResponse } from '../../interface/entities/producto.interface';
import { ProductoService } from '../../admin/producto/services/producto.service';
import Swal from 'sweetalert2';
import { ProductoImagenService } from '../../admin/producto/services/producto-imagen.service';
import { ProductoImagenResponse } from '../../interface/entities/producto-imagen.interface';
import { SolesPipe } from '../../soles.pipe';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule, SolesPipe],
  templateUrl: './detalle-producto.component.html',
  styleUrl: './detalle-producto.component.scss'
})
export class DetalleProductoComponent implements OnInit {

   productoSeleccionado: ProductoCard | null = null;
   cantidad: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private productoImagenService: ProductoImagenService
  ) {}

  ngOnInit(): void {
    this.cargarProducto();
  }

  cargarProducto() {
  const idParam = this.route.snapshot.paramMap.get('id');

  if (!idParam) {
    Swal.fire('Error', 'ID no proporcionado.', 'error');
    return;
  }

  const idProducto = Number(idParam);

  if (isNaN(idProducto)) {
    Swal.fire('Error', 'ID de producto inválido.', 'error');
    return;
  }

  // data es un objeto directo, no un array
  this.productoService.obtenerProductoPorId(idProducto).subscribe({
    next: (producto: ProductoResponse) => {
      console.log('Producto recibido:', producto); 

      if (!producto || producto.idProducto === undefined) {
        Swal.fire('Error', 'Datos del producto inválidos.', 'error');
        return;
      }

      // Asignar al producto seleccionado
      this.productoSeleccionado = {
        ...producto,
        imagenUrl: 'assets/images/default.jpg'
      };

      // la cantidad no debe superar el stock
      this.cantidad = 1

      // Cargar imagen
      this.productoImagenService.obtenerListaProductosImagen().subscribe({
        next: (imagenes: ProductoImagenResponse[]) => {
          const imagen = imagenes.find(img => img.productoId === producto.idProducto);
          if (imagen && this.productoSeleccionado) {
            this.productoSeleccionado.imagenUrl = `http://localhost:8080/imagesProducts/${imagen.imagenUrl.replace(/\\/g, '/')}`;
          }
        },
        error: (err) => {
          console.warn('Error al cargar imágenes:', err);
        }
      });
    },
    error: (err) => {
      console.error('Error al cargar producto:', err);
      Swal.fire('Error', 'No se pudo cargar el producto.', 'error');
    }
  });
}

  handleImageError(event: any) {
    event.target.src = 'assets/images/default.jpg';
  }

  // cambiar cantidad
  cambiarCantidad(cambio: number) {
    const nuevaCantidad = this.cantidad + cambio;
    if (this.productoSeleccionado && nuevaCantidad >= 1 && nuevaCantidad <= this.productoSeleccionado.stock) {
      this.cantidad = nuevaCantidad;
    }
  }

  // ✅ Añadir al carrito con cantidad
  addToCart() {
    if (!this.productoSeleccionado) return;

    const item = {
      producto: this.productoSeleccionado,
      cantidad: this.cantidad,
      precioTotal: this.productoSeleccionado.precioUnitario * this.cantidad
    };

    console.log('Producto añadido al carrito:', item);
    // Aquí conectarás con CartService
    Swal.fire({
      title: 'Producto añadido',
      text: `${this.cantidad}x ${this.productoSeleccionado.nombreProducto} agregado al carrito.`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }

}
