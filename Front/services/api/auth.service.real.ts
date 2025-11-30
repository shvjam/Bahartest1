/**
 * Auth Service - اتصال واقعی به Backend
 */

import { apiClient } from './client';
import { STORAGE_KEYS } from './config';
import type {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  AuthResponse,
  RefreshTokenRequest,
  ApiResponse,
} from '../../types/backend.types';

class AuthService {
  /**
   * ارسال OTP به شماره موبایل
   */
  async sendOtp(request: SendOtpRequest): Promise<SendOtpResponse> {
    try {
      const response = await apiClient.post<SendOtpResponse>(
        '/auth/send-otp',
        request
      );
      return response;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'خطا در ارسال کد تایید';
      throw new Error(message);
    }
  }

  /**
   * تایید OTP و ورود
   */
  async verifyOtp(request: VerifyOtpRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/auth/verify-otp',
        request
      );

      // ذخیره توکن‌ها و اطلاعات کاربر
      if (response.accessToken) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
      }
      if (response.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      }
      if (response.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      }

      return response;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'کد تایید نامعتبر است';
      throw new Error(message);
    }
  }

  /**
   * Refresh Token
   */
  async refreshToken(request: RefreshTokenRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/auth/refresh-token',
        request
      );

      // به‌روزرسانی توکن‌ها
      if (response.accessToken) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
      }
      if (response.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      }

      return response;
    } catch (error: unknown) {
      this.logout();
      throw new Error('نشست شما منقضی شده است');
    }
  }

  /**
   * Revoke Token (Logout)
   */
  async revokeToken(refreshToken: string): Promise<void> {
    try {
      await apiClient.post('/auth/revoke-token', { refreshToken });
    } catch (error: unknown) {
      // Silently fail on revoke error
    } finally {
      this.logout();
    }
  }

  /**
   * Logout (Local)
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  /**
   * دریافت کاربر فعلی
   */
  getCurrentUser() {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * بررسی احراز هویت
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * دریافت Access Token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * دریافت Refresh Token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
}

export const authService = new AuthService();