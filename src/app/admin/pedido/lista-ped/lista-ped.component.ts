import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CrearPedComponent } from '../crear-ped/crear-ped.component';
import { PedidoResponse, TipoEstadoPedido } from '../../../interface/entities/pedido.interface';
import { PedidoService } from '../services/pedido.service';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { SolesPipe } from '../../../soles.pipe';
import { DetallePedComponent } from '../detalle-ped/detalle-ped.component';
import { FormDetalleComponent } from '../form-detalle/form-detalle.component';
import { DetallePedidoRequest, DetallePedidoResponse } from '../../../interface/entities/detalle-pedido.interface';

@Component({
  selector: 'app-lista-ped',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DetallePedComponent ,CrearPedComponent, SolesPipe, FormDetalleComponent],
  templateUrl: './lista-ped.component.html',
  styleUrl: './lista-ped.component.scss'
})
export class ListaPedComponent implements OnInit {
  pedidos: PedidoResponse[] = []
  pedidoSeleccionado: PedidoResponse | null = null
  public EstadoPedido = TipoEstadoPedido

  @ViewChild(DetallePedComponent) detallePedComp!: DetallePedComponent;
  @ViewChild('modalFormDetalle') modalFormDetalle!: FormDetalleComponent;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarPedido()
  }

  cargarPedido() {
    this.pedidoService.obtenerListaPedidos().subscribe(
      (data: PedidoResponse[]) => {
        this.pedidos = data
      },
      (error) => {
        console.log('Error al obtener pedidos', error)
      }
    )
  }

    abrirModal() {
      this.pedidoSeleccionado = null
      const modalElement = document.getElementById('nuevoPedidoModal')
      if(modalElement) {
        const modal = new Modal(modalElement)
        modal.show()
      }
    }

    abrirModalDetalle(pedido: PedidoResponse) {
      this.pedidoSeleccionado = pedido;
      // Abre el segundo modal con Bootstrap
      const modalEl = document.getElementById('modalDetallePedido');
      if (modalEl) {
        const modal = new Modal(modalEl);
        modal.show();
      }
    }

    editarPedido(pedido: PedidoResponse) {
        this.pedidoSeleccionado = {...pedido}
        const modalElement = document.getElementById('nuevoPedidoModal')
        if(modalElement) {
          const modal = new Modal(modalElement)
          modal.show()
        }
      }

    eliminarPedido(pedidoId: number) {
        Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción eliminará el pedido de forma permanente.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if(result.isConfirmed) {
            this.pedidoService.eliminarPedido(pedidoId).subscribe(() => {
              Swal.fire('¡Eliminado!', 'El Pedido ha sido eliminado.', 'success')
              this.cargarPedido()
            })
          }
        })
      }

    // En tu componente
    calcularTotal(pedido: PedidoResponse): number {
    if (!pedido.detalle) return 0;
    return pedido.detalle.reduce((total, item) => total + item.lineaTotal, 0);
  }

    verDetalles(pedido: PedidoResponse) {
  if (this.detallePedComp) {
    this.detallePedComp.abrirModal(pedido);
  }
}

  actualizarDetalle(pedidoActualizado: PedidoResponse) {
    this.pedidoSeleccionado = pedidoActualizado;
    this.modalFormDetalle.abrirModal(); // Abre modal de detalles, no el de pedido
  }

  guardarDetalle(nuevoDetalle: DetallePedidoRequest) {
  if (this.pedidoSeleccionado) {
    this.pedidoService.agregarDetallePedido(this.pedidoSeleccionado.pedidoId, nuevoDetalle).subscribe({
      next: () => {
        Swal.fire('Guardado', 'El detalle se guardó correctamente.', 'success');
        this.cargarPedido(); // Recargar la lista
      },
      error: err => {
        console.error('Error al guardar detalle', err);
        Swal.fire('Error', 'No se pudo guardar el detalle.', 'error');
      }
    });
  }
}

}
