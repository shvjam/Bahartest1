/**
 * Dashboard Service - اتصال واقعی به Backend
 */

import { apiClient } from './client';
import type {
  DashboardStatsResponse,
  ApiResponse,
} from '../../types/backend.types';

class DashboardService {
  /**
   * دریافت آمار داشبورد (Admin)
   */
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    try {
      const response = await apiClient.get<DashboardStatsResponse>('/dashboard/stats');
      return response;
    } catch (error: any) {
      console.error('❌ Get Dashboard Stats Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در دریافت آمار');
    }
  }

  /**
   * دریافت درآمد (Admin)
   */
  async getRevenue(startDate?: Date, endDate?: Date): Promise<any> {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();

      const response = await apiClient.get('/dashboard/revenue', params);
      return response;
    } catch (error: any) {
      console.error('❌ Get Revenue Error:', error);
      throw new Error(error.response?.data?.message || 'خطا در دریافت درآمد');
    }
  }
}

export const dashboardService = new DashboardService();
