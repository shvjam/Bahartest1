/**
 * Order Service - اتصال واقعی به Backend
 */

import { apiClient } from './client';
import type {
  CreateOrderRequest,
  OrderResponse,
  OrderListItemResponse,
  PriceEstimateResponse,
  PaginatedResponse,
  PaginationParams,
  ApiResponse,
} from '../../types/backend.types';

class OrderService {
  /**
   * لیست سفارش‌های من
   */
  async getMyOrders(params?: Partial<PaginationParams>): Promise<PaginatedResponse<OrderListItemResponse>> {
    try {
      const response = await apiClient.get<PaginatedResponse<OrderListItemResponse>>(
        '/orders/my-orders',
        {
          pageNumber: params?.pageNumber || 1,
          pageSize: params?.pageSize || 10,
          searchTerm: params?.searchTerm || '',
          sortBy: params?.sortBy || 'createdAt',
          sortDescending: params?.sortDescending ?? true,
        }
      );
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت سفارش‌ها';
      throw new Error(message);
    }
  }

  /**
   * تمام سفارش‌ها (Admin/Driver)
   */
  async getAllOrders(params?: Partial<PaginationParams>): Promise<PaginatedResponse<OrderListItemResponse>> {
    try {
      const response = await apiClient.get<PaginatedResponse<OrderListItemResponse>>(
        '/orders',
        {
          pageNumber: params?.pageNumber || 1,
          pageSize: params?.pageSize || 10,
          searchTerm: params?.searchTerm || '',
          sortBy: params?.sortBy || 'createdAt',
          sortDescending: params?.sortDescending ?? true,
        }
      );
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت سفارش‌ها';
      throw new Error(message);
    }
  }

  /**
   * جزئیات سفارش
   */
  async getOrderById(id: string): Promise<OrderResponse> {
    try {
      const response = await apiClient.get<OrderResponse>(`/orders/${id}`);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'سفارش یافت نشد';
      throw new Error(message);
    }
  }

  /**
   * ایجاد سفارش جدید
   */
  async createOrder(request: CreateOrderRequest): Promise<OrderResponse> {
    try {
      const response = await apiClient.post<OrderResponse>('/orders', request);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در ثبت سفارش';
      throw new Error(message);
    }
  }

  /**
   * محاسبه قیمت سفارش
   */
  async calculatePrice(request: CreateOrderRequest): Promise<PriceEstimateResponse> {
    try {
      const response = await apiClient.post<PriceEstimateResponse>(
        '/orders/calculate-price',
        request
      );
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در محاسبه قیمت';
      throw new Error(message);
    }
  }

  /**
   * به‌روزرسانی وضعیت سفارش (Admin/Driver)
   */
  async updateOrderStatus(
    orderId: string,
    newStatus: string,
    reason?: string
  ): Promise<OrderResponse> {
    try {
      const response = await apiClient.put<OrderResponse>(
        `/orders/${orderId}/status`,
        { newStatus, reason }
      );
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در به‌روزرسانی وضعیت';
      throw new Error(message);
    }
  }

  /**
   * تخصیص راننده به سفارش (Admin)
   */
  async assignDriver(orderId: string, driverId: string, note?: string): Promise<OrderResponse> {
    try {
      const response = await apiClient.post<OrderResponse>(
        `/orders/${orderId}/assign-driver`,
        { driverId, note }
      );
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در تخصیص راننده';
      throw new Error(message);
    }
  }

  /**
   * لغو سفارش
   */
  async cancelOrder(orderId: string, reason: string): Promise<OrderResponse> {
    try {
      const response = await apiClient.put<OrderResponse>(
        `/orders/${orderId}/cancel`,
        { reason }
      );
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در لغو سفارش';
      throw new Error(message);
    }
  }
}

export const orderService = new OrderService();