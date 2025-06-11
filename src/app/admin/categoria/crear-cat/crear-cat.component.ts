import { Component, EventEmitter, Input, input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaResponse } from '../../../interface/entities/categoria.interface';
import { CategoriaService } from '../services/categoria.service';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-crear-cat',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './crear-cat.component.html',
  styleUrl: './crear-cat.component.scss'
})
export class CrearCatComponent implements OnChanges {
  formCategoria: FormGroup;

  @Input() categoriaEditar: CategoriaResponse | null = null;
  @Output() categoriaCreado = new EventEmitter<void>()

  constructor(private fb: FormBuilder, private categoriaService: CategoriaService) {
    this.formCategoria = this.fb.group({
      nombreCategoria: ['', Validators.required]
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoriaEditar'] && this.categoriaEditar) {
      this.formCategoria.patchValue(this.categoriaEditar)
    } else {
      this.formCategoria.reset()
    }
  }

  agregarCategoria() {
    if(this.formCategoria.invalid) return

    if(this.categoriaEditar) {
      this.categoriaService.editarCategoria(this.categoriaEditar.categoriaId, this.formCategoria.value).subscribe(() => {
        Swal.fire('¡Actualizado!', 'La categoria fue editado correctamente.', 'success')
        this.categoriaCreado.emit()
        this.cerrarModal();
      })
    } else {
      this.categoriaService.agregarCategoria(this.formCategoria.value).subscribe(() => {
        Swal.fire('¡Registrado!', 'La nueva Categoria ha sido agregado.', 'success')
        this.categoriaCreado.emit()
        this.cerrarModal()
      })
    }
  }

  cerrarModal() {
    const modalElement = document.getElementById('nuevaCategoriaModal')
    if(modalElement) {
      const modal = Modal.getInstance(modalElement)
      modal?.hide()
    }
    this.categoriaEditar = null
    this.formCategoria.reset()
  }

}
