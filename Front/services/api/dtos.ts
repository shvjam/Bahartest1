import {
  User,
  Order,
  OrderStatus,
  Driver,
  Customer,
  ServiceCategory,
  CatalogCategory,
  CatalogItem,
  PackingProduct,
  PricingConfig,
  DiscountCode,
  DashboardStats,
  DriverStats,
  CustomerStats,
  Address,
  Payment,
  Notification,
  VehicleType,
  PackingType,
  PaymentMethod,
} from '../../types';

// ============================================
// AUTH DTOs
// ============================================

export interface SendOtpRequest {
  phoneNumber: string;
}

export interface SendOtpResponse {
  message: string;
  expiresIn: number;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  otp: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ============================================
// ORDER DTOs
// ============================================

export interface CreateOrderRequest {
  customerId?: string;
  customerPhone: string;
  customerName?: string;
  serviceCategoryId: string;
  preferredDateTime: string;
  originAddress: Omit<Address, 'id' | 'userId' | 'createdAt'>;
  destinationAddress: Omit<Address, 'id' | 'userId' | 'createdAt'>;
  stops?: Omit<Address, 'id' | 'userId' | 'createdAt'>[];
  details: {
    needsPacking: boolean;
    needsWorkers: boolean;
    workerCount: number;
    vehicleType: VehicleType;
    [key: string]: any;
  };
  locationDetails: {
    originFloor: number;
    originHasElevator: boolean;
    destinationFloor: number;
    destinationHasElevator: boolean;
    walkDistanceMeters: number;
    stopCount: number;
  };
  items: Array<{
    catalogItemId: string;
    quantity: number;
  }>;
  packingService?: {
    type: PackingType;
    maleWorkers: number;
    femaleWorkers: number;
    estimatedHours: number;
    needsMaterials: boolean;
    materialsMode?: 'auto' | 'manual';
    packingItems?: Array<{
      itemName: string;
      quantity: number;
    }>;
    packingProducts?: Array<{
      productId: string;
      quantity: number;
    }>;
  };
  customerNote?: string;
  discountCode?: string;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  driverId?: string;
  finalPrice?: number;
  adminNote?: string;
  driverNote?: string;
}

export interface AssignDriverRequest {
  orderId: string;
  driverId: string;
  commission: number;
  note?: string;
}

export interface OrderListQuery {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
  customerId?: string;
  driverId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface CalculatePriceRequest {
  serviceCategoryId: string;
  distanceKm: number;
  vehicleType: VehicleType;
  workerCount: number;
  originFloor: number;
  originHasElevator: boolean;
  destinationFloor: number;
  destinationHasElevator: boolean;
  walkDistanceMeters: number;
  stopCount: number;
  items: Array<{
    catalogItemId: string;
    quantity: number;
  }>;
  packingService?: {
    type: PackingType;
    maleWorkers: number;
    femaleWorkers: number;
    estimatedHours: number;
    needsMaterials: boolean;
    packingProducts?: Array<{
      productId: string;
      quantity: number;
    }>;
  };
  discountCode?: string;
}

export interface PriceCalculationResponse {
  estimatedPrice: number;
  breakdown: Array<{
    label: string;
    quantity?: number;
    unitPrice: number;
    totalPrice: number;
    description?: string;
  }>;
  discount?: {
    code: string;
    amount: number;
    type: 'PERCENTAGE' | 'FIXED';
  };
}

// ============================================
// USER DTOs
// ============================================

export interface UserListQuery {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  role?: string;
  isActive?: boolean;
}

export interface LoginRequest {
  phoneNumber: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
}

export interface CreateDriverRequest {
  phoneNumber: string;
  fullName: string;
  nationalId: string;
  dateOfBirth: string;
  address: string;
  licensePlate: string;
  vehicleType: VehicleType;
  vehicleModel: string;
  vehicleColor: string;
  vehicleYear: number;
  availableWorkers: number;
  driverLicenseNumber: string;
  driverLicenseExpiry: string;
  sheba: string;
  commissionPercentage: number;
  priority: number;
}

export interface UpdateDriverRequest {
  fullName?: string;
  nationalId?: string;
  dateOfBirth?: string;
  address?: string;
  licensePlate?: string;
  vehicleType?: VehicleType;
  vehicleModel?: string;
  vehicleColor?: string;
  vehicleYear?: number;
  availableWorkers?: number;
  driverLicenseNumber?: string;
  driverLicenseExpiry?: string;
  sheba?: string;
  commissionPercentage?: number;
  priority?: number;
  isActive?: boolean;
  documentsVerified?: boolean;
  adminNote?: string;
}

export interface DriverListQuery {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  isOnline?: boolean;
  vehicleType?: VehicleType;
  search?: string;
}

// ============================================
// ADDRESS DTOs
// ============================================

export interface CreateAddressRequest {
  title: string;
  fullAddress: string;
  lat: number;
  lng: number;
  district: string;
  city: string;
  province: string;
  postalCode?: string;
  details?: string;
}

export interface UpdateAddressRequest {
  title?: string;
  fullAddress?: string;
  lat?: number;
  lng?: number;
  district?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  details?: string;
}

// ============================================
// CATALOG DTOs
// ============================================

export interface CreateCatalogCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  order: number;
}

export interface UpdateCatalogCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  order?: number;
}

