/**
 * Payment Service - اتصال واقعی به Backend
 */

import { apiClient } from './client';
import type {
  PaymentRequest,
  PaymentRequestResult,
  PaymentVerifyResult,
  ApiResponse,
} from '../../types/backend.types';

class PaymentService {
  /**
   * درخواست پرداخت
   */
  async requestPayment(request: PaymentRequest): Promise<PaymentRequestResult> {
    try {
      const response = await apiClient.post<PaymentRequestResult>('/payment/request', request);
      return response;
    } catch (error: any) {
      console.error('❌ Request Payment Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در درخواست پرداخت');
    }
  }

  /**
   * تایید پرداخت
   */
  async verifyPayment(authority: string, status: string): Promise<PaymentVerifyResult> {
    try {
      const response = await apiClient.get<PaymentVerifyResult>(
        `/payment/verify?Authority=${authority}&Status=${status}`
      );
      return response;
    } catch (error: any) {
      console.error('❌ Verify Payment Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در تایید پرداخت');
    }
  }

  /**
   * دریافت وضعیت پرداخت سفارش
   */
  async getOrderPaymentStatus(orderId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/payment/order/${orderId}`);
      return response;
    } catch (error: any) {
      console.error('❌ Get Payment Status Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در دریافت وضعیت پرداخت');
    }
  }
}

export const paymentService = new PaymentService();
