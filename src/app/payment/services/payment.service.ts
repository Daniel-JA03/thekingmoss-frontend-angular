import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'http://localhost:8080/api/payments'

  constructor(private httpClient: HttpClient) {}

  crearPaymentIntent(payment: PaymentRequest): Observable<PaymentResponse> {
    return this.httpClient.post<PaymentResponse>(`${this.baseUrl}/create-intent`, payment)
  }
}

