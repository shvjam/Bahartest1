import { apiClient } from './client';
import { API_CONFIG } from './config';
import { mockAdapter } from './mock.adapter';
import { User, Customer, Driver, PaginatedResponse } from '../../types';
import { UserListQuery } from './dtos';

export const userService = {
  async getProfile(): Promise<User> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getProfile();
    }
    return apiClient.get('/users/profile');
  },

  async getCustomers(query: UserListQuery = {}): Promise<PaginatedResponse<Customer>> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getCustomers(query);
    }
    return apiClient.get('/users/customers', query);
  },

  async getDrivers(query: UserListQuery = {}): Promise<PaginatedResponse<Driver>> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getDrivers(query);
    }
    return apiClient.get('/users/drivers', query);
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.update('profile', data);
    }
    return apiClient.put('/users/profile', data);
  },
};