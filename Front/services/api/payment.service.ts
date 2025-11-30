import { apiClient } from './client';
import { CreatePaymentRequest, PaymentCallbackRequest } from './dtos';
import { Payment } from '../../types';

export const paymentService = {
  async createPayment(data: CreatePaymentRequest): Promise<{ payment: Payment; paymentUrl?: string }> {
    return apiClient.post('/payments', data);
  },

  async verifyPayment(data: PaymentCallbackRequest): Promise<Payment> {
    return apiClient.post('/payments/verify', data);
  },

  async getPayment(id: string): Promise<Payment> {
    return apiClient.get(`/payments/${id}`);
  },

  async getOrderPayments(orderId: string): Promise<Payment[]> {
    return apiClient.get(`/orders/${orderId}/payments`);
  },
};
