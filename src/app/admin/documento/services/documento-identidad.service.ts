import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentoIdentidadRequest, DocumentoIdentidadResponse } from '../../../interface/entities/documento-identidad.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentoIdentidadService {

  private baseUrl = "http://localhost:8080/api/documentoIdentidad"
  constructor(private httpClient:HttpClient) { }

  obtenerListaDocumentoIdentidad(): Observable<DocumentoIdentidadResponse[]> {
    return this.httpClient.get<DocumentoIdentidadResponse[]>(`${this.baseUrl}`)
  }

  // buscar documento de identidad por su ID
  obtenerDocumentoIdentidadPorId(id: number): Observable<DocumentoIdentidadResponse[]> {
    return this.httpClient.get<DocumentoIdentidadResponse[]>(`${this.baseUrl}/${id}`)
  }

  // agregar un nuevo documento de identidad
  agregarDocumentoIdentidad(documentoIdentidad: DocumentoIdentidadRequest): Observable<DocumentoIdentidadResponse> {
    return this.httpClient.post<DocumentoIdentidadResponse>(`${this.baseUrl}`, documentoIdentidad)
  }

  // editar un documento de identidad
  editarDocumentoIdentidad(id: number, documentoIdentidad: DocumentoIdentidadRequest): Observable<DocumentoIdentidadResponse> {
    return this.httpClient.put<DocumentoIdentidadResponse>(`${this.baseUrl}/${id}`, documentoIdentidad)
  }

  // eliminar documento de identidad
  eliminarDocumentoIdentidad(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`)
  }

}
