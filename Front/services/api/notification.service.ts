import { apiClient } from './client';
import { NotificationListQuery, MarkNotificationReadRequest } from './dtos';
import { Notification, PaginatedResponse } from '../../types';

export const notificationService = {
  async getNotifications(query: NotificationListQuery = {}): Promise<PaginatedResponse<Notification>> {
    return apiClient.get('/notifications', query);
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return response.count;
  },

  async markAsRead(data: MarkNotificationReadRequest): Promise<void> {
    return apiClient.post(`/notifications/${data.notificationId}/read`);
  },

  async markAllAsRead(): Promise<void> {
    return apiClient.post('/notifications/read-all');
  },
};
