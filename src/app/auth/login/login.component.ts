import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr'
import Swal from 'sweetalert2';
import { CarritoService } from '../../cliente/carrito/services/carrito.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  intentosRestantes: number | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private carritoService: CarritoService
  ) {}

  login() {
    if (this.loading) return;

    this.loading = true;

    const credentials = {
      username: this.username,
      password: this.password,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading = false;

        // LIMPIAR INTENTOS
        this.intentosRestantes = null;

        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('roles', JSON.stringify(response.roles));
        localStorage.setItem('expirateAt', response.expirateAt.toString());
        localStorage.setItem('usuarioId', response.usuarioId.toString());

        this.carritoService.onLogin();

        const roles = response.roles;

        if (roles.includes('ROLE_ADMIN')) {
          this.toastr.success('Bienvenido Administrador', 'Éxito');
          this.router.navigate(['/admin/dashboard']);
        } else if (roles.includes('ROLE_USER')) {
          this.toastr.success('Bienvenido Usuario', 'Éxito');
          this.router.navigate(['/']);
        } else {
          this.toastr.warning('Rol no reconocido');
        }
      },

      error: (error) => {
        this.loading = false;

        console.error('Error al iniciar sesión', error);

        let mensaje = "Credenciales incorrectas";
        let icon: 'error' | 'warning' = 'error';

        // 🔥 USAR STATUS CODE 
        if (error.status === 423) {
          icon = 'warning';

          // LIMPIAR intentos porque ya está bloqueado
          this.intentosRestantes = null;
        }

        if (error.status === 401) {
          icon = 'error';
        }

        // MENSAJE DEL BACKEND
        if (error?.error) {
          if (typeof error.error === 'string') {
            mensaje = error.error;
          } else if (error.error.message) {
            mensaje = error.error.message;
          }
        }

        // EXTRAER INTENTOS 
        const match = mensaje.match(/\d+/);
        if (match) {
          this.intentosRestantes = Number(match[0]);

          // ALERTA SI QUEDA 1 INTENTO
          if (this.intentosRestantes === 1) {
            this.toastr.error('Último intento antes del bloqueo', '⚠️ Atención');
          }
        }

        Swal.fire({
          title: 'ERROR AL INICIAR SESIÓN',
          text: mensaje,
          icon: icon,
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }
}