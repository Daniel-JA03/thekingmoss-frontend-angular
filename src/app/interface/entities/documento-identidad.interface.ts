export enum TipoDocumentoIdentidad {
  DNI = 'DNI',
  PASAPORTE = 'PASAPORTE'
}

export interface DocumentoIdentidadRequest {
  numeroDocumentoIdentidad: string;
  tipoDocumentoIdentidad: TipoDocumentoIdentidad;
  usuarioId: number;
}

export interface DocumentoIdentidadResponse {
  documentoIdentidadId: number;
  numeroDocumentoIdentidad: string;
  tipoDocumentoIdentidad: TipoDocumentoIdentidad;
  usuarioId: number;
  username: string;
  nombreUsuario: string;
  apellidoUsuario: string;
  telefono: string;
  email: string;
  nombreRoles: string[];
}
