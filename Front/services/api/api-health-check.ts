/**
 * API Health Check
 * بررسی اینکه Backend در دسترس هست یا نه
 */

import { API_CONFIG } from './config';

export class ApiHealthCheck {
  private static isBackendAvailable: boolean | null = null;
  private static lastCheckTime: number = 0;
  private static CHECK_INTERVAL = 30000; // 30 seconds

  /**
   * بررسی سلامت Backend
   */
  static async checkHealth(): Promise<boolean> {
    // اگر قبلاً چک کردیم و هنوز وقت زیادی نگذشته، از cache استفاده کن
    const now = Date.now();
    if (
      this.isBackendAvailable !== null &&
      now - this.lastCheckTime < this.CHECK_INTERVAL
    ) {
      return this.isBackendAvailable;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api', '')}/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      this.isBackendAvailable = response.ok;
      this.lastCheckTime = now;

      console.log('🏥 Backend Health:', this.isBackendAvailable ? '✅ Available' : '❌ Unavailable');

      return this.isBackendAvailable;
    } catch (error) {
      console.error('🏥 Backend Health Check Failed:', error);
      this.isBackendAvailable = false;
      this.lastCheckTime = now;
      return false;
    }
  }

  /**
   * Reset cache
   */
  static reset(): void {
    this.isBackendAvailable = null;
    this.lastCheckTime = 0;
  }

  /**
   * دریافت وضعیت فعلی (بدون چک مجدد)
   */
  static getCurrentStatus(): boolean | null {
    return this.isBackendAvailable;
  }
}
