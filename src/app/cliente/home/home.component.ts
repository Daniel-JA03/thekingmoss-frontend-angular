import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from "../layout/footer/footer.component";
import { ProductoCard, ProductoResponse } from '../../interface/entities/producto.interface';
import { ProductoService } from '../../admin/producto/services/producto.service';
import { ProductoImagenResponse } from '../../interface/entities/producto-imagen.interface';
import { ProductoImagenService } from '../../admin/producto/services/producto-imagen.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  productosDestacados: ProductoCard[] = []
  imagenes: ProductoImagenResponse[] = []

  constructor(
    private productoService: ProductoService,
    private productoImagenService: ProductoImagenService
  ) {}

  ngOnInit(): void { 
    this.cargarProductosDestacados();
    this.cargarImagenes()
  }

  cargarProductosDestacados(): void {
    this.productoService.obtenerListaProductos().subscribe({
      next: (data: ProductoResponse[]) => {
        // Inicializa con imagen por defecto
        this.productosDestacados = data.slice(0, 6).map(p => ({
          ...p,
          imagenUrl: 'assets/images/default.jpg' // Imagen temporal
        }));
        // Volver a asignar imágenes si ya se cargaron
        if (this.imagenes.length > 0) {
          this.asignarImagenes();
        }
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
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
        ];
      }
    });
  }

  cargarImagenes(): void {
    this.productoImagenService.obtenerListaProductosImagen().subscribe({
      next: (data: ProductoImagenResponse[]) => {
        this.imagenes = data;
        console.log('Imágenes cargadas:', data);
        this.asignarImagenes(); // Asigna las imágenes a los productos
      },
      error: (err) => {
        console.error('Error al obtener imágenes:', err);
        // Puedes dejar las imágenes por defecto
      },
    });
  }

  asignarImagenes(): void {
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
    event.target.src = 'assets/images/default.jpg'; // Imagen por defecto
  }

  addToCart(producto: ProductoCard) {
    console.log('Producto añadido al carrito:', producto)
    // se conectara con CartService más adelante
  }
}
