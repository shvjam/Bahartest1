/**
 * Pricing Service - اتصال واقعی به Backend
 */

import { apiClient } from './client';
import type {
  PricingConfigResponse,
  UpdatePricingConfigRequest,
  ApiResponse,
} from '../../types/backend.types';

class PricingService {
  /**
   * دریافت تنظیمات قیمت‌گذاری
   */
  async getPricingConfigs(): Promise<PricingConfigResponse[]> {
    try {
      const response = await apiClient.get<PricingConfigResponse[]>('/pricing');
      return response;
    } catch (error: any) {
      console.error('❌ Get Pricing Configs Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در دریافت تنظیمات قیمت‌گذاری');
    }
  }

  /**
   * دریافت یک تنظیمات قیمت‌گذاری
   */
  async getPricingConfigById(id: string): Promise<PricingConfigResponse> {
    try {
      const response = await apiClient.get<PricingConfigResponse>(`/pricing/${id}`);
      return response;
    } catch (error: any) {
      console.error('❌ Get Pricing Config Error:', error);
      throw new Error(error.response?.data?.message || 'تنظیمات یافت نشد');
    }
  }

  /**
   * به‌روزرسانی تنظیمات قیمت‌گذاری (Admin)
   */
  async updatePricingConfig(request: UpdatePricingConfigRequest): Promise<PricingConfigResponse> {
    try {
      const response = await apiClient.put<PricingConfigResponse>(
        `/pricing/${request.id}`,
        request
      );
      return response;
    } catch (error: any) {
      console.error('❌ Update Pricing Config Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در به‌روزرسانی تنظیمات');
    }
  }
}

export const pricingService = new PricingService();
