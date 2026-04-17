import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioResponse } from '../../../interface/auth/usuario.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private baseUrl = `${environment.apiUrl}/usuarios`;
  constructor(private httpClient:HttpClient) {}

  // Obtener todos los usuarios
  obtenerListaUsuarios(): Observable<UsuarioResponse[]> {
    return this.httpClient.get<UsuarioResponse[]>(`${this.baseUrl}`);
  }

  // Obtener usuario por ID
  obtenerUsuarioPorId(id: number): Observable<UsuarioResponse> {
    return this.httpClient.get<UsuarioResponse>(`${this.baseUrl}/${id}`);
  }

  // Bloquear / Desbloquear usuario
  toggleLockUsuario(id: number): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/${id}/toggle-lock`, {});
  }

}
