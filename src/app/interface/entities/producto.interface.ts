export interface ProductoRequest {
  nombreProducto: string;
  stock: number;
  precioUnitario: number;
  descuento: number;
  descripcion?: string;
  tamanio?: string;
  peso?: number;
  categoriaId: number;
}

export interface ProductoResponse {
  idProducto: number;
  nombreProducto: string;
  stock: number;
  precioUnitario: number;
  descuento: number;
  descripcion?: string;
  tamanio?: string;
  peso?: number;
  categoriaId: number;
  nombreCategoria: string;
}
