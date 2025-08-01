import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from "../layout/footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  productosDestacados = [
    {
      nombre: 'Musgo Preservado Verde Claro',
      descripcion: 'Ideal para cuadros vivos y decoración interior.',
      precio: 25.90,
      imagenUrl: 'assets/images/default.jpg'
    },
    {
      nombre: 'Musgo Natural Nórdico',
      descripcion: 'Recolectado de bosques sostenibles, 100% natural.',
      precio: 30.50,
      imagenUrl: 'assets/images/default.jpg'
    },
    {
      nombre: 'Musgo Sphagnum Rojo',
      descripcion: 'Musgo colorido para arreglos únicos y terrarios.',
      precio: 28.00,
      imagenUrl: 'assets/images/default.jpg'
    },
    {
      nombre: 'Musgo Preservado Verde Claro',
      descripcion: 'Ideal para cuadros vivos y decoración interior.',
      precio: 25.90,
      imagenUrl: 'assets/images/default.jpg'
    },
    {
      nombre: 'Musgo Natural Nórdico',
      descripcion: 'Recolectado de bosques sostenibles, 100% natural.',
      precio: 30.50,
      imagenUrl: 'assets/images/default.jpg'
    },
    {
      nombre: 'Musgo Sphagnum Rojo',
      descripcion: 'Musgo colorido para arreglos únicos y terrarios.',
      precio: 28.00,
      imagenUrl: 'assets/images/default.jpg'
    },
  ];


  constructor() {}

  ngOnInit(): void { }

  addToCart(producto: any) {
    this.addToCart
  }
}
