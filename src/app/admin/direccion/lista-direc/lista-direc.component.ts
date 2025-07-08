import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CrearDireComponent } from '../crear-dire/crear-dire.component';
import { DireccionResponse, TipoDireccion } from '../../../interface/entities/direccion.interface';
import { DireccionService } from '../services/direccion.service';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-direc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CrearDireComponent],
  templateUrl: './lista-direc.component.html',
  styleUrl: './lista-direc.component.scss'
})
export class ListaDirecComponent implements OnInit {
  direcciones: DireccionResponse[] = [] 
  direccionSeleccionado: DireccionResponse | null = null
  public Direccion = TipoDireccion

  constructor(private direccionService: DireccionService) {}

  ngOnInit(): void {
    this.cargarDireccion()
  }
  
  cargarDireccion() {
    this.direccionService.obtenerListaDirecciones().subscribe(
      (data: DireccionResponse[]) => {
        this.direcciones = data
      },
      (error) => {
        console.log('Error al obtener direcciones', error)
      }
    )
  }

  abrirModal() {
    this.direccionSeleccionado = null
    const modalElement = document.getElementById('nuevaDireccionModal')
    if(modalElement) {
      const modal = new Modal(modalElement)
      modal.show()
    }
  }

  editarDireccion(direccion: DireccionResponse) {
    this.direccionSeleccionado = {...direccion}
    const modalElement = document.getElementById('nuevaDireccionModal')
    if(modalElement) {
      const modal = new Modal(modalElement)
      modal.show()
    }
  }

  eliminarDireccion(direccionId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la direccion de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if(result.isConfirmed) {
        this.direccionService.eliminarDireccion(direccionId).subscribe(() => {
          Swal.fire('¡Eliminado!', 'La direccion ha sido eliminado.', 'success')
                    this.cargarDireccion()
        })
      }
    })
  }

}
