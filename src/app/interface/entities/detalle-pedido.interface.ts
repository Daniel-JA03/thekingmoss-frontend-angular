export interface DetallePedidoRequest {
  productoId: number;
  cantidad: number;
}

export interface DetallePedidoResponse {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  lineaTotal: number;
}
