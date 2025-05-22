export enum TipoDireccion {
  DOMICILIO = 'DOMICILIO',
  TRABAJO = 'TRABAJO',
  OTRO = 'OTRO'
}

export interface DireccionRequest {
  pais: string;
  estado: string;
  provincia: string;
  distrito: string;
  referencia: string;
  tipoDireccion: TipoDireccion;
  usuarioId: number;
}

export interface DireccionResponse {
  direccionId: number;
  pais: string;
  estado: string;
  provincia: string;
  distrito: string;
  referencia: string;
  tipoDireccion: TipoDireccion;
  usuarioId: number;
  username: string;
  nombreUsuario: string;
  apellidoUsuario: string;
  telefono: string;
  email: string;
  nombreRoles: string[];
}
