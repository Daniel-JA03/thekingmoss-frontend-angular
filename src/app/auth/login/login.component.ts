import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  constructor(private router: Router, private authService: AuthService) {}

  login() {
    const credentials = {
      username: this.username,
      password: this.password,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('roles', JSON.stringify(response.roles));
        localStorage.setItem('expirateAt', response.expirateAt.toString());

        // Redireccion basada en roles
        const roles = response.roles; // debe ser un array tipo ['ROLE_ADMIN'], etc.

        if (roles.includes('ROLE_ADMIN')) {
          alert('Bienvenido ADMIN')
          this.router.navigate(['/dasboard_Admin']);
        } else if (roles.includes('ROLE_USER')) {
          alert('Bienvenido USER')
          this.router.navigate(['/dasboard_User']);
        } else {
          alert('Rol no reconocido, acceso denegado');
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesión', error);
        Swal.fire({
          title: "ERROR AL INICIAR SESION",
          text: "CREDENCIALES INCORRECTAS",
          icon: "error",
          confirmButtonText: "Enviar"
        })
      },
    });
  }
}
