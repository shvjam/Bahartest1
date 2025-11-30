// ============================================
// ENUMS
// ============================================

export enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
}

export enum OrderStatus {
  DRAFT = 'DRAFT', // در حال ساخت
  PENDING = 'PENDING', // در انتظار بررسی
  REVIEWING = 'REVIEWING', // در حال بررسی
  CONFIRMED = 'CONFIRMED', // تایید شده
  DRIVER_ASSIGNED = 'DRIVER_ASSIGNED', // راننده مشخص شد
  DRIVER_EN_ROUTE_TO_ORIGIN = 'DRIVER_EN_ROUTE_TO_ORIGIN', // راننده در حال اعزام به مبدا
  PACKING_IN_PROGRESS = 'PACKING_IN_PROGRESS', // بسته‌بندی در حال انجام
  LOADING_IN_PROGRESS = 'LOADING_IN_PROGRESS', // بارگیری در حال انجام
  IN_TRANSIT = 'IN_TRANSIT', // در حال حمل
  IN_PROGRESS = 'IN_PROGRESS', // در حال انجام (alias for IN_TRANSIT)
  ARRIVED_AT_DESTINATION = 'ARRIVED_AT_DESTINATION', // در مقصد
  COMPLETED = 'COMPLETED', // تکمیل شده
  CANCELLED = 'CANCELLED', // لغو شده
}

export enum VehicleType {
  PICKUP = 'PICKUP', // وانت
  NISSAN = 'NISSAN', // نیسان
  TRUCK = 'TRUCK', // کامیون
  HEAVY_TRUCK = 'HEAVY_TRUCK', // خاور
}

export enum PackingType {
  FULL = 'FULL', // بسته‌بندی تمام لوازم منزل
  LARGE_ITEMS = 'LARGE_ITEMS', // لوازم بزرگ
  SMALL_ITEMS = 'SMALL_ITEMS', // خرده‌ریزها
  OFFICE = 'OFFICE', // لوازم اداری
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  ONLINE = 'ONLINE',
  CASH = 'CASH',
  WALLET = 'WALLET',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum DriverStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE',
}

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  phoneNumber: string;
  fullName?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Customer extends User {
  role: UserRole.CUSTOMER;
  addresses: Address[];
  orders: Order[];
}

export interface Driver extends User {
  role: UserRole.DRIVER;
  nationalId?: string; // کد ملی
  dateOfBirth?: Date;
  address?: string;
  
  // وسیله نقلیه
  licensePlate: string;
  vehicleType: VehicleType;
  vehicleModel?: string;
  vehicleColor?: string;
  vehicleYear?: number;
  availableWorkers: number; // تعداد کارگر همراه
  
  // مدارک
  driverLicenseNumber?: string;
  driverLicenseExpiry?: Date;
  driverLicenseImage?: string;
  vehicleCardImage?: string;
  insuranceImage?: string;
  profileImage?: string;
  documentsVerified: boolean;
  verifiedAt?: Date;
  
  // آمار و وضعیت
  rating: number;
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalEarnings: number;
  currentLocation?: {
    latitude: number;
    longitude: number;
    lat?: number; // Alias
    lng?: number; // Alias
    lastUpdate: Date;
  };
  isActive: boolean;
  isAvailable: boolean;
  isOnline?: boolean; // وضعیت آنلاین بودن
  bankAccountNumber?: string;
  sheba?: string; // شماره شبا
  commissionPercentage?: number; // درصد کمیسیون
  priority?: number; // اولویت راننده
  adminNote?: string; // یادداشت ادمین
  assignments?: DriverAssignment[];
}

// ============================================
// ADDRESS
// ============================================

export interface Address {
  id: string;
  userId?: string;
  title?: string; // مثال: منزل، محل کار
  fullAddress: string;
  city: string;
  district?: string;
  street?: string;
  alley?: string;
  building?: string;
  unit?: string;
  floor?: number;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  lat?: number; // Alias برای سازگاری
  lng?: number; // Alias برای سازگاری
  phoneNumber?: string;
  recipientName?: string;
  recipientPhone?: string;
  province: string;
  details?: string; // توضیحات تکمیلی
  createdAt: Date;
}

