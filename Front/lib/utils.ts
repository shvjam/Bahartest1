import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// فرمت تاریخ شمسی
export function formatPersianDate(date: Date | string | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  
  return new Intl.DateTimeFormat('fa-IR', defaultOptions).format(dateObj);
}

// فرمت تاریخ و ساعت شمسی
export function formatPersianDateTime(date: Date | string | undefined): string {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

// فرمت قیمت با جداکننده هزارگان
export function formatCurrency(amount: number | undefined, showUnit = true): string {
  if (amount === undefined || amount === null) return '-';
  const formatted = new Intl.NumberFormat('fa-IR').format(amount);
  return showUnit ? `${formatted} تومان` : formatted;
}

// فرمت شماره تلفن
export function formatPhoneNumber(phone: string | undefined): string {
  if (!phone) return '-';
  // 09121234567 -> 0912 123 4567
  if (phone.length === 11) {
    return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
  }
  return phone;
}

// محاسبه درصد
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

// ترانکیت متن
export function truncateText(text: string | undefined, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// دانلود فایل
export function downloadFile(content: string, filename: string, type = 'text/plain'): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// تبدیل به slug
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// Generate random ID
export function generateId(prefix = ''): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}-${timestamp}-${randomStr}` : `${timestamp}-${randomStr}`;
}

// Validate Iranian phone number
export function isValidIranianPhone(phone: string): boolean {
  const regex = /^09[0-9]{9}$/;
  return regex.test(phone);
}

// Validate Iranian national ID
export function isValidNationalId(code: string): boolean {
  if (!/^\d{10}$/.test(code)) return false;
  
  const check = parseInt(code[9]);
  const sum = code
    .split('')
    .slice(0, 9)
    .reduce((acc, digit, index) => acc + parseInt(digit) * (10 - index), 0);
  
  const remainder = sum % 11;
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
}

// Sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
