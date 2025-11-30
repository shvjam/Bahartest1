/**
 * Driver Service - اتصال واقعی به Backend
 */

import { apiClient } from './client';
import type {
  DriverResponse,
  PaginatedResponse,
  PaginationParams,
  ApiResponse,
} from '../../types/backend.types';

class DriverService {
  /**
   * دریافت تمام راننده‌ها (Admin)
   */
  async getAllDrivers(params?: Partial<PaginationParams>): Promise<PaginatedResponse<DriverResponse>> {
    try {
      const response = await apiClient.get<PaginatedResponse<DriverResponse>>('/drivers', {
        pageNumber: params?.pageNumber || 1,
        pageSize: params?.pageSize || 10,
        searchTerm: params?.searchTerm || '',
        sortBy: params?.sortBy || 'createdAt',
        sortDescending: params?.sortDescending ?? true,
      });
      return response;
    } catch (error: any) {
      console.error('❌ Get Drivers Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در دریافت راننده‌ها');
    }
  }

  /**
   * دریافت اطلاعات یک راننده
   */
  async getDriverById(id: string): Promise<DriverResponse> {
    try {
      const response = await apiClient.get<DriverResponse>(`/drivers/${id}`);
      return response;
    } catch (error: any) {
      console.error('❌ Get Driver Error:', error);
      throw new Error(error.response?.data?.message || 'راننده یافت نشد');
    }
  }

  /**
   * تایید راننده (Admin)
   */
  async verifyDriver(id: string): Promise<DriverResponse> {
    try {
      const response = await apiClient.put<DriverResponse>(`/admin/drivers/${id}/verify`);
      return response;
    } catch (error: any) {
      console.error('❌ Verify Driver Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در تایید راننده');
    }
  }

  /**
   * دریافت راننده‌های در دسترس
   */
  async getAvailableDrivers(): Promise<DriverResponse[]> {
    try {
      const response = await apiClient.get<DriverResponse[]>('/drivers/available');
      return response;
    } catch (error: any) {
      console.error('❌ Get Available Drivers Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در دریافت راننده‌های در دسترس');
    }
  }

  /**
   * به‌روزرسانی وضعیت راننده
   */
  async updateDriverStatus(newStatus: string, latitude?: number, longitude?: number): Promise<DriverResponse> {
    try {
      const response = await apiClient.put<DriverResponse>('/drivers/status', {
        newStatus,
        currentLatitude: latitude,
        currentLongitude: longitude,
      });
      return response;
    } catch (error: any) {
      console.error('❌ Update Driver Status Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در به‌روزرسانی وضعیت');
    }
  }
}

export const driverService = new DriverService();
