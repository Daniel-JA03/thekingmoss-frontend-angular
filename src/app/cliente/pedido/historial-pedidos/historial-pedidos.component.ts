import { Component, OnInit } from '@angular/core';
import { PedidoResponse } from '../../../interface/entities/pedido.interface';
import { PedidoService } from '../../../admin/pedido/services/pedido.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { SolesPipe } from '../../../soles.pipe';
import { NavbarComponent } from "../../layout/navbar/navbar.component";
import { FooterComponent } from "../../layout/footer/footer.component";
import { RouterModule } from '@angular/router';
// import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-historial-pedidos',
  standalone: true,
  imports: [CommonModule, SolesPipe, NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './historial-pedidos.component.html',
  styleUrl: './historial-pedidos.component.scss'
})
export class HistorialPedidosComponent implements OnInit {
  pedidos: PedidoResponse[] = [];
  loading = false;

  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const usuarioId = this.authService.getUserId();
    if (usuarioId) {
      this.loading = true;
      this.pedidoService.obtenerPedidosPorUsuario(+usuarioId).subscribe({
        next: (data) => {
          this.pedidos = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar historial', err)
        }
      })
    }
  }

  calcularTotal(pedido: PedidoResponse): number {
    return pedido.detalle.reduce(
      (total, d) => total + (d.precioUnitario * d.cantidad), 0
    )
  }
}
