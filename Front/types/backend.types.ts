/**
 * Types مطابق با Backend DTOs
 * این فایل دقیقاً با DTOهای Backend همخوانی دارد
 */

// ============================================
// API RESPONSE STRUCTURES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ErrorResponse {
  message: string;
  detail?: string;
  errors?: string[];
  stackTrace?: string;
  statusCode: number;
  timestamp: Date;
}

// ============================================
// AUTH DTOs
// ============================================

export interface SendOtpRequest {
  phoneNumber: string;
}

export interface SendOtpResponse {
  message: string;
  expiresAt: Date;
  otpCode?: string; // فقط در Development
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  otpCode: string;
}

export interface AuthResponse {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: Date;
  refreshTokenExpiry: Date;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ============================================
// USER DTOs
// ============================================

export interface UserDto {
  id: string;
  phoneNumber: string;
  fullName?: string;
  email?: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

export interface UserResponse {
  id: string;
  phoneNumber: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  totalOrders: number;
  completedOrders: number;
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  avatarUrl?: string;
}

export interface CreateAddressRequest {
  title: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  buildingNo?: string;
  unit?: string;
  postalCode?: string;
  description?: string;
  isDefault: boolean;
}

export interface AddressResponse {
  id: string;
  title: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  buildingNo?: string;
  unit?: string;
  postalCode?: string;
  description?: string;
  isDefault: boolean;
  createdAt: Date;
}

// ============================================
// ORDER DTOs
// ============================================

export interface CreateOrderRequest {
  serviceCategoryId: string;
  preferredDateTime: Date;
  originAddress: OrderAddressDto;
  destinationAddress: OrderAddressDto;
  locationDetails: LocationDetailsDto;
  items: OrderItemDto[];
  packingService?: PackingServiceDto;
  discountCode?: string;
  customerNote?: string;
}

export interface OrderAddressDto {
  savedAddressId?: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  buildingNo?: string;
  unit?: string;
  contactName?: string;
  contactPhone?: string;
}

export interface LocationDetailsDto {
  originFloorType: string; // 'GROUND', 'BASEMENT', 'FLOOR'
  originFloorNumber?: number;
  originHasElevator: boolean;
  originHasParking: boolean;
  destinationFloorType: string;
  destinationFloorNumber?: number;
  destinationHasElevator: boolean;
  destinationHasParking: boolean;
  estimatedDistance?: number;
}

export interface OrderItemDto {
  catalogItemId: string;
  quantity: number;
  note?: string;
}

export interface PackingServiceDto {
  isRequested: boolean;
  items: PackingServiceItemDto[];
}

export interface PackingServiceItemDto {
  packingProductId: string;
  quantity: number;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  serviceType: string;
  preferredDateTime: Date;
  createdAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  originAddress: OrderAddressResponse;
  destinationAddress: OrderAddressResponse;
  locationDetails: LocationDetailsResponse;
  items: OrderItemResponse[];
  packingService?: PackingServiceResponse;
  basePrice: number;
  packingPrice: number;
  totalPrice: number;
  discountAmount?: number;
  finalPrice: number;
  userId: string;
  userName?: string;
  userPhone?: string;
  driver?: DriverInfoResponse;
  customerNote?: string;
  adminNote?: string;
}

export interface OrderListItemResponse {
  id: string;
  orderNumber: string;
  status: string;
  serviceType: string;
  serviceCategoryId?: string;
  preferredDateTime: Date;
  createdAt: Date;
  finalPrice: number;
  estimatedPrice?: number;
  userName?: string;
  userPhone?: string;
  customerName?: string;
  customerPhone?: string;
  driverName?: string;
  driverId?: string;
  isPaid: boolean;
  rating?: number;
  originAddress?: OrderAddressResponse;
  destinationAddress?: OrderAddressResponse;
  distanceKm?: number;
  estimatedDuration?: number;
}

export interface OrderAddressResponse {
  fullAddress: string;
  latitude: number;
  longitude: number;
  buildingNo?: string;
  unit?: string;
  contactName?: string;
  contactPhone?: string;
}

export interface LocationDetailsResponse {
  originFloorType: string;
  originFloorNumber?: number;
  originHasElevator: boolean;
  originHasParking: boolean;
  destinationFloorType: string;
  destinationFloorNumber?: number;
  destinationHasElevator: boolean;
  destinationHasParking: boolean;
  estimatedDistance?: number;
}

export interface OrderItemResponse {
  id: string;
  itemName: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  note?: string;
}

export interface PackingServiceResponse {
  id: string;
  totalPrice: number;
  items: PackingItemResponse[];
}

export interface PackingItemResponse {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PriceEstimateResponse {
  basePrice: number;
  packingPrice: number;
  totalPrice: number;
  discountAmount?: number;
  finalPrice: number;
  breakdown: PriceBreakdown;
}

export interface PriceBreakdown {
  distancePrice: number;
  floorPrice: number;
  itemsPrice: number;
  packingPrice: number;
  extraServices: number;
}

// ============================================
// DRIVER DTOs
// ============================================

export interface DriverInfoResponse {
  id: string;
  name: string;
  phoneNumber: string;
  vehicleType: string;
  licensePlate: string;
  rating: number;
  avatarUrl?: string;
}

export interface DriverResponse {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  nationalCode: string;
  avatarUrl?: string;
  profileImage?: string;
  vehicleType: string;
  licensePlate: string;
  driverLicenseNumber: string;
  vehicleModel?: string;
  vehicleColor?: string;
  vehicleYear?: number;
  status: string;
  isActive: boolean;
  isVerified: boolean;
  isOnline?: boolean;
  documentsVerified?: boolean;
  availableWorkers?: number;
  totalRides?: number;
  rating: number;
  totalTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  nationalCardImageUrl?: string;
  driverLicenseImageUrl?: string;
  vehicleLicenseImageUrl?: string;
  vehicleImageUrl?: string;
  createdAt: Date;
  verifiedAt?: Date;
  lastActiveAt?: Date;
}

// ============================================
// SERVICE CATEGORY DTOs
// ============================================

export interface ServiceCategoryResponse {
  id: string;
  name: string;
  description?: string;
  serviceType: string;
  iconUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CreateServiceCategoryRequest {
  name: string;
  description?: string;
  serviceType: string;
  iconUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

// ============================================
// CATALOG DTOs
// ============================================

export interface CatalogCategoryResponse {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  displayOrder: number;
  isActive: boolean;
  itemsCount: number;
}

export interface CatalogItemResponse {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description?: string;
  basePrice: number;
  imageUrl?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface CreateCatalogItemRequest {
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

// ============================================
// PACKING PRODUCT DTOs
// ============================================

export interface PackingProductResponse {
  id: string;
  name: string;
  description?: string;
  unitPrice: number;
  imageUrl?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface CreatePackingProductRequest {
  name: string;
  description?: string;
  unitPrice: number;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

// ============================================
// PRICING CONFIG DTOs
// ============================================

export interface PricingConfigResponse {
  id: string;
  serviceType: string;
  basePrice: number;
  pricePerKm: number;
  pricePerFloor: number;
  isActive: boolean;
  updatedAt: Date;
}

export interface UpdatePricingConfigRequest {
  id: string;
  basePrice: number;
  pricePerKm: number;
  pricePerFloor: number;
  isActive: boolean;
}

// ============================================
// NOTIFICATION DTOs
// ============================================

export interface NotificationResponse {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedEntityId?: string;
}

// ============================================
// DISCOUNT CODE DTOs
// ============================================

export interface DiscountCodeResponse {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  maxUsageCount?: number;
  usedCount: number;
  validFrom?: Date;
  validUntil?: Date;
  isActive: boolean;
}

// ============================================
// DASHBOARD STATS DTOs
// ============================================

export interface DashboardStatsResponse {
  totalOrders: number;
  pendingOrders: number;
  inProgressOrders: number;
  activeOrders?: number;
  completedOrders: number;
  cancelledOrders: number;
  totalUsers: number;
  totalCustomers?: number;
  activeDrivers: number;
  availableDrivers: number;
  todayRevenue: number;
  monthRevenue: number;
  totalRevenue: number;
  avgRating?: number;
  recentOrders: RecentOrderResponse[];
}

export interface RecentOrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  finalPrice: number;
  createdAt: Date;
}

// ============================================
// FILE UPLOAD DTOs
// ============================================

export interface FileUploadResponseDto {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  contentType: string;
}

// ============================================
// PAYMENT DTOs
// ============================================

export interface PaymentRequest {
  orderId: string;
  amount: number;
  description: string;
  mobile?: string;
  email?: string;
}

export interface PaymentRequestResult {
  success: boolean;
  authority?: string;
  paymentUrl?: string;
  errorMessage?: string;
  errorCode?: number;
}

export interface PaymentVerifyResult {
  success: boolean;
  refId?: number;
  errorMessage?: string;
  errorCode?: number;
  amount?: number;
}

// ============================================
// PAGINATION PARAMS
// ============================================

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending: boolean;
}