import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DocumentoIdentidadResponse,
  TipoDocumentoIdentidad,
} from '../../../interface/entities/documento-identidad.interface';
import { DocumentoIdentidadService } from '../services/documento-identidad.service';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-crear-docu',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-docu.component.html',
  styleUrl: './crear-docu.component.scss',
})
export class CrearDocuComponent implements OnInit, OnChanges {
  @Input() documentoIdentidadSeleccionado: DocumentoIdentidadResponse | null =
    null;
  @Output() documentoIdentidadCreado = new EventEmitter<void>();

  formDocumentoIdentidad: FormGroup;
  TipoDocumento = TipoDocumentoIdentidad;
  tipoDocumentoIdentidadKeys: string[] = [];

  constructor(
    private fb: FormBuilder,
    private documentoIdentidadService: DocumentoIdentidadService
  ) {
    this.formDocumentoIdentidad = this.fb.group({
      numeroDocumentoIdentidad: ['', Validators.required],
      tipoDocumentoIdentidad: ['', Validators.required],
      usuarioId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.tipoDocumentoIdentidadKeys = Object.keys(this.TipoDocumento);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentoIdentidadSeleccionado']) {
      if (this.documentoIdentidadSeleccionado) {
        this.formDocumentoIdentidad.patchValue(
          this.documentoIdentidadSeleccionado
        );
      } else {
        this.formDocumentoIdentidad.reset();
      }
    }
  }

  guardarDocumentoIdentidad() {
    if (this.formDocumentoIdentidad.invalid) {
      this.formDocumentoIdentidad.markAllAsTouched();

      Object.keys(this.formDocumentoIdentidad.controls).forEach((key) => {
        this.formDocumentoIdentidad.get(key)?.markAsTouched();
      });

      // Mostrar alerta
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor complete todos los campos correctamente',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    if(this.documentoIdentidadSeleccionado) {
      this.documentoIdentidadService.editarDocumentoIdentidad(this.documentoIdentidadSeleccionado.documentoIdentidadId, this.formDocumentoIdentidad.value).subscribe({
        next: () => {
                    Swal.fire('¡Actualizado!', 'El documento Identidad fue editado correctamente.', 'success')
                    this.documentoIdentidadCreado.emit()
                    this.cerrarModal();
                  },
                  error: (err) => {
                    console.error('Error al actualizar documento identidad', err);
                    Swal.fire('Error', 'No se pudo editar el Documento Identidad', 'error');
                  },
      })
    } else {
      this.documentoIdentidadService.agregarDocumentoIdentidad(this.formDocumentoIdentidad.value).subscribe({
        next: () => {
                    Swal.fire('¡Registrado!', 'El nuev Documento Identidad ha sido agregado.', 'success')
                    this.documentoIdentidadCreado.emit()
                    this.cerrarModal()         
                  },
                  error: (err) => {
                    console.error('Error al crear Documento Identidad', err)
                    Swal.fire('Error', 'No se pudo guardar el Documento Identidad', 'error')
                  }
      })
    }

  }

  cerrarModal() {
    const modalElement = document.getElementById('nuevoDocumentoIdentidadModal')
    if(modalElement) {
      const modal = Modal.getInstance(modalElement)
      modal?.hide()
    }

    this.resetFormulario()
  }

  public resetFormulario(): void {
    this.documentoIdentidadSeleccionado = null
    this.formDocumentoIdentidad.reset()
  }

  abrirModal(nuevoDocumentoIdentidad: boolean = true): void {
    if (nuevoDocumentoIdentidad) {
      this.resetFormulario()
    }

    const modalElement = document.getElementById('nuevoDocumentoIdentidadModal')
    if (modalElement) {
        const modal = new Modal(modalElement)
        modal.show()
      }
  }
}
