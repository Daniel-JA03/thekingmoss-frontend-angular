import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { RegistroRequest } from '../../interface/auth/registro.interface';
import { LoginRequest } from '../../interface/auth/login-request.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  // cuando el usuario cierra sesión
  private logoutSubject = new Subject<void>();
  logout$ = this.logoutSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('usuarioId', response.usuarioId);
        localStorage.setItem('username', response.username);
        localStorage.setItem('email', response.email);
        localStorage.setItem('roles', JSON.stringify(response.roles));
      })
    )
  }

  register(request: RegistroRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/register`,
      request
    );
  }

  logout(): void {
    localStorage.removeItem('token');

    localStorage.removeItem('usuarioId');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    this.logoutSubject.next();
  }
  isAutheticated(): boolean {
    return !!localStorage.getItem('token');
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('usuarioId');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }
}
