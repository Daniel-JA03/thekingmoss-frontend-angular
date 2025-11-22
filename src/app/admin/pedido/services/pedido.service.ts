import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PedidoRequest, PedidoResponse } from '../../../interface/entities/pedido.interface';
import { DetallePedidoRequest, DetallePedidoResponse } from '../../../interface/entities/detalle-pedido.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private baseUrl = "http://localhost:8080/api/pedidos"
  constructor(private httpClient:HttpClient) { }

  obtenerListaPedidos(): Observable<PedidoResponse[]> {
    return this.httpClient.get<PedidoResponse[]>(`${this.baseUrl}`)
  }

  // buscar pedido por su ID
  obtenerPedidoPorId(id: number): Observable<PedidoResponse> {
    return this.httpClient.get<PedidoResponse>(`${this.baseUrl}/${id}`);
  }

  // Agregar un nuevo pedido
  agregarPedido(pedido: PedidoRequest): Observable<PedidoResponse> {
  return this.httpClient.post<PedidoResponse>(`${this.baseUrl}`, pedido);
}

  // editar un nuevo pedido existente
  editarPedido(id: number, pedido: PedidoRequest): Observable<PedidoResponse> {
  return this.httpClient.put<PedidoResponse>(`${this.baseUrl}/${id}`, pedido);
  }

  // eliminar un pedido
  eliminarPedido(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`)
  }

  agregarDetallePedido(pedidoId: number, detalle: DetallePedidoRequest): Observable<DetallePedidoResponse> {
    return this.httpClient.post<DetallePedidoResponse>(
      `${this.baseUrl}/${pedidoId}/detalles`, detalle
    );
  }



  eliminarDetallePedido(pedidoId: number, productoId: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/${pedidoId}/${productoId}`
    );
  }

  // Obtener el historial de pedidos de un usuario
  obtenerPedidosPorUsuario(usuarioId: number): Observable<PedidoResponse[]> {
    return this.httpClient.get<PedidoResponse[]>(`${this.baseUrl}/usuario/${usuarioId}`);
  }

}
