import { apiClient } from './client';
import { API_CONFIG } from './config';
import { mockAdapter } from './mock.adapter';
import { CreateServiceCategoryRequest, UpdateServiceCategoryRequest } from './dtos';
import { ServiceCategory } from '../../types';

export const serviceService = {
  async getServiceCategories(): Promise<ServiceCategory[]> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getServiceCategories();
    }
    return apiClient.get('/services');
  },

  async getActiveServiceCategories(): Promise<ServiceCategory[]> {
    if (API_CONFIG.USE_MOCK) {
      const all = await mockAdapter.getServiceCategories();
      return all.filter(s => s.isActive);
    }
    return apiClient.get('/services/active');
  },

  async getServiceCategory(id: string): Promise<ServiceCategory> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getServiceCategory(id);
    }
    return apiClient.get(`/services/${id}`);
  },

  async getServiceCategoryBySlug(slug: string): Promise<ServiceCategory> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getServiceCategoryBySlug(slug);
    }
    return apiClient.get(`/services/slug/${slug}`);
  },

  async createServiceCategory(data: CreateServiceCategoryRequest): Promise<ServiceCategory> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.createServiceCategory(data);
    }
    return apiClient.post('/services', data);
  },

  async updateServiceCategory(id: string, data: UpdateServiceCategoryRequest): Promise<ServiceCategory> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.updateServiceCategory(id, data);
    }
    return apiClient.put(`/services/${id}`, data);
  },

  async deleteServiceCategory(id: string): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.deleteServiceCategory(id);
    }
    return apiClient.delete(`/services/${id}`);
  },

  async toggleServiceStatus(id: string): Promise<ServiceCategory> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.toggleServiceStatus(id);
    }
    return apiClient.patch(`/services/${id}/toggle-status`);
  },

  async toggleServiceFeatured(id: string): Promise<ServiceCategory> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.toggleServiceFeatured(id);
    }
    return apiClient.patch(`/services/${id}/toggle-featured`);
  },
};