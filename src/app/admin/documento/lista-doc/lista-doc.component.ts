import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentoIdentidadResponse, TipoDocumentoIdentidad } from '../../../interface/entities/documento-identidad.interface';
import { DocumentoIdentidadService } from '../services/documento-identidad.service';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { CrearDocuComponent } from '../crear-docu/crear-docu.component';

@Component({
  selector: 'app-lista-doc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CrearDocuComponent],
  templateUrl: './lista-doc.component.html',
  styleUrl: './lista-doc.component.scss'
})
export class ListaDocComponent implements OnInit {
  documentos: DocumentoIdentidadResponse[] = []
  documentoIdentidadSeleccionado: DocumentoIdentidadResponse | null = null
  public DocumentoIdentidad = TipoDocumentoIdentidad

  constructor(private documentoIdentidadService: DocumentoIdentidadService) {}

  ngOnInit(): void {
    this.cargarDocumentosIdentidad()
  }

  cargarDocumentosIdentidad() {
   this.documentoIdentidadService.obtenerListaDocumentoIdentidad().subscribe({
    next: (data) => (this.documentos = data),
    error: (err) => {
      console.error('Error al obtener documentos de identidad:', err)
      Swal.fire('Error', 'No se pudo cargar la lista de documentos de identidad', 'error')
    }
   })
  }

  abrirModal() {
    this.documentoIdentidadSeleccionado = null
    const modalElement = document.getElementById('nuevoDocumentoIdentidadModal')
    if(modalElement) {
      const modal = new Modal(modalElement)
      modal.show()
    }
  }

  editarDocumentoIdentidad(documentoIdentidad: DocumentoIdentidadResponse) {
    this.documentoIdentidadSeleccionado = {...documentoIdentidad}
    const modalElement = document.getElementById('nuevoDocumentoIdentidadModal')
    if(modalElement) {
      const modal = new Modal(modalElement)
      modal.show()
    }
  }

  eliminarDocumentoIdentidad(documentoIdentidadId: number) {
    Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción eliminará el documento Identidad de forma permanente.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if(result.isConfirmed) {
            this.documentoIdentidadService.eliminarDocumentoIdentidad(documentoIdentidadId).subscribe(() => {
              Swal.fire('¡Eliminado!', 'El documento Identidad ha sido eliminado.', 'success')
                        this.cargarDocumentosIdentidad()
            })
          }
        })
  }

}
