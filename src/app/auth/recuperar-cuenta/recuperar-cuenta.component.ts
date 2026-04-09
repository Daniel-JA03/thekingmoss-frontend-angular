import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-recuperar-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recuperar-cuenta.component.html',
  styleUrl: './recuperar-cuenta.component.scss',
})
export class RecuperarCuentaComponent {
  dato: string = '';
  error: boolean = false;
  usuario: any = null;

  tipo: 'email' | 'telefono' | 'texto' | null = null;
  esValido: boolean = false;

  fase: number = 1;
  seleccionMetodo: string = '';

  tiempoRestante: number = 60; // Tiempo en segundos para el código
  intervalo: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Detectar y validar el tipo de dato ingresado en tiempo real
  onInputChange() {
    this.error = false;

    if (!this.dato) {
      this.tipo = null;
      this.esValido = false;
      return;
    }

    const soloNumeros = /^[0-9]+$/.test(this.dato);
    const tieneArroba = this.dato.includes('@');

    // detectar si es email
    if (tieneArroba) {
      this.tipo = 'email';
      this.esValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.dato);
      return;
    }

    // detectar si es telefono (solo numeros)
    if (soloNumeros) {
      this.tipo = 'telefono';
      this.esValido = this.dato.length === 9;
      return;
    }

    // texto (usuario escribiendo, aún no definido)
    this.tipo = 'texto';
    this.esValido = false;

  }

  buscarCuenta() {
    this.authService.buscarCuenta(this.dato).subscribe({
      next: (res) => {
        this.usuario = res;
        this.fase = 2;
        this.error = false;
      },
      error: () => {
        this.error = true;
      }
    });
  }

  seleccionarMetodo(metodo: string) {
    this.seleccionMetodo = metodo;
  }

  enviarCodigo() {
    this.authService.enviarCodigo({
      usuarioId: this.usuario.usuarioId,
      metodo: this.seleccionMetodo
    }).subscribe(() => {
      this.fase = 3;

      this.iniciarTimer();
    });
  }

  iniciarTimer() {
    this.tiempoRestante = 60;

    clearInterval(this.intervalo);

    this.intervalo = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
      } else {
        clearInterval(this.intervalo);
      }
    }, 1000)
  }

  volver() {
    if (this.fase === 1) {
      this.router.navigate(['/login']);
    } else if (this.fase === 2) {
      this.fase = 1;
      this.seleccionMetodo = '';
    } else if (this.fase === 3) {
      this.fase = 2;
      clearInterval(this.intervalo);
    }
  }
}