// ============================================
// SERVICE CATEGORIES
// ============================================

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  icon?: string;
  imageUrl?: string;
  
  // قیمت‌گذاری
  basePrice?: number;
  pricePerKm?: number;
  discountPercentage?: number;
  
  // ویژگی‌ها
  features?: string[];
  
  // تنظیمات
  isActive: boolean;
  isFeatured?: boolean;
  order: number; // ترتیب نمایش
  minPrice?: number;
  maxPrice?: number;
  
  // آمار (فقط برای نمایش در پنل ادمین)
  totalOrders?: number;
  completedOrders?: number;
  totalRevenue?: number;
  averageRating?: number;
  
  // تاریخ
  createdAt?: Date;
  updatedAt?: Date;
  adminNote?: string;
}

// ============================================
// CATALOG (برای اقلام قابل انتخاب)
// ============================================

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export interface CatalogItem {
  id: string;
  categoryId: string;
  category?: CatalogCategory;
  name: string;
  description?: string;
  basePrice: number;
  unit?: string; // واحد (عدد، کیلوگرم، متر و...)
  image?: string;
  isHeavy?: boolean;
  requiresSpecialHandling?: boolean;
  order: number;
  isActive: boolean;
}

// ============================================
// ORDER
// ============================================

export interface Order {
  id: string;
  customerId?: string; // null برای مهمان
  customerPhone: string;
  customerName?: string;
  serviceCategoryId: string;
  driverId?: string;
  status: OrderStatus;
  
  // زمان‌بندی
  preferredDateTime: Date;
  createdAt: Date;
  confirmedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  
  // قیمت
  estimatedPrice: number;
  finalPrice?: number;
  discountCode?: string;
  discountAmount?: number;
  
  // جزئیات سفارش
  details: OrderDetails;
  
  // آیتم‌های سفارش
  items: OrderItem[];
  
  // بسته‌بندی
  packingService?: PackingService;
  
  // جزئیات مکانی
  locationDetails: LocationDetails;
  
  // آدرس‌ها
  originAddress: Address;
  destinationAddress: Address;
  stops?: Address[]; // توقف‌ها
  
  // فاصله و زمان
  distanceKm: number;
  estimatedDuration: number; // دقیقه
  
  // تخصیص راننده
  driverAssignment?: DriverAssignment;
  
  // پرداخت
  payment?: Payment;
  
  // یادداشت‌ها
  customerNote?: string;
  adminNote?: string;
  driverNote?: string;
  
  // امتیاز
  rating?: number;
  review?: string;
  
  // لغو
  cancellationReason?: string;
  cancellationFee?: number;
}

export interface OrderDetails {
  needsPacking: boolean;
  needsWorkers: boolean;
  workerCount: number;
  vehicleType: VehicleType;
  [key: string]: any; // برای فیلدهای داینامیک
}

export interface OrderItem {
  id: string;
  orderId: string;
  catalogItemId: string;
  catalogItem?: CatalogItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PackingService {
  orderId: string;
  type: PackingType;
  maleWorkers: number;
  femaleWorkers: number;
  estimatedHours: number;
  needsMaterials: boolean;
  materialsMode?: 'auto' | 'manual';
  packingItems?: PackingItem[];
  packingProducts?: SelectedPackingProduct[];
}

export interface PackingItem {
  itemName: string;
  quantity: number;
}

export interface LocationDetails {
  orderId: string;
  originFloor: number;
  originHasElevator: boolean;
  originWalkingDistance: number;
  walkDistanceMeters?: number; // Alias برای سازگاری
  destinationFloor: number;
  destinationHasElevator: boolean;
  destinationWalkingDistance: number;
  stopCount: number;
}

export interface DriverAssignment {
  id?: string; // برای سازگاری
  orderId: string;
  driverId: string;
  assignedAt: Date;
  estimatedArrivalTime?: Date;
  actualArrivalTime?: Date;
  autoAssigned: boolean;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  gatewayTransactionId?: string; // برای سازگاری با درگاه
  paidAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
}

// ============================================
// PACKING PRODUCTS
// ============================================

export interface PackingProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  unit: string;
  image?: string;
  stock: number;
  isActive: boolean;
  category?: string;
}

