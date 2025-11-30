import { VehicleType, PackingType, OrderStatus } from '../types';

// ============================================
// SERVICE CATEGORIES
// ============================================

export const SERVICE_CATEGORIES = [
  {
    id: 'moving-service',
    name: 'اسباب‌کشی سریع، مطمئن و آسان',
    slug: 'moving-service',
    description: 'خدمات اسباب‌کشی حرفه‌ای با بهترین کیفیت',
    icon: '🚚',
  },
  {
    id: 'worker-service',
    name: 'کارگر',
    slug: 'worker-service',
    description: 'خدمات کارگر برای جابجایی و بارگیری',
    icon: '👷',
  },
  {
    id: 'packing-worker',
    name: 'بسته‌بند یا فنی یا کارگر حمل خالی',
    slug: 'packing-worker',
    description: 'خدمات بسته‌بندی و کارگر تخصصی',
    icon: '📦',
  },
  {
    id: 'packing-products',
    name: 'محصولات بسته‌بندی',
    slug: 'packing-products',
    description: 'فروش لوازم و محصولات بسته‌بندی',
    icon: '🛒',
  },
  {
    id: 'warehouse',
    name: 'انبار',
    slug: 'warehouse',
    description: 'خدمات اجاره انبار و نگهداری اثاثیه',
    icon: '🏢',
  },
  {
    id: 'small-cargo',
    name: 'خرده‌بار',
    slug: 'small-cargo',
    description: 'حمل بارهای خرده و کوچک',
    icon: '📦',
  },
  {
    id: 'single-item',
    name: 'یک یا دو قلم جنس بیشتر ندارم',
    slug: 'single-item',
    description: 'حمل یک یا دو قطعه اثاثیه',
    icon: '📦',
  },
];

// ============================================
// VEHICLE TYPES
// ============================================

export const VEHICLE_TYPES = [
  {
    value: VehicleType.PICKUP,
    label: 'وانت',
    icon: '🚙',
    capacity: '500 کیلوگرم',
  },
  {
    value: VehicleType.NISSAN,
    label: 'نیسان',
    icon: '🚐',
    capacity: '1.5 تن',
  },
  {
    value: VehicleType.TRUCK,
    label: 'کامیون',
    icon: '🚚',
    capacity: '3 تن',
  },
  {
    value: VehicleType.HEAVY_TRUCK,
    label: 'خاور',
    icon: '🚛',
    capacity: '5 تن',
  },
];

// ============================================
// PACKING TYPES
// ============================================

export const PACKING_TYPES = [
  {
    value: PackingType.FULL,
    label: 'بسته‌بندی تمام لوازم منزل اعم از ریز و درشت',
    description: 'بسته‌بندی کامل تمام وسایل منزل',
  },
  {
    value: PackingType.LARGE_ITEMS,
    label: 'بسته‌بندی لوازم بزرگ منزل (مبلمان، کمد، یخچال و ...)',
    description: 'فقط وسایل بزرگ و حجیم',
  },
  {
    value: PackingType.SMALL_ITEMS,
    label: 'بسته‌بندی خرده‌ریزهای منزل (ظروف، کتاب، لباس و ...)',
    description: 'فقط وسایل کوچک و ریز',
  },
  {
    value: PackingType.OFFICE,
    label: 'بسته‌بندی لوازم اداری و تجاری',
    description: 'تجهیزات اداری و شرکتی',
  },
];

// ============================================
// PACKING ITEMS
// ============================================

