import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductoResponse } from '../../../interface/entities/producto.interface';

@Component({
  selector: 'app-crear-produc',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-produc.component.html',
  styleUrl: './crear-produc.component.scss'
})
export class CrearProducComponent implements OnInit {
  @Input() productoSeleccionado: ProductoResponse | null = null;
  @Output() productoCreado = new EventEmitter<void>();

  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
