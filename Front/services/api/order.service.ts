import { apiClient } from './client';
import { API_CONFIG } from './config';
import { mockAdapter } from './mock.adapter';
import {
  CreateOrderRequest,
  UpdateOrderRequest,
  AssignDriverRequest,
  OrderListQuery,
  CalculatePriceRequest,
  PriceCalculationResponse,
  RateOrderRequest,
} from './dtos';
import { Order, PaginatedResponse } from '../../types';

export const orderService = {
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.createOrder(data);
    }
    return apiClient.post('/orders', data);
  },

  async getOrder(id: string): Promise<Order> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getOrder(id);
    }
    return apiClient.get(`/orders/${id}`);
  },

  async getOrders(query: OrderListQuery = {}): Promise<PaginatedResponse<Order>> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getOrders(query);
    }
    return apiClient.get('/orders', query);
  },

  async updateOrder(id: string, data: UpdateOrderRequest): Promise<Order> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.updateOrder(id, data);
    }
    return apiClient.put(`/orders/${id}`, data);
  },

  async cancelOrder(id: string, reason: string): Promise<Order> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.updateOrder(id, { status: 'CANCELLED' as any, cancellationReason: reason });
    }
    return apiClient.post(`/orders/${id}/cancel`, { reason });
  },

  async assignDriver(data: AssignDriverRequest): Promise<Order> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.updateOrder(data.orderId, { driverId: data.driverId });
    }
    return apiClient.post(`/orders/${data.orderId}/assign-driver`, data);
  },

  async acceptOrder(orderId: string): Promise<Order> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.updateOrder(orderId, { status: 'CONFIRMED' as any });
    }
    return apiClient.post(`/orders/${orderId}/accept`);
  },

  async rejectOrder(orderId: string, reason: string): Promise<Order> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.updateOrder(orderId, { status: 'CANCELLED' as any, cancellationReason: reason });
    }
    return apiClient.post(`/orders/${orderId}/reject`, { reason });
  },

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.updateOrder(orderId, { status: status as any });
    }
    return apiClient.post(`/orders/${orderId}/status`, { status });
  },

  async calculatePrice(data: CalculatePriceRequest): Promise<PriceCalculationResponse> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.calculatePrice(data);
    }
    return apiClient.post('/orders/calculate-price', data);
  },

  async rateOrder(data: RateOrderRequest): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      await mockAdapter.updateOrder(data.orderId, { rating: data.rating, review: data.review });
      return;
    }
    return apiClient.post(`/orders/${data.orderId}/rate`, {
      rating: data.rating,
      review: data.review,
    });
  },

  async getCustomerOrders(customerId: string, query: OrderListQuery = {}): Promise<PaginatedResponse<Order>> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getOrders({ ...query, customerId });
    }
    return apiClient.get(`/customers/${customerId}/orders`, query);
  },

  async getDriverOrders(driverId: string, query: OrderListQuery = {}): Promise<PaginatedResponse<Order>> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getOrders({ ...query, driverId });
    }
    return apiClient.get(`/drivers/${driverId}/orders`, query);
  },
};