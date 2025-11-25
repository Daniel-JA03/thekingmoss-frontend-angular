
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  PedidoResponse,
  TipoEstadoPedido,
} from '../../../interface/entities/pedido.interface';
import { PedidoService } from '../services/pedido.service';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-ped',
  imports: [ReactiveFormsModule],
  templateUrl: './crear-ped.component.html',
  styleUrl: './crear-ped.component.scss',
})
export class CrearPedComponent implements OnInit, OnChanges {
  @Input() pedidoSeleccionado: PedidoResponse | null = null;
  @Output() pedidoCreado = new EventEmitter<void>();

  formPedido: FormGroup;
  EstadoPedido = TipoEstadoPedido;
  estadoPedidoKeys: string[] = [];

  constructor(private fb: FormBuilder, private pedidoService: PedidoService) {
    this.formPedido = this.fb.group({
      fechaPedido: ['', Validators.required],
      tipoEntrega: ['', Validators.required],
      informacionPedido: ['', Validators.required],
      instruccionEntrega: ['', Validators.required],
      tipoEstadoPedido: ['', Validators.required],
      usuarioId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.estadoPedidoKeys = Object.keys(this.EstadoPedido);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pedidoSeleccionado']) {
      if (this.pedidoSeleccionado) {
        // Editar: cargar datos al formulario
        this.formPedido.patchValue(this.pedidoSeleccionado);
      } else {
        // Nuevo: limpiar formulario
        this.formPedido.reset();
      }
    }
  }

  guardarPedido() {
    // Verificar si el formulario es inválido
    if (this.formPedido.invalid) {
      this.formPedido.markAllAsTouched();

      Object.keys(this.formPedido.controls).forEach((key) => {
        this.formPedido.get(key)?.markAsTouched();
      });

      // Mostrar alerta
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor complete todos los campos correctamente',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    const detalles = this.pedidoSeleccionado?.detalle ?? [];

    const pedido = {
      ...this.formPedido.value,
      detalles: detalles,
    };

    if (this.pedidoSeleccionado) {
      // EDITAR
      const pedidoId = this.pedidoSeleccionado.pedidoId;

      this.pedidoService.editarPedido(pedidoId!, pedido).subscribe({
        next: () => {
          Swal.fire('!Editado¡', 'El Pedido ha sido actualizado.', 'success');
          this.pedidoCreado.emit();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al actualizar pedido', err);
          Swal.fire('Error', 'No se pudo editar el Pedido', 'error');
        },
      });
    } else {
      // CREAR
      this.pedidoService.agregarPedido(pedido).subscribe({
        next: () => {
          Swal.fire('!Guardado', 'El Pedido ha sido registrado.', 'success');
          this.pedidoCreado.emit();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al crear pedido', err);
          Swal.fire('Error', 'No se pudo guardar el Pedido', 'error');
        },
      });
    }
  }

  cerrarModal() {
    const modalElement = document.getElementById('nuevoPedidoModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
    }

    // limpiar el formulario
    this.resetFormulario();
  }

  // Método para resetear completamente el formulario
  public resetFormulario(): void {
    this.pedidoSeleccionado = null;
    this.formPedido.reset();
  }

  // Método para abrir el modal (si lo llamas desde el componente)
  abrirModal(nuevoPedido: boolean = true): void {
    if (nuevoPedido) {
      this.resetFormulario();
    }

    const modalElement = document.getElementById('nuevoPedidoModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }
}
