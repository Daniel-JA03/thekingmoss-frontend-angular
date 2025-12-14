export interface CategoriaRequest {
  nombreCategoria: string;
}

export interface CategoriaResponse {
  categoriaId: number;
  nombreCategoria: string;
}

export interface CategoriaFiltro {
  nombre: string;
  total: number;
}
