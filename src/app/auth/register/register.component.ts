
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  nombreUsuario: string = '';
  apellidoUsuario: string = '';
  telefono: string = '';
  email: string = '';

  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) { }

  register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    // Llamar al servicio AuthService para registrar el usuario
    const request = {
      username: this.username,
      password: this.password,
      nombreUsuario: this.nombreUsuario,
      apellidoUsuario: this.apellidoUsuario,
      telefono: this.telefono,
      email: this.email
    }

    this.authService.register(request).subscribe({
      next: (response) => {
        console.log('Usuario registrado con éxito', response);
        this.successMessage = response.message
        // El mensaje que regrese el backend
        setTimeout(() => {
          this.toastr.success('Usuario Registrado Correctamente', 'Éxito');
          this.router.navigate(['/login']);
        }, 2000); // Redirige al login después de 2 segundos
      },
      error: (error) => {
        console.error('Error al registrar el usuario', error);
        this.errorMessage = 'Error al registrar el usuario. Intentelo nuevamente.';
      }
    })
  }
}
