import { Component } from '@angular/core';
import { NavbarComponent } from "../layout/navbar/navbar.component";
import { FooterComponent } from "../layout/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule ,NavbarComponent, FooterComponent],
  templateUrl: './sobre-nosotros.component.html',
  styleUrl: './sobre-nosotros.component.scss'
})
export class SobreNosotrosComponent {

}
