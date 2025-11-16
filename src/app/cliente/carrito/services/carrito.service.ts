import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { CarritoRequest, CarritoResponse } from '../../../interface/entities/carrito.interfaces';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'http://localhost:8080/api/carrito';

  private carritoCambioSubject = new BehaviorSubject<void>(undefined);
  carritoCambio$ = this.carritoCambioSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {} 

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  private getUsuarioId(): number {
    const id = this.authService.getUserId();
    if (!id) {
      throw new Error('No se encontró el ID del usuario');
    }
    return +id;
  }

  obtenerCarrito(): Observable<CarritoResponse[]> {
    const usuarioId = this.getUsuarioId();
    return this.http.get<CarritoResponse[]>(
      `${this.apiUrl}/usuario/${usuarioId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Notificar cambio en el carrito
  emitirCambio(): void {
    this.carritoCambioSubject.next();
  }

  agregarProducto(request: CarritoRequest): Observable<CarritoResponse> {
    const usuarioId = this.getUsuarioId();
    return this.http.post<CarritoResponse>(
      `${this.apiUrl}/usuario/${usuarioId}/agregar`,
      request,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => this.emitirCambio()),
      catchError(this.handleError)
    );
  }

  actualizarCantidad(request: CarritoRequest): Observable<CarritoResponse> {
    const usuarioId = this.getUsuarioId();
    return this.http.put<CarritoResponse>(
      `${this.apiUrl}/usuario/${usuarioId}/actualizar`,
      request,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => this.emitirCambio()),
      catchError(this.handleError)
    );
  }

  eliminarProducto(productoId: number): Observable<void> {
    const usuarioId = this.getUsuarioId();
    return this.http.delete<void>(
      `${this.apiUrl}/usuario/${usuarioId}/producto/${productoId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => this.emitirCambio()),
      catchError(this.handleError)
    )
  }

  vaciarCarrito(): Observable<void> {
    const usuarioId = this.getUsuarioId();
    return this.http.delete<void>(
      `${this.apiUrl}/usuario/${usuarioId}/vaciar`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => this.emitirCambio()),
      catchError(this.handleError)
    );
  }

  // metodo para notificar al carrito que se ha iniciado sesion
  onLogin(): void {}

  private handleError(error: any): Observable<never> {
    console.error('Error en el servicio de carrito:', error);
    let mensaje = 'Ocurrió un error inesperado.';

    if (error.status === 401 || error.status === 403) {
      mensaje = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      localStorage.removeItem('token');
      localStorage.removeItem('usuarioId');
      localStorage.removeItem('username');
      localStorage.removeItem('roles');
      this.router.navigate(['/login']);
    } else if (error.status === 400 || error.status === 500) {
      mensaje = error.error?.message || error.error || 'Error al procesar la solicitud.';
    }

    Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });

    return throwError(() => new Error(mensaje));
  }

}
