/**
 * User Service - اتصال واقعی به Backend
 */

import { apiClient } from './client';
import { API_CONFIG } from './config';
import { mockAdapter } from './mock.adapter';
import type {
  UserResponse,
  UpdateProfileRequest,
  AddressResponse,
  CreateAddressRequest,
  PaginatedResponse,
  PaginationParams,
  ApiResponse,
} from '../../types/backend.types';

class UserService {
  /**
   * دریافت پروفایل من
   */
  async getMyProfile(): Promise<UserResponse> {
    try {
      if (API_CONFIG.USE_MOCK) {
        return mockAdapter.getProfile() as any;
      }
      const response = await apiClient.get<UserResponse>('/users/profile');
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت پروفایل';
      throw new Error(message);
    }
  }

  /**
   * به‌روزرسانی پروفایل
   */
  async updateProfile(request: UpdateProfileRequest): Promise<UserResponse> {
    try {
      if (API_CONFIG.USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const currentUser = await this.getMyProfile();
        const updated = { ...currentUser, ...request };
        localStorage.setItem('user', JSON.stringify(updated));
        return updated as any;
      }
      const response = await apiClient.put<UserResponse>('/users/profile', request);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در به‌روزرسانی پروفایل';
      throw new Error(message);
    }
  }

  /**
   * تغییر رمز عبور
   */
  async changePassword(request: { currentPassword: string; newPassword: string }): Promise<void> {
    try {
      if (API_CONFIG.USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Mock: always succeed
        return;
      }
      await apiClient.post('/users/change-password', request);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در تغییر رمز عبور';
      throw new Error(message);
    }
  }

  /**
   * دریافت آدرس‌های من
   */
  async getMyAddresses(): Promise<AddressResponse[]> {
    try {
      const response = await apiClient.get<AddressResponse[]>('/users/addresses');
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت آدرس‌ها';
      throw new Error(message);
    }
  }

  /**
   * ایجاد آدرس جدید
   */
  async createAddress(request: CreateAddressRequest): Promise<AddressResponse> {
    try {
      const response = await apiClient.post<AddressResponse>('/users/addresses', request);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در ایجاد آدرس';
      throw new Error(message);
    }
  }

  /**
   * به‌روزرسانی آدرس
   */
  async updateAddress(id: string, request: CreateAddressRequest): Promise<AddressResponse> {
    try {
      const response = await apiClient.put<AddressResponse>(`/users/addresses/${id}`, request);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در به‌روزرسانی آدرس';
      throw new Error(message);
    }
  }

  /**
   * حذف آدرس
   */
  async deleteAddress(id: string): Promise<void> {
    try {
      await apiClient.delete(`/users/addresses/${id}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در حذف آدرس';
      throw new Error(message);
    }
  }

  /**
   * دریافت تمام کاربران (Admin)
   */
  async getAllUsers(params?: Partial<PaginationParams>): Promise<PaginatedResponse<UserResponse>> {
    try {
      const response = await apiClient.get<PaginatedResponse<UserResponse>>('/admin/users', {
        pageNumber: params?.pageNumber || 1,
        pageSize: params?.pageSize || 10,
        searchTerm: params?.searchTerm || '',
        sortBy: params?.sortBy || 'createdAt',
        sortDescending: params?.sortDescending ?? true,
      });
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در دریافت کاربران';
      throw new Error(message);
    }
  }

  /**
   * فعال/غیرفعال کردن کاربر (Admin)
   */
  async toggleUserActive(userId: string): Promise<UserResponse> {
    try {
      const response = await apiClient.put<UserResponse>(
        `/admin/users/${userId}/toggle-active`
      );
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'خطا در تغییر وضعیت کاربر';
      throw new Error(message);
    }
  }
}

export const userService = new UserService();