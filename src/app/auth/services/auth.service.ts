import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroRequest } from '../../interface/auth/registro.interface';
import { LoginRequest } from '../../interface/auth/login-request.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  register(request: RegistroRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/register`,
      request
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }
  isAutheticated(): boolean {
    return !!localStorage.getItem('token');
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
