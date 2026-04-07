import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recuperar-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar-cuenta.component.html',
  styleUrl: './recuperar-cuenta.component.scss',
})
export class RecuperarCuentaComponent {
  dato: string = '';
  error: boolean = false;
  usuario: any = null;

  constructor(
    private authService: AuthService
  ) {}

  buscarCuenta() {
  if (!this.dato) {
    this.error = true;
    return;
  }

  this.authService.buscarCuenta(this.dato).subscribe({
      next: (res) => {
        this.error = false;
        this.usuario = res;
      },
      error: () => {
        this.error = true;
      }
    });
  }
}
