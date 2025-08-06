import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../layout/navbar/navbar.component";
import { FooterComponent } from "../layout/footer/footer.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductoCard, ProductoResponse } from '../../interface/entities/producto.interface';
import { ProductoImagenResponse } from '../../interface/entities/producto-imagen.interface';
import { ProductoService } from '../../admin/producto/services/producto.service';
import { ProductoImagenService } from '../../admin/producto/services/producto-imagen.service';
import { SolesPipe } from '../../soles.pipe';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule, SolesPipe],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss'
})
export class ProductoComponent implements OnInit {

  productosDestacados: ProductoCard[] = [];
  imagenes: ProductoImagenResponse[] = [];

  constructor(
    private productoService: ProductoService,
    private productoImagenService: ProductoImagenService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarImagenes();
  }

  cargarProductos() {
    this.productoService.obtenerListaProductos().subscribe({
      next: (data: ProductoResponse[]) => {
        this.productosDestacados = data.map(p => ({
          ...p,
          imagenUrl: 'assets/images/default.jpg'
        }));
        // Volver a asignar imagenes si ya se cargaron
        if (this.imagenes.length > 0) {
          this.asignarImagenes()
        }
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.productosDestacados = [
          {
            idProducto: 0,
            nombreProducto: 'Error al cargar',
            descripcion: 'Intenta más tarde',
            stock: 0,
            precioUnitario: 0,
            descuento: 0,
            categoriaId: 0,
            nombreCategoria: '',
            imagenUrl: 'assets/images/default.jpg'
          }
        ]
      }
    });
  }

  cargarImagenes() {
    this.productoImagenService.obtenerListaProductosImagen().subscribe({
      next: (data: ProductoImagenResponse[]) => {
        this.imagenes = data;
        console.log('Imágenes cargadas:', data)
        this.asignarImagenes();
      },
      error: (err) => {
        console.error('Error al cargar imagenes:', err)
      }
    })
  }

  asignarImagenes() {
    console.log('Productos destacados:', this.productosDestacados);
    console.log('Imágenes cargadas:', this.imagenes);

    this.productosDestacados = this.productosDestacados.map(producto => {
      const imagen = this.imagenes.find(img => img.productoId === producto.idProducto);
      
      console.log(`Buscando imagen para productoId ${producto.idProducto}:`, imagen); // 🔍 Depuración

      return {
        ...producto,
        imagenUrl: imagen
          ? `http://localhost:8080/imagesProducts/${imagen.imagenUrl.replace(/\\/g, '/')}`
          : 'assets/images/default.jpg'
      };
    });
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/default.jpg';
  }

  addToCart(producto: ProductoResponse) {
    console.log('Producto añadido al carrito:', producto)
  }

}
