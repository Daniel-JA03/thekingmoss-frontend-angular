export enum TipoDocumentoIdentidad {
  DNI = 'DNI',
  CARNET_EXTRANGERIA = 'CARNET_EXTRANGERIA',  
  RUC = 'RUC'
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
