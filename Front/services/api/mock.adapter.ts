import { mockOrders, mockCustomers, mockDrivers, mockAdmin, mockServiceCategories, mockCatalogCategories, mockCatalogItems, mockPackingProducts } from '../mockData';
import { 
  Order, 
  User, 
  Driver, 
  Customer, 
  ServiceCategory, 
  CatalogCategory, 
  CatalogItem, 
  PackingProduct,
  PaginatedResponse,
  DashboardStats,
  DriverStats,
  CustomerStats,
  Address,
  UserRole,
  OrderStatus,
} from '../../types';
import {
  AuthResponse,
  SendOtpResponse,
  PriceCalculationResponse,
} from './dtos';

// Mock delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAdapter = {
  // Auth
  async sendOtp(phoneNumber: string): Promise<SendOtpResponse> {
    await delay();
    return {
      message: 'کد تایید ارسال شد',
      expiresIn: 120,
    };
  },

  async verifyOtp(phoneNumber: string, otp: string): Promise<AuthResponse> {
    await delay();
    
    if (otp !== '1234') {
      throw new Error('کد تایید اشتباه است');
    }

    let user: User | null = null;

    if (phoneNumber === mockAdmin.phoneNumber) {
      user = mockAdmin;
    } else {
      const customer = mockCustomers.find(c => c.phoneNumber === phoneNumber);
      if (customer) {
        user = customer;
      } else {
        const driver = mockDrivers.find(d => d.phoneNumber === phoneNumber);
        if (driver) {
          user = driver;
        }
      }
    }

    if (!user) {
      user = {
        id: `customer-${Date.now()}`,
        phoneNumber,
        role: UserRole.CUSTOMER,
        createdAt: new Date(),
      };
    }

    return {
      user,
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
  },

  // Orders
  async getOrders(query: any = {}): Promise<PaginatedResponse<Order>> {
    await delay();
    const { page = 1, pageSize = 10 } = query;
    
    let filtered = [...mockOrders];
    
    if (query.status) {
      filtered = filtered.filter(o => o.status === query.status);
    }
    if (query.customerId) {
      filtered = filtered.filter(o => o.customerId === query.customerId);
    }
    if (query.driverId) {
      filtered = filtered.filter(o => o.driverId === query.driverId);
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = filtered.slice(start, end);

    return {
      items,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  },

  async getOrder(id: string): Promise<Order> {
    await delay();
    const order = mockOrders.find(o => o.id === id);
    if (!order) throw new Error('سفارش یافت نشد');
    return order;
  },

  async createOrder(data: any): Promise<Order> {
    await delay(1000);
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      customerId: data.customerId,
      customerPhone: data.customerPhone,
      customerName: data.customerName,
      serviceCategoryId: data.serviceCategoryId,
      status: OrderStatus.PENDING,
      preferredDateTime: new Date(data.preferredDateTime),
      createdAt: new Date(),
      estimatedPrice: data.estimatedPrice || 1500000,
      details: data.details,
      items: data.items || [],
      packingService: data.packingService,
      locationDetails: data.locationDetails,
      originAddress: { ...data.originAddress, id: `addr-${Date.now()}`, userId: data.customerId || '', createdAt: new Date() },
      destinationAddress: { ...data.destinationAddress, id: `addr-${Date.now() + 1}`, userId: data.customerId || '', createdAt: new Date() },
      stops: data.stops || [],
      distanceKm: data.distanceKm || 10,
      estimatedDuration: data.estimatedDuration || 60,
      customerNote: data.customerNote,
    };
    
    mockOrders.unshift(newOrder);
    return newOrder;
  },

  async updateOrder(id: string, data: any): Promise<Order> {
    await delay();
    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) throw new Error('سفارش یافت نشد');
    
    mockOrders[index] = { ...mockOrders[index], ...data };
    return mockOrders[index];
  },

  async calculatePrice(data: any): Promise<PriceCalculationResponse> {
    await delay(800);
    
    // Mock pricing config
    const mockPricingConfig = {
      perKmRate: 15000,
      pickupRate: 1500000,
      nissanRate: 2000000,
      truckRate: 2500000,
      heavyTruckRate: 2660300,
      baseWorkerRate: 200000,
      perFloorRate: 75000,
    };

    const breakdown = [];
    
    // Vehicle base rate
    const vehicleRates = {
      PICKUP: mockPricingConfig.pickupRate,
      NISSAN: mockPricingConfig.nissanRate,
      TRUCK: mockPricingConfig.truckRate,
      HEAVY_TRUCK: mockPricingConfig.heavyTruckRate,
    };
    
    const vehiclePrice = vehicleRates[data.vehicleType as keyof typeof vehicleRates] || mockPricingConfig.pickupRate;
    breakdown.push({ 
      label: 'هزینه پایه خودرو', 
      unitPrice: vehiclePrice, 
      totalPrice: vehiclePrice 
    });

    // Distance
    if (data.distanceKm > 0) {
      const distancePrice = Math.round(data.distanceKm * mockPricingConfig.perKmRate);
      breakdown.push({ 
        label: 'هزینه مسافت', 
        quantity: Math.round(data.distanceKm), 
        unitPrice: mockPricingConfig.perKmRate, 
        totalPrice: distancePrice,
        description: `${Math.round(data.distanceKm)} کیلومتر`
      });
    }

    // Workers
    if (data.workerCount > 0) {
      breakdown.push({ 
        label: 'هزینه کارگر', 
        quantity: data.workerCount, 
        unitPrice: mockPricingConfig.baseWorkerRate, 
        totalPrice: data.workerCount * mockPricingConfig.baseWorkerRate 
      });
    }

    const estimatedPrice = breakdown.reduce((sum, item) => sum + item.totalPrice, 0);

    return {
      estimatedPrice,
      breakdown,
    };
  },

  // Pricing Config
  async getPricingConfig(): Promise<any> {
    await delay();
    return {
      id: 'pricing-1',
      name: 'تعرفه پیش‌فرض',
      baseWorkerRate: 900000,
      baseVehicleRates: {
        PICKUP: 1500000,
        NISSAN: 2000000,
        TRUCK: 2500000,
        HEAVY_TRUCK: 2660300,
      },
      workerRatesByVehicle: {
        PICKUP: 300000,
        NISSAN: 350000,
        TRUCK: 400000,
        HEAVY_TRUCK: 450000,
      },
      perKmRate: 15000,
      perFloorWithElevatorRate: 30000,
      perFloorWithoutElevatorRate: 75000,
      perFloorRate: 75000, // Deprecated - برای سازگاری
      walkingDistanceRates: {
        0: 0,
        20: 200000,
        35: 350000,
        40: 400000,
        50: 500000,
        65: 800000,
      },
      stopRate: 250000,
      packingHourlyRate: 200000,
      cancellationFee: 250000,
      expertVisitFee: 250000,
      packingMaterialsEstimatedCost: 500000,
      includePackingMaterialsInInvoice: true,
      isActive: true,
    };
  },

  // Users
  async getProfile(): Promise<User> {
    await delay();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    throw new Error('کاربر یافت نشد');
  },

  async getCustomers(query: any = {}): Promise<PaginatedResponse<Customer>> {
    await delay();
    const { page = 1, pageSize = 10 } = query;
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = mockCustomers.slice(start, end);

    return {
      items,
      total: mockCustomers.length,
      page,
      pageSize,
      totalPages: Math.ceil(mockCustomers.length / pageSize),
    };
  },

  async getDrivers(query: any = {}): Promise<PaginatedResponse<Driver>> {
    await delay();
    const { page = 1, pageSize = 10 } = query;
    
    let filtered = [...mockDrivers];
    
    if (query.isActive !== undefined) {
      filtered = filtered.filter(d => d.isActive === query.isActive);
    }
    if (query.vehicleType) {
      filtered = filtered.filter(d => d.vehicleType === query.vehicleType);
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = filtered.slice(start, end);

    return {
      items,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  },

  // Services
  async getServiceCategories(): Promise<ServiceCategory[]> {
    await delay();
    // از localStorage بخوانیم، اگر وجود نداشت از mockServiceCategories استفاده کنیم
    const stored = localStorage.getItem('services');
    if (stored) {
      return JSON.parse(stored);
    }
    // ذخیره در localStorage برای بار اول
    localStorage.setItem('services', JSON.stringify(mockServiceCategories));
    return mockServiceCategories;
  },

  async getServiceCategory(id: string): Promise<ServiceCategory> {
    await delay();
    const services = await this.getServiceCategories();
    const service = services.find(s => s.id === id);
    if (!service) throw new Error('خدمت یافت نشد');
    return service;
  },

  async getServiceCategoryBySlug(slug: string): Promise<ServiceCategory> {
    await delay();
    const services = await this.getServiceCategories();
    const service = services.find(s => s.slug === slug);
    if (!service) throw new Error('خدمت یافت نشد');
    return service;
  },

  async createServiceCategory(data: any): Promise<ServiceCategory> {
    await delay();
    const services = await this.getServiceCategories();
    const newService: ServiceCategory = {
      id: `service-${Date.now()}`,
      ...data,
      totalOrders: 0,
      completedOrders: 0,
      totalRevenue: 0,
      averageRating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updated = [...services, newService];
    localStorage.setItem('services', JSON.stringify(updated));
    return newService;
  },

  async updateServiceCategory(id: string, data: any): Promise<ServiceCategory> {
    await delay();
    const services = await this.getServiceCategories();
    const index = services.findIndex(s => s.id === id);
    if (index === -1) throw new Error('خدمت یافت نشد');
    
    const updated = services.map(s => 
      s.id === id 
        ? { ...s, ...data, updatedAt: new Date() }
        : s
    );
    localStorage.setItem('services', JSON.stringify(updated));
    return updated[index];
  },

  async deleteServiceCategory(id: string): Promise<void> {
    await delay();
    const services = await this.getServiceCategories();
    const updated = services.filter(s => s.id !== id);
    localStorage.setItem('services', JSON.stringify(updated));
  },

  async toggleServiceStatus(id: string): Promise<ServiceCategory> {
    await delay();
    const services = await this.getServiceCategories();
    const service = services.find(s => s.id === id);
    if (!service) throw new Error('خدمت یافت نشد');
    
    const updated = services.map(s => 
      s.id === id 
        ? { ...s, isActive: !s.isActive, updatedAt: new Date() }
        : s
    );
    localStorage.setItem('services', JSON.stringify(updated));
    return updated.find(s => s.id === id)!;
  },

  async toggleServiceFeatured(id: string): Promise<ServiceCategory> {
    await delay();
    const services = await this.getServiceCategories();
    const service = services.find(s => s.id === id);
    if (!service) throw new Error('خدمت یافت نشد');
    
    const updated = services.map(s => 
      s.id === id 
        ? { ...s, isFeatured: !s.isFeatured, updatedAt: new Date() }
        : s
    );
    localStorage.setItem('services', JSON.stringify(updated));
    return updated.find(s => s.id === id)!;
  },

  // Catalog
  async getCatalogCategories(): Promise<CatalogCategory[]> {
    await delay();
    return mockCatalogCategories;
  },

  async getCatalogItems(): Promise<CatalogItem[]> {
    await delay();
    return mockCatalogItems;
  },

  // Packing Products
  async getPackingProducts(): Promise<PackingProduct[]> {
    await delay();
    return mockPackingProducts;
  },

  // Stats
  async getDashboardStats(): Promise<DashboardStats> {
    await delay();
    return {
      totalOrders: mockOrders.length,
      activeOrders: mockOrders.filter(o => [OrderStatus.CONFIRMED, OrderStatus.IN_TRANSIT, OrderStatus.DRIVER_ASSIGNED].includes(o.status)).length,
      completedOrders: mockOrders.filter(o => o.status === OrderStatus.COMPLETED).length,
      totalRevenue: 125000000,
      pendingPayments: 15000000,
      activeDrivers: mockDrivers.filter(d => d.isActive).length,
      totalCustomers: mockCustomers.length,
      avgRating: 4.5,
    };
  },

  async getDriverStats(driverId: string): Promise<DriverStats> {
    await delay();
    const driver = mockDrivers.find(d => d.id === driverId);
    if (!driver) throw new Error('راننده یافت نشد');
    
    return {
      totalRides: driver.totalRides,
      completedRides: driver.completedRides,
      cancelledRides: driver.cancelledRides || 0,
      totalEarnings: driver.totalEarnings,
      avgRating: driver.rating,
      activeOrders: mockOrders.filter(o => o.driverId === driverId && o.status !== OrderStatus.COMPLETED && o.status !== OrderStatus.CANCELLED).length,
      todayRides: 0,
      thisWeekRides: 0,
      thisMonthRides: 0,
    };
  },

  async getCustomerStats(customerId: string): Promise<CustomerStats> {
    await delay();
    const customerOrders = mockOrders.filter(o => o.customerId === customerId);
    
    return {
      totalOrders: customerOrders.length,
      completedOrders: customerOrders.filter(o => o.status === OrderStatus.COMPLETED).length,
      cancelledOrders: customerOrders.filter(o => o.status === OrderStatus.CANCELLED).length,
      totalSpent: customerOrders.reduce((sum, o) => sum + (o.finalPrice || 0), 0),
      avgOrderValue: customerOrders.length > 0 ? customerOrders.reduce((sum, o) => sum + (o.finalPrice || 0), 0) / customerOrders.length : 0,
      savedAddresses: 0,
    };
  },

  // Addresses
  async getAddresses(): Promise<Address[]> {
    await delay();
    return [];
  },

  async createAddress(data: any): Promise<Address> {
    await delay();
    return {
      ...data,
      id: `addr-${Date.now()}`,
      userId: 'current-user',
      createdAt: new Date(),
    };
  },

  // Generic CRUD operations
  async create<T>(entity: T): Promise<T> {
    await delay();
    return entity;
  },

  async update<T>(id: string, data: Partial<T>): Promise<T> {
    await delay();
    return data as T;
  },

  async delete(id: string): Promise<void> {
    await delay();
  },

  // Tickets
  async getTickets(params?: any) {
    await delay();
    const mockTickets = [
      {
        id: 't1',
        userId: 'c1',
        subject: 'سوال درباره هزینه اضافی طبقات',
        priority: 'MEDIUM',
        status: 'OPEN',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        unreadMessagesCount: 1,
        lastMessage: {
          id: 'm1',
          ticketId: 't1',
          senderId: 'admin1',
          senderName: 'پشتیبانی',
          message: 'سلام، به زودی پاسخ می‌دهیم',
          isAdminMessage: true,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          isRead: false,
        },
      },
      {
        id: 't2',
        userId: 'c1',
        subject: 'مشکل در پرداخت',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        unreadMessagesCount: 0,
        assignedToAdminName: 'علی احمدی',
      },
    ];

    return {
      items: mockTickets,
      total: mockTickets.length,
      page: params?.pageNumber || 1,
      pageSize: params?.pageSize || 10,
      totalPages: 1,
    };
  },

  async getTicketById(ticketId: string) {
    await delay();
    return {
      id: ticketId,
      userId: 'c1',
      userName: 'مریم احمدی',
      userPhone: '09123456789',
      subject: 'سوال درباره هزینه اضافی طبقات',
      priority: 'MEDIUM',
      status: 'OPEN',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      messages: [
        {
          id: 'm1',
          ticketId: ticketId,
          senderId: 'c1',
          senderName: 'مریم احمدی',
          message: 'سلام، می‌خواستم بدونم هزینه طبقات چطور محاسبه میشه؟',
          isAdminMessage: false,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
        {
          id: 'm2',
          ticketId: ticketId,
          senderId: 'admin1',
          senderName: 'پشتیبانی',
          message: 'سلام وقت بخیر. هزینه طبقات به صورت زیر محاسبه می‌شود:\n\n✅ با آسانسور: 50,000 تومان\n✅ بدون آسانسور: 80,000 تومان',
          isAdminMessage: true,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          isRead: false,
        },
      ],
    };
  },

  async createTicket(data: any) {
    await delay();
    const newTicket = {
      id: `t${Date.now()}`,
      userId: 'c1',
      subject: data.subject,
      priority: data.priority,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      unreadMessagesCount: 0,
    };
    return newTicket;
  },

  async sendTicketMessage(data: any) {
    await delay();
    return {
      id: `m${Date.now()}`,
      ticketId: data.ticketId,
      senderId: 'c1',
      senderName: 'مریم احمدی',
      message: data.message,
      isAdminMessage: false,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
  },

  async updateTicketStatus(ticketId: string, status: string) {
    await delay();
  },

  async assignTicket(ticketId: string, adminId: string) {
    await delay();
  },

  async getUnreadTicketCount() {
    await delay();
    return 2;
  },
};