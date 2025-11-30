/**
 * Packing Service - اتصال واقعی به Backend
 */

import { apiClient } from './client';
import type {
  PackingProductResponse,
  CreatePackingProductRequest,
  ApiResponse,
} from '../../types/backend.types';

class PackingService {
  /**
   * دریافت محصولات بسته‌بندی
   */
  async getPackingProducts(): Promise<PackingProductResponse[]> {
    try {
      const response = await apiClient.get<PackingProductResponse[]>('/packing-products');
      return response;
    } catch (error: any) {
      console.error('❌ Get Packing Products Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در دریافت محصولات بسته‌بندی');
    }
  }

  /**
   * ایجاد محصول بسته‌بندی (Admin)
   */
  async createPackingProduct(request: CreatePackingProductRequest): Promise<PackingProductResponse> {
    try {
      const response = await apiClient.post<PackingProductResponse>('/packing-products', request);
      return response;
    } catch (error: any) {
      console.error('❌ Create Packing Product Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در ایجاد محصول بسته‌بندی');
    }
  }

  /**
   * به‌روزرسانی محصول بسته‌بندی (Admin)
   */
  async updatePackingProduct(
    id: string,
    request: Partial<CreatePackingProductRequest>
  ): Promise<PackingProductResponse> {
    try {
      const response = await apiClient.put<PackingProductResponse>(
        `/packing-products/${id}`,
        request
      );
      return response;
    } catch (error: any) {
      console.error('❌ Update Packing Product Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در به‌روزرسانی محصول');
    }
  }

  /**
   * حذف محصول بسته‌بندی (Admin)
   */
  async deletePackingProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(`/packing-products/${id}`);
    } catch (error: any) {
      console.error('❌ Delete Packing Product Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در حذف محصول');
    }
  }
}

export const packingService = new PackingService();
