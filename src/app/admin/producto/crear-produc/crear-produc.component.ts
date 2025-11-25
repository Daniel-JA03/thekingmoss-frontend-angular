
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoRequest, ProductoResponse } from '../../../interface/entities/producto.interface';
import { CategoriaResponse } from '../../../interface/entities/categoria.interface';
import { ProductoService } from '../services/producto.service';
import { CategoriaService } from '../../categoria/services/categoria.service';
import { ProductoImagenService } from '../services/producto-imagen.service';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-crear-produc',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './crear-produc.component.html',
  styleUrl: './crear-produc.component.scss'
})
export class CrearProducComponent implements OnInit, OnChanges {
  @Input() productoSeleccionado: ProductoResponse | null = null;
  @Output() productoCreado = new EventEmitter<void>();

  formProducto: FormGroup;
  categorias: CategoriaResponse[] = [];
  imagenSeleccionada: File | null = null;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private productoImagenService: ProductoImagenService
  ) {
    this.formProducto = this.fb.group({
      nombreProducto: ['', [Validators.required, Validators.minLength(3)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      precioUnitario: [0, [Validators.required, Validators.min(0.01)]],
      descuento: [0, [Validators.min(0), Validators.max(100)]],
      descripcion: [''],
      tamanio: [''],
      peso: [0, [Validators.min(0)]],
      categoriaId: [null, Validators.required]
    })
  }

  
  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarDatosEnFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productoSeleccionado'] && this.productoSeleccionado) {
      this.cargarDatosEnFormulario();
    }
  }
  
  cargarCategorias() {
    this.categoriaService.obtenerListaCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    })
  }
  
  cargarDatosEnFormulario() {
  if (this.productoSeleccionado) {
    console.log('Datos del producto a editar:', this.productoSeleccionado);
    this.formProducto.patchValue({
      ...this.productoSeleccionado
    });
    console.log('Valores del formulario después de patchValue:', this.formProducto.value);
  }
}

  onFileSelected(event: any) {
    const file = event.target.files[0]
    if(file) {
      this.imagenSeleccionada = file
    }
  }

  guardarProducto() {
  if (this.formProducto.invalid) {
    this.formProducto.markAllAsTouched();
    Swal.fire('Error', 'Por favor, completa los campos obligatorios.', 'warning');
    return;
  }

  const request: ProductoRequest = this.formProducto.value;
  const accion = this.productoSeleccionado
    ? this.productoService.editarProducto(this.productoSeleccionado.idProducto, request)
    : this.productoService.agregarProducto(request);

  accion.subscribe({
    next: (productoGuardado) => {
      // Mostrar SweetAlert de éxito
      Swal.fire(
        '¡Éxito!',
        `Producto "${productoGuardado.nombreProducto}" se guardó correctamente.`,
        'success'
      );

      // Subir imagen si existe
      if (this.imagenSeleccionada) {
        this.subirImagen(productoGuardado.idProducto);
      } else {
        this.productoCreado.emit(); // Recargar lista
        this.cerrarModal();
      }
    },
    error: (err) => {
      console.error('Error al guardar producto:', err);
      Swal.fire(
        'Error',
        'No se pudo guardar el producto. Revisa los datos e intenta de nuevo.',
        'error'
      );
    }
  });
}

  subirImagen(productoId: number) {
  const formData = new FormData();
  formData.append('img', this.imagenSeleccionada!); // ✅ "img" (igual que en @RequestParam("img"))
  formData.append('productoId', productoId.toString());

  this.productoImagenService.subirImagenProducto(formData).subscribe({
    next: () => {
      // ✅ Recargar la lista de productos Y de imágenes
      this.productoCreado.emit(); // Esto llama a cargarProductos() y cargarImagenes()
      this.cerrarModal();
    },
    error: (err) => {
      console.error('Error al subir imagen:', err);
      Swal.fire('Advertencia', 'El producto se guardó, pero hubo un problema con la imagen.', 'warning');
      this.productoCreado.emit();
      this.cerrarModal();
    }
  });
}
  
  cerrarModal() {
    const modalElement = document.getElementById('nuevoProductoModal')
    if (modalElement) {
      const modal = Modal.getInstance(modalElement)
      modal?.hide()
    }
    this.resetFormulario()
  }
  
  resetFormulario() {
    this.formProducto.reset({
      stock: 0,
      precioUnitario: 0,
      descuento: 0,
      peso: 0
    })
    this.imagenSeleccionada = null
    const fileInput = document.getElementById('imagenProducto') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }
  
}
