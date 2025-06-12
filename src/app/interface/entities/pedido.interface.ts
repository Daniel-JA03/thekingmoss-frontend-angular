import { DetallePedidoRequest, DetallePedidoResponse } from "./detalle-pedido.interface";

export enum TipoEstadoPedido {
  GENERADO = 'GENERADO',
  PAGADO = 'PAGADO',
  ENVIANDO = 'ENVIANDO',
  CANCELADO = 'CANCELADO',
  RECIBIDO = 'RECIBIDO'
}

export interface PedidoRequest {
  fechaPedido: Date;
  tipoEntrega: string;
  informacionPedido: string;
  instruccionEntrega: string;
  tipoEstadoPedido: TipoEstadoPedido;
  usuarioId: number;
  detalles: DetallePedidoRequest[];
}

export interface PedidoResponse {
  pedidoId: number;
  fechaPedido: Date;
  tipoEntrega: string;
  informacionPedido: string;
  instruccionEntrega: string;
  tipoEstadoPedido: TipoEstadoPedido;
  usuarioId: number;
  detalle: DetallePedidoResponse[];
}
