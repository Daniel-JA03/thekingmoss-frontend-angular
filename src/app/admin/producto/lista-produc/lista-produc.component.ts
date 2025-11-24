
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SolesPipe } from '../../../soles.pipe';
import { ProductoResponse } from '../../../interface/entities/producto.interface';
import { ProductoImagenResponse } from '../../../interface/entities/producto-imagen.interface';
import { ProductoService } from '../services/producto.service';
import { ProductoImagenService } from '../services/producto-imagen.service';
import Swal from 'sweetalert2';
// import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { CrearProducComponent } from "../crear-produc/crear-produc.component";

@Component({
  selector: 'app-lista-produc',
  standalone: true,
  imports: [ReactiveFormsModule, SolesPipe, CrearProducComponent],
  templateUrl: './lista-produc.component.html',
  styleUrl: './lista-produc.component.scss',
})
export class ListaProducComponent implements OnInit {
  productos: ProductoResponse[] = [];
  imagenes: ProductoImagenResponse[] = [];
  productoSeleccionado: ProductoResponse | null = null;

  constructor(
    private productoService: ProductoService,
    private productoImagenServie: ProductoImagenService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarImagenes();
  }

  cargarProductos() {
  this.productoService.obtenerListaProductos().subscribe({
    next: (data) => {
      this.productos = data;
      
    },
    error: (err) => {
      console.error('Error al obtener productos:', err);
      Swal.fire('Error', 'No se pudo cargar la lista de productos', 'error');
    },
  });
}

  cargarImagenes(): void {
    this.productoImagenServie.obtenerListaProductosImagen().subscribe({
      next: (data) => {
        this.imagenes = data;
        console.log('Imagenes cargadas:', data)
      },
      error: (err) => {
        console.error('Error al obtener imágenes:', err);
      },
    });
  }

  obtenerImagenUrl(productoId: number): string {
    const imagen = this.imagenes.find((img) => img.productoId === productoId);
    return imagen
      ? `http://localhost:8080/imagesProducts/${imagen.imagenUrl.replace(/\\/g, '/')}`
      : 'assets/images/default.jpg';
  }

  abrirModal() {
    this.productoSeleccionado = null;
    const modalElement = document.getElementById('nuevoProductoModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  editarProducto(producto: ProductoResponse): void {

    console.log('Producto a editar:', producto)

    this.productoSeleccionado = {
      ...producto,
      categoriaId: producto.categoriaId
    };

    const modalElement = document.getElementById('nuevoProductoModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  eliminarProducto(productoId: number) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el producto de forma permanente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      this.productoService.eliminarProducto(productoId).subscribe({
        next: () => {
          Swal.fire('Eliminado', 'Producto eliminado correctamente', 'success');
          this.cargarProductos(); // Recarga la lista
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
          Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
        },
      });
    }
  });
}
}
