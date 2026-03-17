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
}