// ============================================
// PRICING CONFIG
// ============================================

export interface PricingConfig {
  id: string;
  name: string;
  
  // نرخ کارگر
  baseWorkerRate: number;
  
  // نرخ خودرو (بر اساس نوع)
  baseVehicleRates: Record<VehicleType, number>;
  
  // نرخ کارگر اضافی بر اساس نوع خودرو
  workerRatesByVehicle: Record<VehicleType, number>;
  
  // نرخ مسافت
  perKmRate: number;
  
  // نرخ طبقه
  perFloorRate: number;
  
  // نرخ مسافت پیاده‌روی
  walkingDistanceRates: Record<number, number>;
  
  // نرخ توقف
  stopRate: number;
  
  // نرخ ساعتی بسته‌بندی
  packingHourlyRate: number;
  
  // جریمه لغو
  cancellationFee: number;
  
  // هزینه کارشناسی
  expertVisitFee: number;
  
  // تخمین هزینه مواد بسته‌بندی (اگر auto باشد)
  packingMaterialsEstimatedCost: number;
  
  // آیا هزینه مواد بسته‌بندی در فاکتور لحاظ شود؟
  includePackingMaterialsInInvoice: boolean;
  
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

// ============================================
// DISCOUNT CODE
// ============================================

export interface DiscountCode {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED'; // درصدی یا مبلغ ثابت
  value: number;
  maxDiscount?: number; // حداکثر تخفیف (برای درصدی)
  minOrderAmount?: number; // حداقل مبلغ سفارش
  startDate?: Date;
  endDate?: Date;
  usageLimit?: number; // تعداد استفاده کل
  usageCount: number; // تعداد استفاده شده
  perUserLimit?: number; // تعداد استفاده هر کاربر
  isActive: boolean;
  createdAt: Date;
}

// ============================================
// FORM STATE (برای فرم ثبت سفارش)
// ============================================

export interface SelectedPackingProduct {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderFormState {
  step: number;
  serviceCategory?: ServiceCategory;
  city?: string;
  needsPacking?: boolean;
  packingType?: PackingType;
  packingItems?: PackingItem[];
  packingWorkerGender?: {
    male: number;
    female: number;
  };
  packingDuration?: number;
  needsPackingMaterials?: boolean;
  packingMaterialsMode?: 'auto' | 'manual';
  selectedPackingProducts?: SelectedPackingProduct[];
  originFloor?: number;
  originHasElevator?: boolean;
  destinationFloor?: number;
  destinationHasElevator?: boolean;
  heavyItems?: OrderItem[];
  walkDistance?: number;
  workerCount?: number;
  vehicleType?: VehicleType; // نوع خودرو انتخابی
  originAddress?: Address;
  destinationAddress?: Address;
  stops?: Address[];
  preferredDateTime?: Date;
  distanceKm?: number;
  estimatedPrice?: number;
  priceBreakdown?: PriceBreakdown[];
}

export interface PriceBreakdown {
  label: string;
  quantity?: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// DASHBOARD STATS
// ============================================

export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalRevenue: number;
  pendingPayments: number;
  activeDrivers: number;
  totalCustomers: number;
  avgRating: number;
}

export interface DriverStats {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  activeOrders?: number;
  totalEarnings: number;
  avgRating: number;
  todayRides: number;
  thisWeekRides: number;
  thisMonthRides: number;
}

export interface CustomerStats {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  savedAddresses?: number; // آدرس‌های ذخیره شده
}

// ============================================
// TICKET SUPPORT TYPES
// ============================================

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string | Date;
  updatedAt?: string | Date;
  unreadMessagesCount?: number;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  message: string;
  isAdminMessage: boolean;
  createdAt: string | Date;
  isRead: boolean;
}

export interface TicketDetail extends Ticket {
  userName: string;
  userPhone: string;
  messages: TicketMessage[];
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  createdAt: string | Date;
  metadata?: Record<string, any>;
}

// ============================================
// LOCATION TRACKING TYPES
// ============================================

export interface LocationUpdate {
  orderId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  speed?: number;
  heading?: number;
}

// ============================================
// ADMIN TYPE
// ============================================

export interface Admin extends User {
  role: UserRole.ADMIN;
  permissions?: string[];
}