import { apiClient } from './client';
import { STORAGE_KEYS, API_CONFIG } from './config';
import { mockAdapter } from './mock.adapter';
import {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  AuthResponse,
  RefreshTokenRequest,
} from './dtos';
import { User } from '../../types';

export const authService = {
  async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.sendOtp(data.phoneNumber);
    }
    return apiClient.post('/auth/send-otp', data);
  },

  async verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
    let response: AuthResponse;
    
    if (API_CONFIG.USE_MOCK) {
      response = await mockAdapter.verifyOtp(data.phoneNumber, data.otp);
    } else {
      response = await apiClient.post<AuthResponse>('/auth/verify-otp', data);
    }
    
    // Store tokens
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
    
    return response;
  },

  async refreshToken(data: RefreshTokenRequest): Promise<AuthResponse> {
    if (API_CONFIG.USE_MOCK) {
      throw new Error('Mock mode: refresh token not supported');
    }
    const response = await apiClient.post<AuthResponse>('/auth/refresh-token', data);
    
    // Update tokens
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    
    return response;
  },

  async logout(): Promise<void> {
    try {
      if (!API_CONFIG.USE_MOCK) {
        await apiClient.post('/auth/logout');
      }
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  async getProfile(): Promise<User> {
    if (API_CONFIG.USE_MOCK) {
      return mockAdapter.getProfile();
    }
    return apiClient.get('/auth/profile');
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};