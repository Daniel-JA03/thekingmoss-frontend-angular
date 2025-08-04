import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactoRequest, ContactoResponse } from '../../../interface/entities/contacto.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private baseUrl = "http://localhost:8080/api/contacto"
  constructor(private httpClient:HttpClient) { }

  obtenerListaMensajes(): Observable<ContactoResponse[]> {
    return this.httpClient.get<ContactoResponse[]>(`${this.baseUrl}`)
  }

  enviarMensaje(contacto: ContactoRequest): Observable<ContactoResponse> {
    return this.httpClient.post<ContactoResponse>(`${this.baseUrl}`, contacto)
  }
}
