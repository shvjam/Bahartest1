import { apiClient } from './client';
import { API_CONFIG } from './config';
import { mockAdapter } from './mock.adapter';
import { Address } from '../../types';
import { CreateAddressRequest } from './dtos';

export const addressService = {
  async getAddresses(): Promise<Address[]> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getAddresses();
    }
    return apiClient.get('/addresses');
  },

  async createAddress(data: CreateAddressRequest): Promise<Address> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.createAddress(data);
    }
    return apiClient.post('/addresses', data);
  },

  async deleteAddress(id: string): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.delete(id);
    }
    return apiClient.delete(`/addresses/${id}`);
  },
};