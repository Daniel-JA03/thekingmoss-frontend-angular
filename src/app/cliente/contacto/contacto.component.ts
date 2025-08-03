import { Component } from '@angular/core';
import { NavbarComponent } from "../layout/navbar/navbar.component";
import { FooterComponent } from "../layout/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ,NavbarComponent, FooterComponent],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss'
})
export class ContactoComponent {
  email = 'thekingmoss@gmail.com'
  formContacto: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formContacto = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      asunto: [''],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  enviarFormulario() {
    if (this.formContacto.invalid) {
      this.formContacto.markAllAsTouched();
      return;
    }

    const datos = this.formContacto.value;
    console.log('Formulario enviado:', datos);

    // Simulación de envío
    Swal.fire({
      title: '¡Mensaje enviado!',
      text: 'Gracias por contactarnos. Te responderemos pronto.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });

    this.formContacto.reset({
      asunto: ''
    });
  }
}
