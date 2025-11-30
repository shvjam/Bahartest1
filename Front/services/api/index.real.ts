/**
 * Real API Services Export
 * تمام Services واقعی برای اتصال به Backend
 */

export { authService } from './auth.service.real';
export { orderService } from './order.service.real';
export { serviceCategoryService } from './service-category.service.real';
export { catalogService } from './catalog.service.real';
export { userService } from './user.service.real';

// Import کردن services دیگر
export * from './packing.service.real';
export * from './pricing.service.real';
export * from './payment.service.real';
export * from './file.service.real';
export * from './dashboard.service.real';
export * from './driver.service.real';
export * from './notification.service.real';
