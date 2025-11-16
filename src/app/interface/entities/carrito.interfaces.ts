export interface ProductoCarrito {
    productoId: number;
    nombreProducto: string;
    imagenUrl: string;
    precioUnitario: number;
    stock: number;
}

export interface CarritoResponse {
    idCarrito: number;
    usuarioId: number;
    producto: ProductoCarrito;
    cantidad: number;
}

export interface CarritoRequest {
    productoId: number;
    cantidad: number;
}