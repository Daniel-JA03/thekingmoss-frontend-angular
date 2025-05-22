export interface UsuarioRequest {
  username: string;
  password: string;
  nombreUsuario: string;
  apellidoUsuario: string;
  telefono: string;
  email: string;
  roles: string[];
}

export interface UsuarioResponse {
  id: number;
  username: string;
  nombreUsuario: string;
  apellidoUsuario: string;
  telefono: string;
  email: string;
  roles: string[];
}
