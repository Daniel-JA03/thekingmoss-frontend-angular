import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../layout/navbar/navbar.component";
import { FooterComponent } from "../layout/footer/footer.component";

import { RouterModule } from '@angular/router';
import { ProductoCard, ProductoResponse } from '../../interface/entities/producto.interface';
import { ProductoImagenResponse } from '../../interface/entities/producto-imagen.interface';
import { ProductoService } from '../../admin/producto/services/producto.service';
import { ProductoImagenService } from '../../admin/producto/services/producto-imagen.service';
import { SolesPipe } from '../../soles.pipe';
import { CarritoService } from '../carrito/services/carrito.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { CategoriaFiltro } from '../../interface/entities/categoria.interface';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterModule, SolesPipe],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss'
})
export class ProductoComponent implements OnInit {

  productosDestacados: ProductoCard[] = [];
  imagenes: ProductoImagenResponse[] = [];

  categorias: CategoriaFiltro[] = []
  categoriasSeleccionadas: string[] = []

  constructor(
    private productoService: ProductoService,
    private productoImagenService: ProductoImagenService,
    private carritoService: CarritoService
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

        // agrupar y contar categorias
        const contador = new Map<string, number>();
        data.forEach(p => {
          contador.set(
            p.nombreCategoria, 
            (contador.get(p.nombreCategoria) || 0) + 1
          );
        });

        this.categorias = Array.from(contador.entries()).map(
          ([nombre, total]) => ({ nombre, total })
        );

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
    const productoCard: ProductoCard = {
      ...producto,
      imagenUrl: this.obtenerImagenUrl(producto.idProducto)
    };

    this.carritoService.agregarProducto({
      productoId: producto.idProducto,
      cantidad: 1
    }).subscribe({
      next: () => {
        Swal.fire({
          title: 'Añadido al carrito',
          text: `1x ${producto.nombreProducto} agregado.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      }
    })

  }

  // Método para obtener la URL de la imagen
  obtenerImagenUrl(productoId: number): string {
    const imagen = this.imagenes.find(img => img.productoId === productoId);
    return imagen
      ? `http://localhost:8080/imagesProducts/${imagen.imagenUrl.replace(/\\/g, '/')}`
      : 'assets/images/default.jpg';
  }

  //  filtrar por categorias los productos
  onCategoriaChange(event: Event, categoria: string) {
    const checked = (event.target as HTMLInputElement).checked;
  
    if (checked) {
      this.categoriasSeleccionadas.push(categoria);
    } else {
      this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(c => c !== categoria);
    }

    this.filtrarPorCategorias();
  }

  filtrarPorCategorias() {
    // Si no hay filtros -> traer todos los productos
    if (this.categoriasSeleccionadas.length === 0) {
      this.cargarProductos();
      return;
    }

    // varias categorias seleccionadas -> unir resultados
    const request = this.categoriasSeleccionadas.map(cat => this.productoService.obtenerListarProductoPorNombreCategoria(cat));

    forkJoin(request).subscribe({
      next: (response) => {
        // unir y eliminar duplicados
        const productosUnicos = new Map<number, ProductoResponse>();

        response.flat().forEach(p => {
          productosUnicos.set(p.idProducto, p);
        })

        this.productosDestacados = Array.from(productosUnicos.values()).map(p => ({
          ...p,
          imagenUrl: 'assets/images/default.jpg'
        }))

        if (this.imagenes.length > 0) {
          this.asignarImagenes();
        }
      },
      error: err => console.error('Error al filtrar productos por categorías:', err) 
    })


  }

}
