import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoImagenRequest, ProductoImagenResponse } from '../../../interface/entities/producto-imagen.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoImagenService {

  private baseUrl = "http://localhost:8080/api/productoImagen"
  constructor(private httpClient:HttpClient) { }

  obtenerListaProductosImagen(): Observable<ProductoImagenResponse[]> {
    return this.httpClient.get<ProductoImagenResponse[]>(`${this.baseUrl}`)
  }

  // buscar producto imagen por su ID
  obtenerProductoImagenPorId(id: number): Observable<ProductoImagenResponse[]> {
    return this.httpClient.get<ProductoImagenResponse[]>(`${this.baseUrl}/${id}`)
  }

  agregarProductoImagen(productoImagen: ProductoImagenRequest): Observable<ProductoImagenResponse> {
    return this.httpClient.post<ProductoImagenResponse>(`${this.baseUrl}`, productoImagen)
  }

  editarProductoImagen(id: number, productoImagen: ProductoImagenRequest): Observable<ProductoImagenResponse> {
    return this.httpClient.put<ProductoImagenResponse>(`${this.baseUrl}/${id}`, productoImagen)
  }

  eliminarProductoImagen(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`)
  }

  subirImagenProducto(formData: FormData): Observable<any> {
  return this.httpClient.post(`${this.baseUrl}`, formData);
}


}
