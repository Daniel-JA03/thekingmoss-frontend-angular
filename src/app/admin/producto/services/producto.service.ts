import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoRequest, ProductoResponse } from '../../../interface/entities/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private baseUrl = "http://localhost:8080/api/producto"
  constructor(private httpClient:HttpClient) { }

  obtenerListaProductos(): Observable<ProductoResponse[]> {
    return this.httpClient.get<ProductoResponse[]>(`${this.baseUrl}`)
  }

  // buscar producto por su ID
  obtenerProductoPorId(id: number): Observable<ProductoResponse[]> {
    return this.httpClient.get<ProductoResponse[]>(`${this.baseUrl}/${id}`)
  }

  agregarProducto(producto: ProductoRequest): Observable<ProductoResponse> {
    return this.httpClient.post<ProductoResponse>(`${this.baseUrl}`, producto)
  }

  obtenerListarProductoPorNombreCategoria(nombre: string): Observable<ProductoResponse[]> {
    return this.httpClient.get<ProductoResponse[]>(`${this.baseUrl}/${nombre}`)
  }

  editarProducto(id: number, producto: ProductoRequest): Observable<ProductoResponse> {
    return this.httpClient.put<ProductoResponse>(`${this.baseUrl}/${id}`, producto)
  }

  eliminarProducto(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`)
  }
  

}
