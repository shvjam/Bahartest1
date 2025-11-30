import { apiClient } from './client';
import { API_CONFIG } from './config';
import { mockAdapter } from './mock.adapter';

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_FOR_CUSTOMER = 'WAITING_FOR_CUSTOMER',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  message: string;
  isAdminMessage: boolean;
  createdAt: string;
  isRead: boolean;
  readAt?: string;
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt?: string;
  closedAt?: string;
  assignedToAdminId?: string;
  assignedToAdminName?: string;
  orderId?: string;
  orderNumber?: string;
  unreadMessagesCount: number;
  lastMessage?: TicketMessage;
}

export interface TicketDetail {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt?: string;
  closedAt?: string;
  assignedToAdminId?: string;
  assignedToAdminName?: string;
  orderId?: string;
  messages: TicketMessage[];
}

export interface CreateTicketRequest {
  subject: string;
  message: string;
  priority: TicketPriority;
  orderId?: string;
}

export interface SendTicketMessageRequest {
  ticketId: string;
  message: string;
}

export interface TicketListParams {
  pageNumber?: number;
  pageSize?: number;
  status?: TicketStatus;
  priority?: TicketPriority;
  userId?: string;
  assignedToAdminId?: string;
  searchTerm?: string;
  fromDate?: string;
  toDate?: string;
}

class TicketService {
  async getTickets(params?: TicketListParams) {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getTickets(params);
    }
    const response = await apiClient.get<any>('/tickets', { params });
    return response;
  }

  async getTicketById(ticketId: string): Promise<TicketDetail> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getTicketById(ticketId) as unknown as TicketDetail;
    }
    return apiClient.get(`/tickets/${ticketId}`);
  }

  async createTicket(data: CreateTicketRequest): Promise<Ticket> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.createTicket(data) as unknown as Ticket;
    }
    const response = await apiClient.post<any>('/tickets', data);
    return response.data;
  }

  async sendMessage(data: SendTicketMessageRequest): Promise<TicketMessage> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.sendTicketMessage(data);
    }
    const response = await apiClient.post<any>('/tickets/messages', data);
    return response.data;
  }

  async updateTicketStatus(ticketId: string, status: TicketStatus): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.updateTicketStatus(ticketId, status);
    }
    await apiClient.patch(`/tickets/${ticketId}/status`, { status });
  }

  async assignTicket(ticketId: string, adminId: string): Promise<void> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.assignTicket(ticketId, adminId);
    }
    await apiClient.patch(`/tickets/${ticketId}/assign`, { adminId });
  }

  async getUnreadCount(): Promise<number> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getUnreadTicketCount();
    }
    const response = await apiClient.get<any>('/tickets/unread-count');
    return response.data;
  }
}

export const ticketService = new TicketService();