export const PACKING_ITEMS = {
  [PackingType.FULL]: [
    { id: 'full-1', name: 'یخچال، فریزر، لباس شویی، ظرف شویی، اجاق گاز', category: 'لوازم آشپزخانه' },
    { id: 'full-2', name: 'ست مبلمان، میز نهارخوری، سرویس خواب', category: 'مبلمان' },
    { id: 'full-3', name: 'بوفه، کمد، کنسول، کتابخانه، دراور', category: 'کمد و قفسه' },
    { id: 'full-4', name: 'میز تلویزیون، تحریر، وسط مبلی و عسلی، صندلی، مبل تک', category: 'میز و صندلی' },
    { id: 'full-5', name: 'فر توکار، مایکروویو، تلویزیون، سیستم صوتی', category: 'لوازم الکترونیک' },
    { id: 'full-6', name: 'شیشه روی میز، آینه قدی، تابلو و تابلو فرش', category: 'دکوری' },
    { id: 'full-7', name: 'لباس، کیف و کفش', category: 'پوشاک' },
    { id: 'full-8', name: 'ظروف و لوازم برقی کوچک آشپزخانه', category: 'ظروف' },
    { id: 'full-9', name: 'مواد غذایی، مواد شوینده و بهداشتی', category: 'مواد مصرفی' },
    { id: 'full-10', name: 'کتاب', category: 'کتاب' },
  ],
  [PackingType.LARGE_ITEMS]: [
    { id: 'large-1', name: 'یخچال، فریزر، لباس شویی، ظرف شویی، اجاق گاز', category: 'لوازم آشپزخانه' },
    { id: 'large-2', name: 'ست مبلمان، میز نهارخوری، سرویس خواب', category: 'مبلمان' },
    { id: 'large-3', name: 'بوفه، کمد، کنسول، کتابخانه، دراور', category: 'کمد و قفسه' },
    { id: 'large-4', name: 'میز تلویزیون، تحریر، وسط مبلی و عسلی، صندلی، مبل تک', category: 'میز و صندلی' },
    { id: 'large-5', name: 'فر توکار، مایکروویو، تلویزیون، سیستم صوتی', category: 'لوازم الکترونیک' },
    { id: 'large-6', name: 'شیشه روی میز، آینه قدی، تابلو و تابلو فرش', category: 'دکوری' },
  ],
  [PackingType.SMALL_ITEMS]: [
    { id: 'small-1', name: 'لباس، کیف و کفش', category: 'پوشاک' },
    { id: 'small-2', name: 'ظروف و لوازم برقی کوچک آشپزخانه', category: 'ظروف' },
    { id: 'small-3', name: 'مواد غذایی، مواد شوینده و بهداشتی', category: 'مواد مصرفی' },
    { id: 'small-4', name: 'کتاب', category: 'کتاب' },
    { id: 'small-5', name: 'سایر', category: 'سایر' },
  ],
  [PackingType.OFFICE]: [
    { id: 'office-1', name: 'کامپیوتر و تجهیزات جانبی', category: 'کامپیوتر' },
    { id: 'office-2', name: 'میز و صندلی اداری', category: 'مبلمان اداری' },
    { id: 'office-3', name: 'کمد و قفسه بایگانی', category: 'بایگانی' },
    { id: 'office-4', name: 'پرینتر، اسکنر، فکس', category: 'ماشین‌آلات' },
    { id: 'office-5', name: 'لوازم التحریر و بایگانی', category: 'لوازم التحریر' },
  ],
};

// ============================================
// HEAVY ITEMS (اقلام سنگین)
// ============================================

export const HEAVY_ITEMS = [
  {
    id: 'heavy-1',
    name: 'یخچال ساید بای ساید، دوقلو و یا بلندتر از ۱۷۵ سانتی‌متر',
    category: 'لوازم سرمایشی',
    basePrice: 500000,
  },
  {
    id: 'heavy-2',
    name: 'انواع مبل و کاناپه',
    category: 'مبلمان',
    basePrice: 400000,
  },
  {
    id: 'heavy-3',
    name: 'تختخواب شو یا سه نفره',
    category: 'مبلمان',
    basePrice: 350000,
  },
  {
    id: 'heavy-4',
    name: 'میز نهارخوری ۶ نفره به بالا',
    category: 'مبلمان',
    basePrice: 300000,
  },
  {
    id: 'heavy-5',
    name: 'کمد یا بوفه یا کتابخانه با ارتفاع بیش از ۱۸۵ سانتی‌متر',
    category: 'کمد و قفسه',
    basePrice: 450000,
  },
  {
    id: 'heavy-6',
    name: 'انواع کنسول با طول، عرض و ارتفاع بیش‌تر از ۱ متر',
    category: 'مبلمان',
    basePrice: 375000,
  },
  {
    id: 'heavy-7',
    name: 'تردمیل، دوچرخه، الپتیکال و سایر لوازم ورزشی سنگین',
    category: 'ورزشی',
    basePrice: 500000,
  },
  {
    id: 'heavy-8',
    name: 'شیشه ۴ میل ب بالا و بیش از ۱ متر طول',
    category: 'دکوری',
    basePrice: 400000,
  },
  {
    id: 'heavy-9',
    name: 'آکواریوم، صندلی ماساژور و صندلی آرایشگاه و سالن زیبایی',
    category: 'تخصصی',
    basePrice: 450000,
  },
  {
    id: 'heavy-10',
    name: 'پیانو',
    category: 'موسیقی',
    basePrice: 750000,
  },
  {
    id: 'heavy-11',
    name: 'گاوصندوق تا ۱۲۰ کیلوگرم',
    category: 'گاوصندوق',
    basePrice: 400000,
  },
  {
    id: 'heavy-12',
    name: 'گاوصندوق بین ۱۲۵ تا ۲۵۵ کیلوگرم',
    category: 'گاوصندوق',
    basePrice: 600000,
  },
  {
    id: 'heavy-13',
    name: 'سایر وسایل بالای ۱۰۵ کیلوگرم',
    category: 'سایر',
    basePrice: 350000,
  },
];

