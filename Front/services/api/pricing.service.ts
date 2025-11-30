import { apiClient } from './client';
import { API_CONFIG } from './config';
import { mockAdapter } from './mock.adapter';
import { UpdatePricingConfigRequest } from './dtos';

export const pricingService = {
  async getPricingConfig(): Promise<any> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getPricingConfig();
    }
    return apiClient.get('/pricing');
  },

  async updatePricingConfig(data: UpdatePricingConfigRequest): Promise<any> {
    if (API_CONFIG.USE_MOCK) {
      // Mock update - just return the updated config
      return { ...data, id: 'pricing-1', isActive: true };
    }
    return apiClient.put('/pricing', data);
  },
};