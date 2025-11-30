import { apiClient } from './client';
import { API_CONFIG } from './config';
import { mockAdapter } from './mock.adapter';
import { PackingProduct } from '../../types';

export const packingService = {
  async getPackingProducts(): Promise<PackingProduct[]> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getPackingProducts();
    }
    return apiClient.get('/packing/products');
  },
};