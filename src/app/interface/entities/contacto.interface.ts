export enum EstadoMensaje {
    NUEVO = 'NUEVO',
    LEIDO = 'LEIDO'
}

export interface ContactoRequest {
    nombre: string;
    email: string;
    asunto?: string;
    mensaje: string;
    estado: EstadoMensaje;
}

export interface ContactoResponse {
    contactoid: number;
    nombre: string;
    email: string;
    asunto?: string;
    mensaje: string;
    estado: EstadoMensaje;
    fechaCreacion: string;  // ISO 8601: formato de fecha que viene del backend (ej. "2025-08-04T15:23:11")
}