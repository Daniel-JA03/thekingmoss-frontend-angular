import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

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

  codigoArray: string[] = ['', '', '', '', '', ''];
  codigoError: boolean = false;

  password: string = '';
  confirmPassword: string = '';
  passwordError: boolean = false;

  mostrarPassword: boolean = false;
  mostrarConfirmPassword: boolean = false;

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
    }).subscribe((res: any) => {

      // 🔥 AQUÍ VA EL SWAL
      if (this.seleccionMetodo === 'SMS') {
        Swal.fire({
          icon: 'info',
          title: 'SMS simulado',
          html: `
            <p>Tu código es:</p>
            <h2>${res.codigo}</h2>
            <button id="copiarBtn" class="swal2-confirm swal2-styled">
              Copiar código
            </button>
          `,
          showConfirmButton: false,
          didOpen: () => {
            document.getElementById('copiarBtn')?.addEventListener('click', () => {
              navigator.clipboard.writeText(res.codigo);
              Swal.fire({
                icon: 'success',
                title: 'Copiado',
                text: 'Código copiado al portapapeles',
                timer: 1500,
                showConfirmButton: false
              });
            });
          }
        });
      }

      if (this.seleccionMetodo === 'EMAIL') {
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Revisa tu bandeja de entrada',
        });
      }

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

  // Mover el foco al siguiente input automáticamente y permitir solo números
  onCodigoInput(event: any, index: number) {
    const valor = event.target.value.replace(/[^0-9]/g, '');

    this.codigoArray[index] = valor;

    if (valor && index < 5) {
      const next = document.querySelectorAll<HTMLInputElement>('.code-input')[index + 1];
      next?.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.codigoArray[index] && index > 0) {
      const prev = document.querySelectorAll<HTMLInputElement>('.code-input')[index - 1];
      prev?.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();

    const texto = event.clipboardData?.getData('text') || '';

    if (!/^\d{6}$/.test(texto)) return; // solo 6 números

    this.codigoArray = texto.split('');

    // mover foco al último
    setTimeout(() => {
      const inputs = document.querySelectorAll<HTMLInputElement>('.code-input');
      inputs[5]?.focus();
    });
  }

  getCodigoCompleto(): string {
    return this.codigoArray.join('');
  }

  verificarCodigo() {
    const codigo = this.getCodigoCompleto();

    if (codigo.length < 6) {
      this.codigoError = true;
      return;
    }

    this.authService.verificarCodigo({
      usuarioId: this.usuario.usuarioId,
      codigo: codigo
    }).subscribe({
      next: () => {
        this.codigoError = false;

        Swal.fire({
          icon: 'success',
          title: 'Código verificado',
          text: 'Ahora puedes cambiar tu contraseña',
          timer: 2000,
          showConfirmButton: false
        });

        this.fase = 4;
      },
      error: (err) => {
        this.codigoError = true;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Código inválido o expirado'
        });
      }
    });
  }

  trackByIndex(index: number) {
    return index;
  }

  cambiarPassword() {
    if (!this.password || this.password.length < 6) {
      this.passwordError = true;
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.passwordError = true;
      return;
    }

    this.authService.cambiarPassword({
      usuarioId: this.usuario.usuarioId,
      nuevaPassword: this.password
    }).subscribe({
      next: () => {

        this.passwordError = false;

        Swal.fire({
          icon: 'success',
          title: 'Contraseña actualizada',
          text: 'Ahora puedes iniciar sesión',
          confirmButtonText: 'Ir al login'
        }).then(() => {
          this.router.navigate(['/login']);
        });

      },
      error: () => {
        this.passwordError = true;
      }
    });
  }

  get passwordValida(): boolean {
    return this.password.length >= 6;
  }
}
