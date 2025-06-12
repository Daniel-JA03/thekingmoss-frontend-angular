import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PedidoResponse } from '../../../interface/entities/pedido.interface';
import { DetallePedidoRequest, DetallePedidoResponse } from '../../../interface/entities/detalle-pedido.interface';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-form-detalle',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-detalle.component.html',
  styleUrl: './form-detalle.component.scss'
})
export class FormDetalleComponent implements OnInit {
  @Input() pedido: PedidoResponse | null = null;
  @Output() onGuardarDetalle = new EventEmitter<DetallePedidoRequest>();


  detalleForm!: FormGroup
  detalleEnEdicion: DetallePedidoResponse | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.detalleForm = this.fb.group({
      productoId: [null, [Validators.required, Validators.min(1)]],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  abrirModal(): void {
    const modalEl = document.getElementById('modalDetallePedido');
    if (modalEl) {
      const modal = new Modal(modalEl);
      modal.show();
    }
  }


  guardar(): void {
  if (this.detalleForm.invalid) {
    this.detalleForm.markAllAsTouched();
    return;
  }

  const nuevoDetalle: DetallePedidoRequest = this.detalleForm.value;

  console.log('Detalle a guardar:', nuevoDetalle);
  console.log('Pedido relacionado:', this.pedido);

  this.onGuardarDetalle.emit(nuevoDetalle); // Emitir al padre

  // Cerrar el modal con Bootstrap manualmente
  const modalEl = document.getElementById('modalDetallePedido');
  if (modalEl) {
    const modal = Modal.getInstance(modalEl);
    modal?.hide();
  }

    // Opcional: Resetear el formulario si se desea reutilizar
    this.detalleForm.reset({
      productoId: null,
      cantidad: 1
    });
  }

  cargarDetalleParaEditar(detalle: DetallePedidoResponse) {
  this.detalleForm.patchValue({
    productoId: detalle.productoId,
    cantidad: detalle.cantidad
  });

  // Opcional: guardar el ID del detalle si es necesario para editar
  this.detalleEnEdicion = detalle; // crea esta propiedad si lo necesitas
}


}
