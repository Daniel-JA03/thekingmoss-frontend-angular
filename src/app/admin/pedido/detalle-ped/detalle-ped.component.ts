import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PedidoResponse } from '../../../interface/entities/pedido.interface';
import { Modal } from 'bootstrap';
import { DetallePedidoResponse } from '../../../interface/entities/detalle-pedido.interface';

@Component({
  selector: 'app-detalle-ped',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './detalle-ped.component.html',
  styleUrl: './detalle-ped.component.scss'
})
export class DetallePedComponent {
  @Input() pedido: PedidoResponse | null = null;
  @Output() onEditarDetalle = new EventEmitter<PedidoResponse>();


  abrirModal(pedido: PedidoResponse): void {
    this.pedido = pedido;
    const modalEl = document.getElementById('detallePedidoModal');
    if (modalEl) {
      const modal = new Modal(modalEl);
      modal.show();
    }
  }

  editarDetalle(): void {
    if (this.pedido) {
      this.onEditarDetalle.emit(this.pedido); // Emitir al padre
      const modalEl = document.getElementById('detallePedidoModal');
      if (modalEl) {
        const modal = Modal.getInstance(modalEl);
        modal?.hide(); // Cerrar este modal
      }
    }
  }

  
}