// ============================================
// FLOOR OPTIONS
// ============================================

export const FLOOR_OPTIONS = [
  { value: 1, label: 'طبقه ۱' },
  { value: 2, label: 'طبقه ۲' },
  { value: 3, label: 'طبقه ۳' },
  { value: 4, label: 'طبقه ۴' },
  { value: 5, label: 'طبقه ۵' },
  { value: 6, label: 'طبقه ۶' },
  { value: 7, label: 'طبقه ۷' },
  { value: 8, label: 'طبقه ۸' },
  { value: 9, label: 'بالاتر از ۸' },
];

// ============================================
// WALKING DISTANCE OPTIONS
// ============================================

export const WALKING_DISTANCE_OPTIONS = [
  { value: 0, label: 'ندارم' },
  { value: 20, label: '۲۰ متر' },
  { value: 35, label: '۳۵ متر' },
  { value: 40, label: '۴۰ متر' },
  { value: 50, label: '۵۰ متر' },
  { value: 65, label: 'بیش از ۶۵ متر' },
];

// ============================================
// WORKER COUNT OPTIONS
// ============================================

export const WORKER_COUNT_OPTIONS = [
  { value: 4, label: '۴ نفر' },
  { value: 5, label: '۵ نفر' },
  { value: 6, label: '۶ نفر' },
  { value: 7, label: '۷ نفر' },
  { value: 8, label: 'بیشتر از ۷ نفر' },
];

// ============================================
// PACKING DURATION OPTIONS
// ============================================

export const PACKING_DURATION_OPTIONS = [
  { value: 1, label: 'کمتر از ۲ ساعت' },
  { value: 2, label: '۲ ساعت' },
  { value: 3, label: '۳ ساعت' },
  { value: 4, label: '۴ ساعت' },
  { value: 5, label: '۵ ساعت' },
  { value: 6, label: '۶ ساعت' },
];

// ============================================
// STOP COUNT OPTIONS
// ============================================

export const STOP_COUNT_OPTIONS = [
  { value: 0, label: 'ندارم' },
  { value: 1, label: '۱ توقف' },
  { value: 2, label: '۲ توقف' },
  { value: 3, label: '۳ توقف' },
  { value: 4, label: 'بیشتر از ۳' },
];

// ============================================
// ORDER STATUS LABELS
// ============================================

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.DRAFT]: 'پیش‌نویس',
  [OrderStatus.PENDING]: 'در انتظار بررسی',
  [OrderStatus.REVIEWING]: 'در حال بررسی',
  [OrderStatus.CONFIRMED]: 'تایید شده',
  [OrderStatus.DRIVER_ASSIGNED]: 'راننده مشخص شد',
  [OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN]: 'راننده در حال اعزام به مبدا',
  [OrderStatus.PACKING_IN_PROGRESS]: 'بسته‌بندی در حال انجام',
  [OrderStatus.LOADING_IN_PROGRESS]: 'بارگیری در حال انجام',
  [OrderStatus.IN_TRANSIT]: 'در حال حمل',
  [OrderStatus.IN_PROGRESS]: 'در حال انجام',
  [OrderStatus.ARRIVED_AT_DESTINATION]: 'در مقصد',
  [OrderStatus.COMPLETED]: 'تکمیل شده',
  [OrderStatus.CANCELLED]: 'لغو شده',
};

// ============================================
// ORDER STATUS COLORS
// ============================================

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.DRAFT]: 'gray',
  [OrderStatus.PENDING]: 'yellow',
  [OrderStatus.REVIEWING]: 'blue',
  [OrderStatus.CONFIRMED]: 'green',
  [OrderStatus.DRIVER_ASSIGNED]: 'green',
  [OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN]: 'blue',
  [OrderStatus.PACKING_IN_PROGRESS]: 'purple',
  [OrderStatus.LOADING_IN_PROGRESS]: 'purple',
  [OrderStatus.IN_TRANSIT]: 'blue',
  [OrderStatus.IN_PROGRESS]: 'blue',
  [OrderStatus.ARRIVED_AT_DESTINATION]: 'green',
  [OrderStatus.COMPLETED]: 'green',
  [OrderStatus.CANCELLED]: 'red',
};

// ============================================
// IRANIAN CITIES
// ============================================

export const IRANIAN_CITIES = [
  'تهران',
  'مشهد',
  'اصفهان',
  'شیراز',
  'تبریز',
  'کرج',
  'قم',
  'اهواز',
  'کرمانشاه',
  'ارومیه',
  'رشت',
  'زاهدان',
  'همدان',
  'کرمان',
  'یزد',
  'اردبیل',
  'بندرعباس',
  'قزوین',
  'زنجان',
  'سنندج',
];

