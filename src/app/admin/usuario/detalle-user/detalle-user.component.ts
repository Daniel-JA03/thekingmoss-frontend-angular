import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-detalle-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-user.component.html',
  styleUrl: './detalle-user.component.scss',
})
export class DetalleUserComponent {
  @Input() usuario: any = null;

  abrirModal(usuario: any): void {
    this.usuario = usuario;

    const modalEl = document.getElementById('detalleUsuarioModal');
    if (modalEl) {
      const modal = new Modal(modalEl);
      modal.show();
    }
  }

  getRolClass(rol: string): string {
    switch (rol) {
      case 'ROLE_ADMIN':
        return 'admin';
      case 'ROLE_USER':
        return 'user';
      default:
        return 'default';
    }
  }

  getRolIcon(rol: string): string {
    switch (rol) {
      case 'ROLE_ADMIN':
        return 'bi bi-shield-lock-fill'; // 👑 tipo seguridad
      case 'ROLE_USER':
        return 'bi bi-person-fill'; // 👤 usuario
      default:
        return 'bi bi-tag-fill';
    }
  }
}
