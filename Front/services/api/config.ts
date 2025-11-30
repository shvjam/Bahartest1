const getEnvVar = (key: string, defaultValue: string = ''): string => {
  // @ts-ignore - Vite env variables
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[key] || defaultValue;
  }
  return defaultValue;
};

// بررسی اینکه آیا کاربر صراحتاً Mock Mode را تنظیم کرده یا نه
const explicitMockMode = getEnvVar('VITE_USE_MOCK', '');
const hasExplicitMockSetting = explicitMockMode === 'true' || explicitMockMode === 'false';

export const API_CONFIG = {
  BASE_URL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:5000/api'),
  SIGNALR_HUB_URL: getEnvVar('VITE_SIGNALR_HUB_URL', 'http://localhost:5000/hubs'),
  TIMEOUT: 30000,
  // حالت Mock: اگر در .env مشخص نشده، به صورت پیش‌فرض false است (استفاده از Backend واقعی)
  USE_MOCK: hasExplicitMockSetting 
    ? explicitMockMode === 'true' 
    : false, // Default: Backend واقعی
};

// Log configuration on load (helps with debugging)
console.log('🔧 API Configuration:', {
  BASE_URL: API_CONFIG.BASE_URL,
  SIGNALR_HUB_URL: API_CONFIG.SIGNALR_HUB_URL,
  USE_MOCK: API_CONFIG.USE_MOCK,
  ENV_VITE_USE_MOCK: getEnvVar('VITE_USE_MOCK', 'not set'),
  HAS_EXPLICIT_SETTING: hasExplicitMockSetting,
});

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
};