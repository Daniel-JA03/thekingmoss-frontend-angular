export interface PaymentRequest {
    pedidoId: number;
    email: string
}

export interface PaymentResponse {
    clientSecret: string;
}