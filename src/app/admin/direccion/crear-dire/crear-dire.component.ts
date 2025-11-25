
import { Component, EventEmitter, Input, input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DireccionResponse, TipoDireccion } from '../../../interface/entities/direccion.interface';
import { DireccionService } from '../services/direccion.service';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-crear-dire',
  imports: [ReactiveFormsModule],
  templateUrl: './crear-dire.component.html',
  styleUrl: './crear-dire.component.scss'
})
export class CrearDireComponent implements OnInit, OnChanges {
  @Input() direccionSeleccionado: DireccionResponse | null = null
  @Output() direccionCreado = new EventEmitter<void>()

  formDireccion: FormGroup
  TipoDirecciones = TipoDireccion
  tipoDireccionKeys: string[] = []

  constructor(private fb: FormBuilder, private direccionService: DireccionService) {
    this.formDireccion = this.fb.group({
      pais: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      referencia: ['', Validators.required],
      tipoDireccion: ['', Validators.required],
      estado: ['', Validators.required],
      usuarioId: [null, Validators.required]
    })
  }

  ngOnInit(): void {
    this.tipoDireccionKeys = Object.keys(this.TipoDirecciones)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['direccionSeleccionado']) {
      if (this.direccionSeleccionado) {
        // Editar: Cargar datos al formulario
        this.formDireccion.patchValue(this.direccionSeleccionado)
      } else {
        // Nuevo: limpiar formulario
        this.formDireccion.reset()
      }
    }
  }

  guardarDireccion() {
    // Verificar si el formulario es inválido
    if (this.formDireccion.invalid) {
      this.formDireccion.markAllAsTouched()

      Object.keys(this.formDireccion.controls).forEach((key) => {
        this.formDireccion.get(key)?.markAsTouched()
      })

      // Mostrar alerta
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor complete todos los campos correctamente',
        confirmButtonText: 'Entendido'
      })
      return
    }

    if(this.direccionSeleccionado) {
        // EDITAR
        this.direccionService.editarDireccion(this.direccionSeleccionado.direccionId, this.formDireccion.value).subscribe({
          next: () => {
            Swal.fire('¡Actualizado!', 'La dirección fue editado correctamente.', 'success')
            this.direccionCreado.emit()
            this.cerrarModal();
          },
          error: (err) => {
            console.error('Error al actualizar dirección', err);
            Swal.fire('Error', 'No se pudo editar la Dirección', 'error');
          },
        })
      } else {
        // CREAR
        this.direccionService.agregarDireccion(this.formDireccion.value).subscribe({
          next: () => {
            Swal.fire('¡Registrado!', 'La nueva Dirección ha sido agregado.', 'success')
            this.direccionCreado.emit()
            this.cerrarModal()         
          },
          error: (err) => {
            console.error('Error al crear dirección', err)
            Swal.fire('Error', 'No se pudo guardar el Pedido', 'error')
          }
        })
      }
  }

  cerrarModal() {
    const modalElement = document.getElementById('nuevaDireccionModal')
    if (modalElement) {
      const modal = Modal.getInstance(modalElement)
      modal?.hide()
    }

    // limpiar el formulario
    this.resetFormulario()
  }

    // Metodo para resetear completamente el formulario
    public resetFormulario(): void {
      this.direccionSeleccionado = null
      this.formDireccion.reset()
    }

    // Metodo para abrir el modal (si lo llamas desde el componente)
    abrirModal(nuevaDireccion: boolean = true): void {
      if (nuevaDireccion) {
        this.resetFormulario()
      }

      const modalElement = document.getElementById('nuevaDireccionModal')
      if (modalElement) {
        const modal = new Modal(modalElement)
        modal.show()
      }
    }

}
