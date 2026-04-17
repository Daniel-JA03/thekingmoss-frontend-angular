import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactoRequest, ContactoResponse, EstadoMensaje } from '../../../interface/entities/contacto.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private baseUrl = `${environment.apiUrl}/contacto`;
  constructor(private httpClient:HttpClient) { }

  obtenerListaMensajes(): Observable<ContactoResponse[]> {
    return this.httpClient.get<ContactoResponse[]>(`${this.baseUrl}`)
  }

  enviarMensaje(contacto: ContactoRequest): Observable<ContactoResponse> {
    return this.httpClient.post<ContactoResponse>(`${this.baseUrl}`, contacto)
  }

  actualizarEstado(id: number, estado: EstadoMensaje): Observable<ContactoResponse> {
    return this.httpClient.put<ContactoResponse>(`${this.baseUrl}/${id}`, {}, {
      params: { estado }
    });
  }
}
