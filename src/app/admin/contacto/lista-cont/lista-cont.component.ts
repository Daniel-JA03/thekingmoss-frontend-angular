import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContactoResponse, EstadoMensaje } from '../../../interface/entities/contacto.interface';
import { ContactoService } from '../services/contacto.service';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-lista-cont',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-cont.component.html',
  styleUrl: './lista-cont.component.scss'
})
export class ListaContComponent implements OnInit{

  mensajes: ContactoResponse[] = [];
  mensajesFiltrados: ContactoResponse[] = [];
  filtro: 'todos' | 'leidos' | 'nopendientes' = 'todos';
  mensajeSeleccionado: ContactoResponse | null = null;

  constructor(private contactoService: ContactoService) {}

  ngOnInit(): void {
    this.cargarMensajes();
  }

  cargarMensajes() {
    this.contactoService.obtenerListaMensajes().subscribe({
      next: (data) => {
        this.mensajes = data;
        this.filtrarMensajes();
      },
      error: (err) => {
        console.error('Error al cargar mensajes:', err);
        Swal.fire('Error', 'No se pudo cargar la lista de mensaje.', 'error')
      }
    });
  }

  cambiarFiltro(filtro: 'todos' | 'leidos' | 'nopendientes') {
    this.filtro = filtro;
    this.filtrarMensajes();
  }

  filtrarMensajes() {
    switch (this.filtro) {
      case 'leidos':
        this.mensajesFiltrados = this.mensajes.filter(m => m.estado === EstadoMensaje.LEIDO);
        break;
      case 'nopendientes':
        this.mensajesFiltrados = this.mensajes.filter(m => m.estado === EstadoMensaje.NUEVO);
        break;
      default:
        this.mensajesFiltrados = this.mensajes;
        break;
    }
  }

  abrirModalMensaje(mensaje: ContactoResponse) {
    this.mensajeSeleccionado = mensaje;
    const modalElement = document.getElementById('mensajeModal')
    if(modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show()
    }
  }

  marcarComoLeido(mensaje: ContactoResponse) {
    const nuevoEstado = mensaje.estado === EstadoMensaje.LEIDO 
      ? EstadoMensaje.NUEVO 
      : EstadoMensaje.LEIDO;

    this.contactoService.actualizarEstado(mensaje.contactoid, nuevoEstado).subscribe({
      next: (contactoActualizado) => {
        mensaje.estado = contactoActualizado.estado;
        this.filtrarMensajes(); // Actualiza el filtro
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        Swal.fire('Error', 'No se pudo actualizar el estado del mensaje.', 'error');
      }
    });
  }

  responderMensaje(mensaje: ContactoResponse) {
    const email = `mailto:${mensaje.email}?subject=Re: ${mensaje.asunto || 'Tu consulta'}&body=Hola ${mensaje.nombre},%0D%0A%0D%0AGracias por tu mensaje. Estamos revisando tu consulta y te responderemos a la brevedad.%0D%0A%0D%0ASaludos,%0D%0AEl equipo de TheKingMoss`;
    window.open(email, '_blank');
  }
}
