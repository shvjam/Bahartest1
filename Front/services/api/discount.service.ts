import { apiClient } from './client';
import {
  CreateDiscountCodeRequest,
  UpdateDiscountCodeRequest,
  ValidateDiscountCodeRequest,
  ValidateDiscountCodeResponse,
} from './dtos';
import { DiscountCode } from '../../types';

export const discountService = {
  async getDiscountCodes(): Promise<DiscountCode[]> {
    return apiClient.get('/discount-codes');
  },

  async getDiscountCode(id: string): Promise<DiscountCode> {
    return apiClient.get(`/discount-codes/${id}`);
  },

  async createDiscountCode(data: CreateDiscountCodeRequest): Promise<DiscountCode> {
    return apiClient.post('/discount-codes', data);
  },

  async updateDiscountCode(id: string, data: UpdateDiscountCodeRequest): Promise<DiscountCode> {
    return apiClient.put(`/discount-codes/${id}`, data);
  },

  async deleteDiscountCode(id: string): Promise<void> {
    return apiClient.delete(`/discount-codes/${id}`);
  },

  async validateDiscountCode(data: ValidateDiscountCodeRequest): Promise<ValidateDiscountCodeResponse> {
    return apiClient.post('/discount-codes/validate', data);
  },
};
