import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriaRequest, CategoriaResponse } from '../../../interface/entities/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private baseUrl = "http://localhost:8080/api/categoria"
  constructor(private httpClient:HttpClient) { }

  obtenerListaCategorias(): Observable<CategoriaResponse[]> {
    return this.httpClient.get<CategoriaResponse[]>(`${this.baseUrl}`)
  }

  // Agregar una nueva categoria
  agregarCategoria(categoria: CategoriaRequest): Observable<CategoriaRequest> {
    return this.httpClient.post<CategoriaRequest>(`${this.baseUrl}`, categoria)
  }

  // editar una categoria existente
  editarCategoria(id: number, categoria: CategoriaRequest): Observable<CategoriaRequest> {
    return this.httpClient.put<CategoriaRequest>(`${this.baseUrl}/${id}`, categoria)
  }

  eliminarCategoria(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`)
  }
}
