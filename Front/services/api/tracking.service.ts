import { apiClient } from './client';
import { LocationUpdateDto } from './dtos';
import { LocationUpdate } from '../../types';

export const trackingService = {
  async updateLocation(data: LocationUpdateDto): Promise<void> {
    return apiClient.post('/tracking/location', data);
  },

  async getOrderTracking(orderId: string): Promise<LocationUpdate[]> {
    return apiClient.get(`/tracking/orders/${orderId}`);
  },

  async getLatestLocation(orderId: string): Promise<LocationUpdate | null> {
    return apiClient.get(`/tracking/orders/${orderId}/latest`);
  },
};
