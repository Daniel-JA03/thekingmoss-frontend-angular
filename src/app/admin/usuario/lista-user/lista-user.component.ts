import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-user.component.html',
  styleUrl: './lista-user.component.scss',
})
export class ListaUserComponent implements OnInit {
  usuarios: any[] = [];
  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.obtenerListaUsuarios().subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
        Swal.fire('Error', 'No se pudo cargar la lista de usuarios', 'error');
      },
    });
  }

  toggleEstado(event: Event, usuario: any) {
    event.preventDefault(); // evita el cambio automático del toggle

    const accion = usuario.accountLocked ? 'desbloquear' : 'bloquear';

    Swal.fire({
      title: `¿Seguro que deseas ${accion} este usuario?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.toggleLockUsuario(usuario.id).subscribe(() => {
          usuario.accountLocked = !usuario.accountLocked;

          Swal.fire(
            'Actualizado',
            `El usuario ha sido ${usuario.accountLocked ? 'bloqueado' : 'activado'}`,
            'success',
          );
        });
      }
    });
  }
}
