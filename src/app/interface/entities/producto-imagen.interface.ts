export interface ProductoImagenRequest {
  imagenUrl: string;
  productoId: number;
}

export interface ProductoImagenResponse {
  productoImagenId: number;
  imagenUrl: string;
  productoId: number;
  nombreProducto: string;
}
