import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DireccionRequest, DireccionResponse } from '../../../interface/entities/direccion.interface';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {

  private baseUrl = "http://localhost:8080/api/direccion"
  constructor(private httpClient:HttpClient) { }

  obtenerListaDirecciones(): Observable<DireccionResponse[]> {
    return this.httpClient.get<DireccionResponse[]>(`${this.baseUrl}`)
  }

  // buscar direccion por usuario ID
  obtenerListaDireccionesPorUsuarioID(id: number): Observable<DireccionResponse[]> {
    return this.httpClient.get<DireccionResponse[]>(`${this.baseUrl}/${id}`)
  }

  // buscar direccion por su ID
  obtenerDireccionPorId(id: number): Observable<DireccionResponse> {
    return this.httpClient.get<DireccionResponse>(`${this.baseUrl}/${id}`)
  }

  // agregar una nueva direccion
  agregarDireccion(direccion: DireccionRequest): Observable<DireccionResponse> {
    return this.httpClient.post<DireccionResponse>(`${this.baseUrl}`, direccion)
  }

  // editar una direccion existente
  editarDireccion(id: number, direccion: DireccionRequest): Observable<DireccionResponse> {
    return this.httpClient.put<DireccionResponse>(`${this.baseUrl}/${id}`, direccion)
  }

  // eliminar una direccion
  eliminarDireccion(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`)
  }

}
