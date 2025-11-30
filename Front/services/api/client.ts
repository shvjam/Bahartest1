import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from './config';
import { ApiResponse } from '../../types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 10000, // کاهش timeout از 30s به 10s
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request Interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiResponse<any>>) => {
        // Network Error
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          console.error('❌ Network Error: Backend is not available');
          const customError = new Error('سرور در دسترس نیست. لطفاً بعداً تلاش کنید.');
          (customError as any).isNetworkError = true;
          return Promise.reject(customError);
        }

        // Timeout Error
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          console.error('❌ Timeout Error');
          const customError = new Error('زمان درخواست به پایان رسید. لطفاً دوباره تلاش کنید.');
          (customError as any).isTimeoutError = true;
          return Promise.reject(customError);
        }

        // 401 Unauthorized
        if (error.response?.status === 401) {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }

        // سایر خطاها
        const message = error.response?.data?.message || 'خطایی رخ داد';
        return Promise.reject(new Error(message));
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }

  // Helper methods
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data.data as T;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data.data as T;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data.data as T;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data);
    return response.data.data as T;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data.data as T;
  }
}

export const apiClient = new ApiClient();
export const axiosInstance = apiClient.getInstance();