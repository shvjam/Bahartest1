/**
 * Catalog Service - اتصال واقعی به Backend
 */

import { apiClient } from './client';
import type {
  CatalogCategoryResponse,
  CatalogItemResponse,
  CreateCatalogItemRequest,
  ApiResponse,
} from '../../types/backend.types';

class CatalogService {
  /**
   * دریافت دسته‌بندی‌های کاتالوگ
   */
  async getCategories(): Promise<CatalogCategoryResponse[]> {
    try {
      const response = await apiClient.get<CatalogCategoryResponse[]>('/catalog/categories');
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت دسته‌بندی‌ها';
      throw new Error(message);
    }
  }

  /**
   * دریافت آیتم‌های کاتالوگ
   */
  async getItems(categoryId?: string): Promise<CatalogItemResponse[]> {
    try {
      const params = categoryId ? { categoryId } : {};
      const response = await apiClient.get<CatalogItemResponse[]>('/catalog/items', params);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت آیتم‌ها';
      throw new Error(message);
    }
  }

  /**
   * دریافت یک آیتم
   */
  async getItemById(id: string): Promise<CatalogItemResponse> {
    try {
      const response = await apiClient.get<CatalogItemResponse>(`/catalog/items/${id}`);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'آیتم یافت نشد';
      throw new Error(message);
    }
  }

  /**
   * ایجاد آیتم جدید (Admin)
   */
  async createItem(request: CreateCatalogItemRequest): Promise<CatalogItemResponse> {
    try {
      const response = await apiClient.post<CatalogItemResponse>('/catalog/items', request);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در ایجاد آیتم';
      throw new Error(message);
    }
  }

  /**
   * به‌روزرسانی آیتم (Admin)
   */
  async updateItem(
    id: string,
    request: Partial<CreateCatalogItemRequest>
  ): Promise<CatalogItemResponse> {
    try {
      const response = await apiClient.put<CatalogItemResponse>(`/catalog/items/${id}`, request);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در به‌روزرسانی آیتم';
      throw new Error(message);
    }
  }

  /**
   * حذف آیتم (Admin)
   */
  async deleteItem(id: string): Promise<void> {
    try {
      await apiClient.delete(`/catalog/items/${id}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در حذف آیتم';
      throw new Error(message);
    }
  }
}

export const catalogService = new CatalogService();