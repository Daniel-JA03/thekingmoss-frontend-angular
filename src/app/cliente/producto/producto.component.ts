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

  productosBase: ProductoResponse[] = [];

  // paginacion
  pageSize = 6; // 3x3 grid
  lowIndex = 0;
  highIndex = this.pageSize;

  productosFiltrados: ProductoResponse[] = [];


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

        // solo productos con stock
        this.productosBase = data.filter(p => p.stock > 0);

        this.productosFiltrados = this.productosBase;

        // categorias siempre desde el total disponible
        this.actualizarCategorias(this.productosBase);

        this.resetPagination();
        this.actualizarGrid();


        // Volver a asignar imagenes si ya se cargaron
        // if (this.imagenes.length > 0) {
        //   this.asignarImagenes()
        // }
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
    /*if (this.categoriasSeleccionadas.length === 0) {
      this.productosDestacados = this.productosBase.map(p => ({
        ...p,
        imagenUrl: 'assets/images/default.jpg'
    }));

    this.asignarImagenes();
      return;
    }*/

    /*const filtrados = this.productoBase.filter(p =>
      this.categoriasSeleccionadas.includes(p.nombreCategoria)
    );

    this.productosDestacados = filtrados.map(p => ({
      ...p,
      imagenUrl: 'assets/images/default.jpg'
    }));

    this.asignarImagenes();*/

    this.productosFiltrados =
    this.categoriasSeleccionadas.length === 0
      ? this.productosBase
      : this.productosBase.filter(p =>
          this.categoriasSeleccionadas.includes(p.nombreCategoria)
        );

    this.resetPagination();
    this.actualizarGrid();
  }

  actualizarCategorias(productos: ProductoResponse[]) {
    const contador = new Map<string, number>();

    productos.forEach(p => {
      contador.set(
        p.nombreCategoria,
        (contador.get(p.nombreCategoria) || 0) + 1
      )
    })

    // solo categorias con productos disponibles
    this.categorias = Array.from(contador.entries()).map(
      ([nombre, total]) => ({ nombre, total })
    );
  }

  // paginacion
  resetPagination() {
    this.lowIndex = 0;
    this.highIndex = this.pageSize;
  }

  actualizarGrid() {
    this.productosDestacados = this.productosFiltrados
      .slice(this.lowIndex, this.highIndex)
      .map(p => ({
        ...p,
        imagenUrl: 'assets/images/default.jpg'
      }));

    if (this.imagenes.length > 0) {
      this.asignarImagenes();
    }
  }

  nextPage() {
    if (this.highIndex < this.productosFiltrados.length) {
      this.lowIndex += this.pageSize;
      this.highIndex += this.pageSize;
      this.actualizarGrid();
    }
  }

  prevPage() {
    if (this.lowIndex > 0) {
      this.lowIndex -= this.pageSize;
      this.highIndex -= this.pageSize;
      this.actualizarGrid();
    }
  }


}
