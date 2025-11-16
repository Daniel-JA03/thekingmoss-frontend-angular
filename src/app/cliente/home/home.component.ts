import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "../layout/footer/footer.component";
import { ProductoCard, ProductoResponse } from '../../interface/entities/producto.interface';
import { ProductoService } from '../../admin/producto/services/producto.service';
import { ProductoImagenResponse } from '../../interface/entities/producto-imagen.interface';
import { ProductoImagenService } from '../../admin/producto/services/producto-imagen.service';
import { SolesPipe } from '../../soles.pipe';
import { CarritoService } from '../carrito/services/carrito.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule, FooterComponent, SolesPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  productosDestacados: ProductoCard[] = []
  imagenes: ProductoImagenResponse[] = []

  constructor(
    private router: Router,
    private authService: AuthService,
    private productoService: ProductoService,
    private productoImagenService: ProductoImagenService,
    private carritoService: CarritoService
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

  // Añadir al carrito desde el Home
  addToCart(producto: ProductoCard) {
    // verificar si está autenticado
    if (!this.authService.isAutheticated()) {
      Swal.fire({
        title: 'Inicia sesión para continuar',
        text: 'Debes iniciar sesión para agregar productos al carrito.',
        icon: 'warning',
        confirmButtonText: 'Ir a Login'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }
    // si esta autenticado, añadir al carrito
    this.carritoService.agregarProducto({
      productoId: producto.idProducto,
      cantidad: 1
    }).subscribe({
      next: () => {
        Swal.fire({
          title: 'Producto añadido',
          text: `1x ${producto.nombreProducto} agregado al carrito.`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 1500,
          timerProgressBar: true
        });
      }
    }) 
  }
}
