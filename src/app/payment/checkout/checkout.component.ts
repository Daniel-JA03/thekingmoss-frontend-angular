import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FooterComponent } from '../../cliente/layout/footer/footer.component';
import { NavbarComponent } from '../../cliente/layout/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { StripeService, StripeCardComponent } from 'ngx-stripe';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaymentService } from '../services/payment.service';
import { PedidoService } from '../../admin/pedido/services/pedido.service';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    RouterLink,
    StripeCardComponent
],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  pedidoId!: number;
  isLoading = false;
  paymentError: string | null = null;
  pedidoConfirmado = false;
  elementsOptions: StripeElementsOptions = {};

  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  // añadir cardOptions
  cardOptions: StripeCardElementOptions = {
  style: {
    base: {
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',

      '::placeholder': {
        color: 'rgba(255, 255, 255, 0.45)'
      },

      // color de "Link", número de tarjeta, expiración, cvc
      iconColor: '#00ffaa',
    },
    invalid: {
      color: '#ff6b6b',
      iconColor: '#ff6b6b',
    }
  }
};


  private stripeService = inject(StripeService);
  private route = inject(ActivatedRoute);
  private pagoService = inject(PaymentService);
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.pedidoId = +this.route.snapshot.paramMap.get('id')!;
    this.cargarPaymentIntent();
  }

  private async cargarPaymentIntent(): Promise<void> {
    this.isLoading = true;
    this.paymentError = null;

    try {
      const email = this.authService.getEmail() || 'cliente@thekingmoss.com';
      const response = await firstValueFrom(
        this.pagoService.crearPaymentIntent({ pedidoId: this.pedidoId, email })
      );
      this.elementsOptions = { clientSecret: response.clientSecret };
    } catch (err: any) {
      this.paymentError = 'No se pudo cargar el formulario de pago';
      console.error('Error al cargar PaymentIntent', err);
    } finally {
      this.isLoading = false;
    }
  }

  async pagar(): Promise<void> {
  if (!this.elementsOptions.clientSecret) return;

  this.isLoading = true;
  this.paymentError = null;

  try {
    const result = await firstValueFrom(
      this.stripeService.confirmCardPayment(
        this.elementsOptions.clientSecret!,
        { payment_method: { card: this.card.element } }
      )
    );


    // ✅ Manejo seguro del resultado
    if (result.error) {
      this.paymentError = result.error.message || 'Error al procesar el pago';
    } else if (result.paymentIntent?.status === 'succeeded') {
      // Confirmar en tu backend
      await firstValueFrom(
        this.pedidoService.confirmPayment({
          pedidoId: this.pedidoId,
          stripePaymentId: result.paymentIntent.id
        })
      );
      this.pedidoConfirmado = true;
    }

  } catch (err: any) {
    this.paymentError = 'No se pudo completar el pago';
    console.error('Error al confirmar pago', err);
  } finally {
    this.isLoading = false;
  }
}
}
