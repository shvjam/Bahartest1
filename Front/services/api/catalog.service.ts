import { apiClient } from './client';
import { API_CONFIG } from './config';
import { mockAdapter } from './mock.adapter';
import { ServiceCategory, CatalogCategory, CatalogItem } from '../../types';

export const catalogService = {
  async getServiceCategories(): Promise<ServiceCategory[]> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getServiceCategories();
    }
    return apiClient.get('/catalog/service-categories');
  },

  async getCatalogCategories(): Promise<CatalogCategory[]> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getCatalogCategories();
    }
    return apiClient.get('/catalog/categories');
  },

  async getCatalogItems(categoryId?: string): Promise<CatalogItem[]> {
    if (API_CONFIG.USE_MOCK) {
      const items = await mockAdapter.getCatalogItems();
      return categoryId ? items.filter(i => i.categoryId === categoryId) : items;
    }
    return apiClient.get('/catalog/items', categoryId ? { categoryId } : undefined);
  },
};