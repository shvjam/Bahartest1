/**
 * Service Category Service - اتصال واقعی به Backend
 */

import { apiClient } from './client';
import type {
  ServiceCategoryResponse,
  CreateServiceCategoryRequest,
  ApiResponse,
} from '../../types/backend.types';

class ServiceCategoryService {
  /**
   * دریافت تمام خدمات فعال
   */
  async getActiveServices(): Promise<ServiceCategoryResponse[]> {
    try {
      const response = await apiClient.get<ServiceCategoryResponse[]>('/services');
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت خدمات';
      throw new Error(message);
    }
  }

  /**
   * دریافت یک خدمت
   */
  async getServiceById(id: string): Promise<ServiceCategoryResponse> {
    try {
      const response = await apiClient.get<ServiceCategoryResponse>(`/services/${id}`);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خدمت یافت نشد';
      throw new Error(message);
    }
  }

  /**
   * ایجاد خدمت جدید (Admin)
   */
  async createService(request: CreateServiceCategoryRequest): Promise<ServiceCategoryResponse> {
    try {
      const response = await apiClient.post<ServiceCategoryResponse>('/services', request);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در ایجاد خدمت';
      throw new Error(message);
    }
  }

  /**
   * به‌روزرسانی خدمت (Admin)
   */
  async updateService(
    id: string,
    request: Partial<CreateServiceCategoryRequest>
  ): Promise<ServiceCategoryResponse> {
    try {
      const response = await apiClient.put<ServiceCategoryResponse>(`/services/${id}`, request);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در به‌روزرسانی خدمت';
      throw new Error(message);
    }
  }

  /**
   * حذف خدمت (Admin)
   */
  async deleteService(id: string): Promise<void> {
    try {
      await apiClient.delete(`/services/${id}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در حذف خدمت';
      throw new Error(message);
    }
  }
}

export const serviceCategoryService = new ServiceCategoryService();