import { apiClient } from './client';
import { API_CONFIG } from './config';
import { mockAdapter } from './mock.adapter';
import { DashboardStats, DriverStats, CustomerStats } from '../../types';

export const statsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getDashboardStats();
    }
    return apiClient.get('/stats/dashboard');
  },

  async getDriverStats(driverId: string): Promise<DriverStats> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getDriverStats(driverId);
    }
    return apiClient.get(`/stats/driver/${driverId}`);
  },

  async getCustomerStats(customerId: string): Promise<CustomerStats> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getCustomerStats(customerId);
    }
    return apiClient.get(`/stats/customer/${customerId}`);
  },
};