export interface CreateCatalogItemRequest {
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;
  unit: string;
  order: number;
  isActive: boolean;
}

export interface UpdateCatalogItemRequest {
  categoryId?: string;
  name?: string;
  description?: string;
  basePrice?: number;
  unit?: string;
  order?: number;
  isActive?: boolean;
}

// ============================================
// SERVICE DTOs
// ============================================

export interface CreateServiceCategoryRequest {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  icon?: string;
  imageUrl?: string;
  basePrice?: number;
  pricePerKm?: number;
  discountPercentage?: number;
  features?: string[];
  order: number;
  isActive: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  adminNote?: string;
}

export interface UpdateServiceCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  icon?: string;
  imageUrl?: string;
  basePrice?: number;
  pricePerKm?: number;
  discountPercentage?: number;
  features?: string[];
  order?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  adminNote?: string;
}

// ============================================
// PACKING PRODUCT DTOs
// ============================================

export interface CreatePackingProductRequest {
  name: string;
  description?: string;
  price: number;
  unit: string;
  image?: string;
  stock: number;
  isActive: boolean;
}

export interface UpdatePackingProductRequest {
  name?: string;
  description?: string;
  price?: number;
  unit?: string;
  image?: string;
  stock?: number;
  isActive?: boolean;
}

// ============================================
// PRICING DTOs
// ============================================

export interface UpdatePricingConfigRequest {
  name?: string;
  baseWorkerRate?: number;
  pickupRate?: number;
  nissanRate?: number;
  truckRate?: number;
  heavyTruckRate?: number;
  perKmRate?: number;
  perFloorRate?: number;
  walkingDistance0to10Rate?: number;
  walkingDistance10to30Rate?: number;
  walkingDistance30PlusRate?: number;
  stopRate?: number;
  packingHourlyRate?: number;
  cancellationFee?: number;
  expertVisitFee?: number;
  isActive?: boolean;
}

// ============================================
// DISCOUNT CODE DTOs
// ============================================

export interface CreateDiscountCodeRequest {
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  perUserLimit?: number;
  isActive: boolean;
}

export interface UpdateDiscountCodeRequest {
  code?: string;
  type?: 'PERCENTAGE' | 'FIXED';
  value?: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  perUserLimit?: number;
  isActive?: boolean;
}

export interface ValidateDiscountCodeRequest {
  code: string;
  orderAmount: number;
}

export interface ValidateDiscountCodeResponse {
  valid: boolean;
  discount?: {
    code: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    discountAmount: number;
  };
  message?: string;
}

// ============================================
// PAYMENT DTOs
// ============================================

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  method: PaymentMethod;
}

export interface PaymentCallbackRequest {
  authority: string;
  status: string;
}

// ============================================
// LOCATION TRACKING DTOs
// ============================================

export interface LocationUpdateDto {
  orderId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
}

// ============================================
// RATING DTOs
// ============================================

export interface RateOrderRequest {
  orderId: string;
  rating: number;
  review?: string;
}

// ============================================
// NOTIFICATION DTOs
// ============================================

export interface NotificationListQuery {
  page?: number;
  pageSize?: number;
  isRead?: boolean;
}

export interface MarkNotificationReadRequest {
  notificationId: string;
}

// ============================================
// STATISTICS DTOs
// ============================================

export interface DateRangeQuery {
  dateFrom?: string;
  dateTo?: string;
}

export type DashboardStatsResponse = DashboardStats;
export type DriverStatsResponse = DriverStats;
export type CustomerStatsResponse = CustomerStats;

// ============================================
// FILE UPLOAD DTOs
// ============================================

export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
}