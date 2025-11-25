
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CrearCatComponent } from '../crear-cat/crear-cat.component';
import { CategoriaRequest, CategoriaResponse } from '../../../interface/entities/categoria.interface';
import { CategoriaService } from '../services/categoria.service';
import { Modal } from 'bootstrap'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-cat',
  standalone: true,
  imports: [ReactiveFormsModule, CrearCatComponent],
  templateUrl: './lista-cat.component.html',
  styleUrl: './lista-cat.component.scss'
})
export class ListaCatComponent implements OnInit{
  categorias: CategoriaResponse[] = []
  categoriaSeleccionado: CategoriaResponse | null = null

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.cargarCategoria();
  }

  cargarCategoria() {
    this.categoriaService.obtenerListaCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => {
        console.error('Error al obtener las categorias:', err);
        Swal.fire('Error', 'No se pudo cargar la lista de categorias', 'error')
      }
    })
  }

  abrirModal() {
    this.categoriaSeleccionado = null
    const modalElement = document.getElementById('nuevaCategoriaModal')
    if(modalElement) {
      const modal = new Modal(modalElement)
      modal.show()
    }
  }

  editarCategoria(categoria: CategoriaResponse) {
    this.categoriaSeleccionado = {...categoria}
    const modalElement = document.getElementById('nuevaCategoriaModal')
    if(modalElement) {
      const modal = new Modal(modalElement)
      modal.show()
    }
  }

  eliminarCategoria(categoriaId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la categoria de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if(result.isConfirmed) {
        this.categoriaService.eliminarCategoria(categoriaId).subscribe(() => {
          Swal.fire('¡Eliminado!', 'La categoria ha sido eliminado.', 'success')
          this.cargarCategoria()
        })
      }
    })
  }

}
