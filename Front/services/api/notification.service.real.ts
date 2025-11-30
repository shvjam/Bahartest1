/**
 * Notification Service - اتصال واقعی به Backend
 */

import { apiClient } from './client';
import type {
  NotificationResponse,
  ApiResponse,
} from '../../types/backend.types';

class NotificationService {
  /**
   * دریافت اعلان‌های من
   */
  async getMyNotifications(): Promise<NotificationResponse[]> {
    try {
      const response = await apiClient.get<NotificationResponse[]>('/notifications');
      return response;
    } catch (error: any) {
      console.error('❌ Get Notifications Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در دریافت اعلان‌ها');
    }
  }

  /**
   * علامت‌گذاری اعلان به عنوان خوانده شده
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await apiClient.put(`/notifications/${notificationId}/mark-read`);
    } catch (error: any) {
      console.error('❌ Mark Notification As Read Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در علامت‌گذاری اعلان');
    }
  }

  /**
   * علامت‌گذاری همه اعلان‌ها به عنوان خوانده شده
   */
  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.put('/notifications/mark-all-read');
    } catch (error: any) {
      console.error('❌ Mark All Notifications As Read Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در علامت‌گذاری اعلان‌ها');
    }
  }
}

export const notificationService = new NotificationService();