// ============================================
// DEFAULT PRICING CONFIG
// ============================================

export const DEFAULT_PRICING = {
  baseWorkerRate: 900000, // هر کارگر (نرخ پایه عمومی)
  baseVehicleRates: {
    [VehicleType.PICKUP]: 1500000,
    [VehicleType.NISSAN]: 2000000,
    [VehicleType.TRUCK]: 2500000,
    [VehicleType.HEAVY_TRUCK]: 2660300,
  },
  // نرخ هر کارگر اضافی به ازای نوع خودرو (برای کارگرهای بیشتر از حداقل)
  workerRatesByVehicle: {
    [VehicleType.PICKUP]: 300000, // هر کارگر اضافی با وانت
    [VehicleType.NISSAN]: 350000, // هر کارگر اضافی با نیسان
    [VehicleType.TRUCK]: 400000, // هر کارگر اضافی با کامیون
    [VehicleType.HEAVY_TRUCK]: 450000, // هر کارگر اضافی با خاور
  },
  perKmRate: 15000, // هر کیلومتر
  perFloorRate: 75000, // هر طبقه
  walkingDistanceRates: {
    0: 0,
    20: 200000,
    35: 350000,
    40: 400000,
    50: 500000,
    65: 800000,
  },
  stopRate: 250000, // هر توقف
  packingHourlyRate: 200000, // ساعتی بسته‌بندی
  cancellationFee: 250000, // جریمه لغو
  expertVisitFee: 250000, // هزینه کارشناسی
};

// ============================================
// PACKING PRODUCTS
// ============================================

export const PACKING_PRODUCTS_DATA = [
  {
    id: 'pack-1',
    name: 'کارتن کوچک (۳۰×۳۰×۴۰)',
    price: 25000,
    unit: 'عدد',
    description: 'مناسب برای ظروف و وسایل ریز',
  },
  {
    id: 'pack-2',
    name: 'کارتن متوسط (۴۰×۴۰×۵۰)',
    price: 35000,
    unit: 'عدد',
    description: 'مناسب برای لباس و کتاب',
  },
  {
    id: 'pack-3',
    name: 'کارتن بزرگ (۵۰×۵۰×۶۰)',
    price: 45000,
    unit: 'عدد',
    description: 'مناسب برای ملحفه و پتو',
  },
  {
    id: 'pack-4',
    name: 'چسب قهوه‌ای بسته‌بندی',
    price: 15000,
    unit: 'عدد',
    description: 'چسب صنعتی استاندارد',
  },
  {
    id: 'pack-5',
    name: 'پلاستیک حباب‌دار (۱۰ متری)',
    price: 50000,
    unit: 'رول',
    description: 'محافظ وسایل شکستنی',
  },
  {
    id: 'pack-6',
    name: 'پلاستیک استرچ',
    price: 40000,
    unit: 'رول',
    description: 'محافظ مبلمان',
  },
  {
    id: 'pack-7',
    name: 'کاغذ روزنامه (۵ کیلویی)',
    price: 20000,
    unit: 'بسته',
    description: 'برای پر کردن فضای خالی',
  },
  {
    id: 'pack-8',
    name: 'پتو نمدی',
    price: 80000,
    unit: 'عدد',
    description: 'محافظ مبلمان و لوازم',
  },
];

// ============================================
// TIME SLOTS (برای ��نتخاب زمان)
// ============================================

export const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];

// ============================================
// API ENDPOINTS
// ============================================

// Use safe check for import.meta.env
export const API_BASE_URL = (() => {
  if (typeof import.meta !== 'undefined' && typeof (import.meta as any).env !== 'undefined') {
    return (import.meta as any).env.VITE_API_BASE_URL || '/api';
  }
  return '/api';
})();

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  VERIFY_OTP: '/auth/verify-otp',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  
  // Orders
  ORDERS: '/orders',
  ORDER_BY_ID: (id: string) => `/orders/${id}`,
  CREATE_ORDER: '/orders',
  UPDATE_ORDER: (id: string) => `/orders/${id}`,
  CANCEL_ORDER: (id: string) => `/orders/${id}/cancel`,
  
  // Drivers
  DRIVERS: '/drivers',
  DRIVER_BY_ID: (id: string) => `/drivers/${id}`,
  AVAILABLE_DRIVERS: '/drivers/available',
  
  // Addresses
  ADDRESSES: '/addresses',
  ADDRESS_BY_ID: (id: string) => `/addresses/${id}`,
  
  // Payments
  PAYMENT_REQUEST: '/payments/request',
  PAYMENT_VERIFY: '/payments/verify',
  
  // Live Tracking
  LOCATION_UPDATE: '/tracking/location',
  GET_DRIVER_LOCATION: (driverId: string) => `/tracking/driver/${driverId}`,
};