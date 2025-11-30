import { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  User,
  Truck,
  Clock,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  PackageCheck,
  TrendingUp,
  FileText,
  Navigation,
  Star,
  MessageSquare,
  UserCheck,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Plus,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { toast } from 'sonner';
import { Order, OrderStatus, VehicleType, Driver, UserRole } from '../../types';
import { useMemo } from 'react';
import { useDrivers, useOrders } from '@/lib/hooks';



// Vehicle Type Labels (keeping for display purposes)
const vehicleTypeLabels: Record<VehicleType, string> = {
  [VehicleType.PICKUP]: 'وانت',
  [VehicleType.NISSAN]: 'نیسان',
  [VehicleType.TRUCK]: 'کامیون',
  [VehicleType.HEAVY_TRUCK]: 'خاور',
};

// Mock Data for generating test orders
const mockDrivers: Driver[] = [
  {
    id: '1',
    role: UserRole.DRIVER,
    fullName: 'محمد رضایی',
    phoneNumber: '09121234567',
    nationalId: '0012345678',
    licensePlate: '۱۲ الف ۳۴۵ - ۱۴',
    vehicleType: VehicleType.PICKUP,
    vehicleModel: 'زامیاد',
    vehicleColor: 'سفید',
    vehicleYear: 1401,
    rating: 4.8,
    totalRides: 234,
    completedRides: 220,
    cancelledRides: 14,
    totalEarnings: 0,
    isActive: true,
    isAvailable: true,
    isOnline: true,
    documentsVerified: true,
    createdAt: new Date('2024-01-15'),
    verifiedAt: new Date('2024-01-20'),
    availableWorkers: 2,
    driverLicenseNumber: 'DL123456',
    sheba: 'IR123456789012345678901234',
    commissionPercentage: 15,
    priority: 1,
  },
  {
    id: '2',
    role: UserRole.DRIVER,
    fullName: 'علی احمدی',
    phoneNumber: '09129876543',
    nationalId: '0087654321',
    licensePlate: '۲۳ ب ۶۷۸ - ۱۴',
    vehicleType: VehicleType.NISSAN,
    vehicleModel: 'نیسان',
    vehicleColor: 'آبی',
    vehicleYear: 1400,
    rating: 4.6,
    totalRides: 189,
    completedRides: 180,
    cancelledRides: 9,
    totalEarnings: 0,
    isActive: true,
    isAvailable: false,
    isOnline: false,
    documentsVerified: true,
    createdAt: new Date('2024-02-10'),
    verifiedAt: new Date('2024-02-15'),
    availableWorkers: 3,
    driverLicenseNumber: 'DL789012',
    sheba: 'IR987654321098765432109876',
    commissionPercentage: 15,
    priority: 2,
  },
  {
    id: '3',
    role: UserRole.DRIVER,
    fullName: 'حسین کریمی',
    phoneNumber: '09131112233',
    nationalId: '0011223344',
    licensePlate: '۳۴ ج ۹۰۱ - ۱۴',
    vehicleType: VehicleType.TRUCK,
    vehicleModel: 'کامیون ایسوزو',
    vehicleColor: 'قرمز',
    vehicleYear: 1402,
    rating: 4.9,
    totalRides: 312,
    completedRides: 305,
    cancelledRides: 7,
    totalEarnings: 0,
    isActive: true,
    isAvailable: true,
    isOnline: true,
    documentsVerified: true,
    createdAt: new Date('2023-11-05'),
    verifiedAt: new Date('2023-11-10'),
    availableWorkers: 4,
    driverLicenseNumber: 'DL345678',
    sheba: 'IR111222333444555666777888',
    commissionPercentage: 15,
    priority: 1,
  },
];

// Mock Data - سفارشات
const generateMockOrders = (): Order[] => {
  const statuses = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.DRIVER_ASSIGNED,
    OrderStatus.IN_PROGRESS,
    OrderStatus.COMPLETED,
    OrderStatus.CANCELLED,
  ];

  const customers = [
    { name: 'مریم احمدی', phone: '09121111111' },
    { name: 'علی رضایی', phone: '09122222222' },
    { name: 'فاطمه کریمی', phone: '09123333333' },
    { name: 'محمد حسینی', phone: '09124444444' },
    { name: 'زهرا مرادی', phone: '09125555555' },
    { name: 'حسن قاسمی', phone: '09126666666' },
    { name: 'سمیرا نوری', phone: '09127777777' },
    { name: 'رضا صالحی', phone: '09128888888' },
    { name: 'نرگس محمدی', phone: '09129999999' },
    { name: 'امیر تقوی', phone: '09120000000' },
  ];

  const addresses = [
    {
      origin: { title: 'منزل', address: 'تهران، منطقه 5، خیابان آزادی', lat: 35.6892, lng: 51.3890 },
      dest: { title: 'منزل جدید', address: 'تهران، منطقه 3، خیابان انقلاب', lat: 35.7089, lng: 51.4011 },
    },
    {
      origin: { title: 'دفتر', address: 'تهران، منطقه 2، خیابان ولیعصر', lat: 35.7219, lng: 51.4056 },
      dest: { title: 'انبار', address: 'تهران، منطقه 1، خیابان پاسداران', lat: 35.7515, lng: 51.4679 },
    },
    {
      origin: { title: 'فروشگاه', address: 'تهران، منطقه 6، میدان انقلاب', lat: 35.7008, lng: 51.3912 },
      dest: { title: 'خانه', address: 'تهران، منطقه 12، اتوبان تهران-کرج', lat: 35.7219, lng: 51.2456 },
    },
  ];

  const orders: Order[] = [];
  const now = new Date();

  for (let i = 1; i <= 25; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const addressPair = addresses[Math.floor(Math.random() * addresses.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const createdDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const preferredDate = new Date(createdDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);
    const hasDriver = status !== OrderStatus.PENDING && status !== OrderStatus.CANCELLED;
    const isCompleted = status === OrderStatus.COMPLETED;

    const distanceKm = Math.floor(Math.random() * 30) + 5;
    const estimatedPrice = distanceKm * 150000 + Math.floor(Math.random() * 500000);
    const finalPrice = isCompleted ? estimatedPrice + Math.floor(Math.random() * 200000) - 100000 : estimatedPrice;

    orders.push({
      id: i.toString(),
      customerId: `c${i}`,
      customerPhone: customer.phone,
      customerName: customer.name,
      serviceCategoryId: 's1',
      driverId: hasDriver ? mockDrivers[Math.floor(Math.random() * mockDrivers.length)].id : undefined,
      status,
      preferredDateTime: preferredDate,
      createdAt: createdDate,
      completedAt: isCompleted ? new Date(preferredDate.getTime() + Math.random() * 4 * 60 * 60 * 1000) : undefined,
      estimatedPrice,
      finalPrice: isCompleted ? finalPrice : undefined,
      details: {
        needsPacking: Math.random() > 0.5,
        needsWorkers: Math.random() > 0.3,
        workerCount: Math.floor(Math.random() * 4) + 1,
        vehicleType: [VehicleType.PICKUP, VehicleType.NISSAN, VehicleType.TRUCK][
          Math.floor(Math.random() * 3)
        ] as VehicleType,
      },
      items: [],
      locationDetails: {
        orderId: i.toString(),
        originFloor: Math.floor(Math.random() * 5),
        originHasElevator: Math.random() > 0.5,
        destinationFloor: Math.floor(Math.random() * 5),
        destinationHasElevator: Math.random() > 0.5,
        walkDistanceMeters: Math.floor(Math.random() * 20) + 5,
        stopCount: Math.floor(Math.random() * 3),
        originWalkingDistance: Math.floor(Math.random() * 20) + 5,
        destinationWalkingDistance: Math.floor(Math.random() * 20) + 5,
      },
      originAddress: {
        id: `a${i * 2 - 1}`,
        userId: `c${i}`,
        title: addressPair.origin.title,
        fullAddress: addressPair.origin.address,
        lat: addressPair.origin.lat,
        lng: addressPair.origin.lng,
        district: '5',
        city: 'تهران',
        province: 'تهران',
        createdAt: new Date(),
      },
      destinationAddress: {
        id: `a${i * 2}`,
        userId: `c${i}`,
        title: addressPair.dest.title,
        fullAddress: addressPair.dest.address,
        lat: addressPair.dest.lat,
        lng: addressPair.dest.lng,
        district: '3',
        city: 'تهران',
        province: 'تهران',
        createdAt: new Date(),
      },
      distanceKm,
      estimatedDuration: Math.floor(distanceKm * 2.5) + 15,
      rating: isCompleted ? Math.floor(Math.random() * 2) + 4 : undefined,
    });
  }

  return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export default function AdminOrders() {
  // TODO: در نسخه Production، باید OrderListItemResponse[] را به Order[] تبدیل کنیم با یک mapper
  // فعلاً از Mock Data استفاده می‌کنیم
  const mockOrders = generateMockOrders();
  
  // برای compatibilityبا API
  const orders = mockOrders;
  const drivers = mockDrivers;
  const isLoading = false;
  const hasError = null;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [driverFilter, setDriverFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAssignDriverDialogOpen, setIsAssignDriverDialogOpen] = useState(false);
  const [isChangeStatusDialogOpen, setIsChangeStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(OrderStatus.PENDING);
  const [statusNote, setStatusNote] = useState('');

  // Mock API Functions
  const refreshOrders = async () => {
    toast.success('سفارشات به‌روزرسانی شد');
  };

  const refreshDrivers = async () => {
    toast.success('رانندگان به‌روزرسانی شد');
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    toast.success('وضعیت سفارش تغییر کرد');
  };

  const assignDriverAPI = async (orderId: string, driverId: string, note?: string) => {
    toast.success('راننده اختصاص داده شد');
  };

  const deleteOrderAPI = async (orderId: string) => {
    toast.success('سفارش حذف شد');
  };

  // محاسبه آمار
  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((o) => o.status === OrderStatus.PENDING).length,
    confirmed: orders.filter((o) => o.status === OrderStatus.CONFIRMED).length,
    inProgress: orders.filter((o) => o.status === OrderStatus.IN_TRANSIT || o.status === OrderStatus.LOADING_IN_PROGRESS || o.status === OrderStatus.PACKING_IN_PROGRESS).length,
    completed: orders.filter((o) => o.status === OrderStatus.COMPLETED).length,
    cancelled: orders.filter((o) => o.status === OrderStatus.CANCELLED).length,
    revenue: orders
      .filter((o) => o.status === OrderStatus.COMPLETED)
      .reduce((sum, o) => sum + (o.finalPrice || 0), 0),
  }), [orders]);

  // فیلتر کردن سفارشات
  const filteredOrders = useMemo(() => orders.filter((order) => {
    // جستجو
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !order.id.includes(query) &&
        !(order.customerName?.toLowerCase().includes(query)) &&
        !order.customerPhone.includes(query)
      ) {
        return false;
      }
    }

    // فیلتر وضعیت
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }

    // فیلتر راننده
    if (driverFilter === 'assigned' && !order.driverId) {
      return false;
    }
    if (driverFilter === 'unassigned' && order.driverId) {
      return false;
    }

    // فیلتر تاریخ
    if (dateFilter !== 'all') {
      const now = new Date();
      const orderDate = new Date(order.createdAt);
      const diffTime = now.getTime() - orderDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (dateFilter === 'today' && diffDays > 1) return false;
      if (dateFilter === 'week' && diffDays > 7) return false;
      if (dateFilter === 'month' && diffDays > 30) return false;
    }

    return true;
  }), [orders, searchQuery, statusFilter, driverFilter, dateFilter]);

  // توابع کمکی
  const getOrderStatusLabel = (status: OrderStatus) => {
    const labels: Record<OrderStatus, string> = {
      [OrderStatus.DRAFT]: 'پیش‌نویس',
      [OrderStatus.PENDING]: 'در انتظار تایید',
      [OrderStatus.REVIEWING]: 'در حال بررسی',
      [OrderStatus.CONFIRMED]: 'تایید شده',
      [OrderStatus.DRIVER_ASSIGNED]: 'اختصاص داده شده',
      [OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN]: 'در مسیر مبدا',
      [OrderStatus.PACKING_IN_PROGRESS]: 'در حال بسته‌بندی',
      [OrderStatus.LOADING_IN_PROGRESS]: 'در حال بارگیری',
      [OrderStatus.IN_TRANSIT]: 'در حال حمل',
      [OrderStatus.IN_PROGRESS]: 'در حال انجام',
      [OrderStatus.ARRIVED_AT_DESTINATION]: 'رسیده به مقصد',
      [OrderStatus.COMPLETED]: 'تکمیل شده',
      [OrderStatus.CANCELLED]: 'لغو شده',
    };
    return labels[status];
  };

  const getOrderStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      [OrderStatus.DRAFT]: 'bg-gray-100 text-gray-800 border-gray-200',
      [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [OrderStatus.REVIEWING]: 'bg-blue-100 text-blue-800 border-blue-200',
      [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800 border-blue-200',
      [OrderStatus.DRIVER_ASSIGNED]: 'bg-purple-100 text-purple-800 border-purple-200',
      [OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN]: 'bg-orange-100 text-orange-800 border-orange-200',
      [OrderStatus.PACKING_IN_PROGRESS]: 'bg-purple-100 text-purple-800 border-purple-200',
      [OrderStatus.LOADING_IN_PROGRESS]: 'bg-purple-100 text-purple-800 border-purple-200',
      [OrderStatus.IN_TRANSIT]: 'bg-orange-100 text-orange-800 border-orange-200',
      [OrderStatus.IN_PROGRESS]: 'bg-orange-100 text-orange-800 border-orange-200',
      [OrderStatus.ARRIVED_AT_DESTINATION]: 'bg-green-100 text-green-800 border-green-200',
      [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
      [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status];
  };

  const getDriverById = (driverId: string | undefined) => {
    if (!driverId) return null;
    return drivers.find((d) => d.id === driverId);
  };

  // عملیات‌ها
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const handleAssignDriver = (order: Order) => {
    setSelectedOrder(order);
    setSelectedDriverId(order.driverId || '');
    setIsAssignDriverDialogOpen(true);
  };

  const handleChangeStatus = (order: Order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setStatusNote('');
    setIsChangeStatusDialogOpen(true);
  };

  const handleDeleteOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
  };

  const confirmAssignDriver = async () => {
    if (!selectedOrder || !selectedDriverId) return;

    try {
      await assignDriverAPI(selectedOrder.id, selectedDriverId);
      setIsAssignDriverDialogOpen(false);
      setSelectedOrder(null);
      setSelectedDriverId('');
    } catch (error) {
      // Error already handled in hook
    }
  };

  const confirmChangeStatus = async () => {
    if (!selectedOrder) return;

    try {
      await updateOrderStatus(selectedOrder.id, selectedStatus);
      setIsChangeStatusDialogOpen(false);
      setSelectedOrder(null);
      setStatusNote('');
    } catch (error) {
      // Error already handled in hook
    }
  };

  const confirmDeleteOrder = async () => {
    if (!selectedOrder) return;

    try {
      await deleteOrderAPI(selectedOrder.id);
      setIsDeleteDialogOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleExport = () => {
    toast.success('در حال آماده‌سازی فایل اکسل...');
  };

  const handleRefreshAll = async () => {
    await Promise.all([refreshOrders(), refreshDrivers()]);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر */}
      <div className="flex items-center justify-between">
        <div>
          <h1>مدیریت سفارشات</h1>
          <p className="text-muted-foreground">مشاهده و مدیریت تمام سفارشات</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefreshAll} disabled={isLoading}>
            <RefreshCw className={`ml-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            به‌روزرسانی
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="ml-2 h-4 w-4" />
            خروجی اکسل
          </Button>
        </div>
      </div>

      {/* Error Alert */}
{hasError && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      خطا در دریافت اطلاعات از سرور
    </AlertDescription>
  </Alert>
)}

      {/* کارت‌های آماری */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">کل سفارشات</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div>{stats.total}</div>
            <p className="text-xs text-muted-foreground">سفارش ثبت شده</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">در انتظار</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div>{stats.pending}</div>
            <p className="text-xs text-muted-foreground">نیاز به بررسی</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">تایید شده</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div>{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">آماده اختصاص</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">در حال انجام</CardTitle>
            <Truck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div>{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">در مسیر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">تکمیل شده</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div>{stats.completed}</div>
            <p className="text-xs text-muted-foreground">موفق</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">درآمد کل</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{(stats.revenue / 1000000).toFixed(1)}م</div>
            <p className="text-xs text-muted-foreground">میلیون تومان</p>
          </CardContent>
        </Card>
      </div>

      {/* فیلترها و جستجو */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">فیلترها و جستجو</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>جستجو</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="شماره سفارش، نام یا شماره تلفن..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>وضعیت</Label>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value={OrderStatus.PENDING}>در انتظار تایید</SelectItem>
                  <SelectItem value={OrderStatus.CONFIRMED}>تایید شده</SelectItem>
                  <SelectItem value={OrderStatus.DRIVER_ASSIGNED}>اختصاص داده شده</SelectItem>
                  <SelectItem value={OrderStatus.IN_PROGRESS}>در حال انجام</SelectItem>
                  <SelectItem value={OrderStatus.COMPLETED}>تکمیل شده</SelectItem>
                  <SelectItem value={OrderStatus.CANCELLED}>لغو شده</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>راننده</Label>
              <Select value={driverFilter} onValueChange={(value: any) => setDriverFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="assigned">اختصاص داده شده</SelectItem>
                  <SelectItem value="unassigned">بدون راننده</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>تاریخ</Label>
              <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه زمان‌ها</SelectItem>
                  <SelectItem value="today">امروز</SelectItem>
                  <SelectItem value="week">هفته گذشته</SelectItem>
                  <SelectItem value="month">ماه گذشته</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* جدول سفارشات */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>لیست سفارشات ({filteredOrders.length})</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setDriverFilter('all');
                setDateFilter('all');
              }}
            >
              <RefreshCw className="ml-2 h-4 w-4" />
              بازنشانی فیلترها
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">شماره</TableHead>
                  <TableHead className="text-right">مشتری</TableHead>
                  <TableHead className="text-right">مسیر</TableHead>
                  <TableHead className="text-right">راننده</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">تاریخ</TableHead>
                  <TableHead className="text-right">قیمت</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      <div className="flex flex-col items-center justify-center py-12">
                        <FileText className="mb-2 h-12 w-12 text-muted-foreground/50" />
                        <p className="text-muted-foreground">سفارشی یافت نشد</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const driver = getDriverById(order.driverId);
                    return (
                      <TableRow key={order.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">#{order.id}</span>
                            {order.rating && (
                              <div className="flex items-center gap-1 text-xs">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{order.rating}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{order.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{order.customerPhone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] space-y-1 text-xs">
                            <div className="flex items-start gap-1 text-muted-foreground">
                              <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-600" />
                              <span className="line-clamp-1">{order.originAddress.fullAddress}</span>
                            </div>
                            <div className="flex items-start gap-1 text-muted-foreground">
                              <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0 text-red-600" />
                              <span className="line-clamp-1">
                                {order.destinationAddress.fullAddress}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span>{order.distanceKm} کیلومتر</span>
                              <span>•</span>
                              <span>{order.estimatedDuration} دقیقه</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {driver ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={driver.profileImage} />
                                <AvatarFallback className="text-xs">
                                  {driver.fullName?.charAt(0) || 'D'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-xs">
                                <div className="font-medium">{driver.fullName || 'راننده'}</div>
                                <div className="text-muted-foreground">
                                  {vehicleTypeLabels[driver.vehicleType]}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              بدون راننده
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getOrderStatusColor(order.status)} variant="outline">
                            {getOrderStatusLabel(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-xs">
                            <div className="text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                            </div>
                            {order.preferredDateTime && (
                              <div className="text-muted-foreground">
                                {new Date(order.preferredDateTime).toLocaleTimeString('fa-IR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {(order.finalPrice || order.estimatedPrice)?.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">تومان</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                                <Eye className="ml-2 h-4 w-4" />
                                مشاهده جزئیات
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeStatus(order)}>
                                <Edit className="ml-2 h-4 w-4" />
                                تغییر وضعیت
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAssignDriver(order)}>
                                <UserCheck className="ml-2 h-4 w-4" />
                                اختصاص راننده
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteOrder(order)}
                                className="text-red-600"
                              >
                                <Trash2 className="ml-2 h-4 w-4" />
                                حذف سفارش
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* دیالوگ جزئیات سفارش */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto" dir="rtl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  جزئیات سفارش #{selectedOrder.id}
                </DialogTitle>
                <DialogDescription>
                  اطلاعات کامل سفارش و جزئیات انجام آن
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">اطلاعات اصلی</TabsTrigger>
                  <TabsTrigger value="customer">مشتری و راننده</TabsTrigger>
                  <TabsTrigger value="route">مسیر و آدرس</TabsTrigger>
                  <TabsTrigger value="financial">مالی و قیمت</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  {/* وضعیت و تاریخ */}
                  <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">وضعیت سفارش</div>
                        <Badge
                          className={`mt-1 ${getOrderStatusColor(selectedOrder.status)}`}
                          variant="outline"
                        >
                          {getOrderStatusLabel(selectedOrder.status)}
                        </Badge>
                      </div>
                      {selectedOrder.rating && (
                        <>
                          <Separator orientation="vertical" className="h-10" />
                          <div>
                            <div className="text-sm text-muted-foreground">امتیاز</div>
                            <div className="mt-1 flex items-center gap-1">
                              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{selectedOrder.rating}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-muted-foreground">تاریخ ثبت</div>
                      <div className="mt-1">
                        {new Date(selectedOrder.createdAt).toLocaleDateString('fa-IR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* جزئیات خدمات */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      جزئیات خدمات
                    </h4>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground">نوع وسیله نقلیه</div>
                        <div className="mt-1 font-medium">
                          {vehicleTypeLabels[selectedOrder.details.vehicleType]}
                        </div>
                      </div>
                      {selectedOrder.details.needsWorkers && (
                        <div className="rounded-lg border p-4">
                          <div className="text-sm text-muted-foreground">تعداد کارگر</div>
                          <div className="mt-1 font-medium">
                            {selectedOrder.details.workerCount} نفر
                          </div>
                        </div>
                      )}
                      {selectedOrder.details.needsPacking && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                          <div className="text-sm text-blue-600">خدمات بسته‌بندی</div>
                          <div className="mt-1 font-medium text-blue-900">درخواست شده</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* اطلاعات طبقات */}
                  {selectedOrder.locationDetails && (
                    <div>
                      <h4 className="mb-3">جزئیات محل</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3 rounded-lg border p-4">
                          <div className="font-medium">مبدا</div>
                          <div className="grid gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">طبقه:</span>
                              <span>{selectedOrder.locationDetails.originFloor}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">آسانسور:</span>
                              <span>
                                {selectedOrder.locationDetails.originHasElevator ? 'دارد' : 'ندارد'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3 rounded-lg border p-4">
                          <div className="font-medium">مقصد</div>
                          <div className="grid gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">طبقه:</span>
                              <span>{selectedOrder.locationDetails.destinationFloor}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">آسانسور:</span>
                              <span>
                                {selectedOrder.locationDetails.destinationHasElevator
                                  ? 'دارد'
                                  : 'ندارد'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="customer" className="space-y-4">
                  {/* اطلاعات مشتری */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      اطلاعات مشتری
                    </h4>
                    <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">نام مشتری</div>
                        <div className="font-medium">{selectedOrder.customerName}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">شماره تماس</div>
                        <div className="font-medium" dir="ltr">
                          {selectedOrder.customerPhone}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* اطلاعات راننده */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      اطلاعات راننده
                    </h4>
                    {selectedOrder.driverId ? (
                      (() => {
                        const driver = getDriverById(selectedOrder.driverId);
                        return driver ? (
                          <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">نام راننده</div>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={driver.profileImage} />
                                  <AvatarFallback>{driver.fullName?.charAt(0) || 'D'}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{driver.fullName || 'راننده'}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">شماره تماس</div>
                              <div className="font-medium" dir="ltr">
                                {driver.phoneNumber}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">پلاک خودرو</div>
                              <div className="font-medium">{driver.licensePlate}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm text-muted-foreground">امتیاز راننده</div>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{driver.rating}</span>
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                        <UserCheck className="mb-2 h-12 w-12 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">هنوز رانند��ی اختصاص داده نشده</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => {
                            setIsDetailsDialogOpen(false);
                            handleAssignDriver(selectedOrder);
                          }}
                        >
                          <Plus className="ml-2 h-4 w-4" />
                          اختصاص راننده
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="route" className="space-y-4">
                  {/* آدرس‌ها */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      مبدا و مقصد
                    </h4>
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                            <MapPin className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">مبدا</div>
                            <div className="font-medium">{selectedOrder.originAddress.title || 'مبدا'}</div>
                          </div>
                        </div>
                        <p className="mr-10 text-sm text-muted-foreground">
                          {selectedOrder.originAddress.fullAddress}
                        </p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                            <MapPin className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">مقصد</div>
                            <div className="font-medium">
                              {selectedOrder.destinationAddress.title || 'مقصد'}
                            </div>
                          </div>
                        </div>
                        <p className="mr-10 text-sm text-muted-foreground">
                          {selectedOrder.destinationAddress.fullAddress}
                        </p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border bg-muted/50 p-3">
                          <div className="text-sm text-muted-foreground">مسافت</div>
                          <div className="mt-1 flex items-center gap-1">
                            <Navigation className="h-4 w-4 text-primary" />
                            <span className="font-medium">{selectedOrder.distanceKm} کیلومتر</span>
                          </div>
                        </div>
                        <div className="rounded-lg border bg-muted/50 p-3">
                          <div className="text-sm text-muted-foreground">زمان تخمینی</div>
                          <div className="mt-1 flex items-center gap-1">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium">
                              {selectedOrder.estimatedDuration} دقیقه
                            </span>
                          </div>
                        </div>
                        {selectedOrder.locationDetails &&
                          selectedOrder.locationDetails.stopCount > 0 && (
                            <div className="rounded-lg border bg-muted/50 p-3">
                              <div className="text-sm text-muted-foreground">توقف‌های میانی</div>
                              <div className="mt-1 font-medium">
                                {selectedOrder.locationDetails.stopCount} توقف
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                  {/* اطلاعات مالی */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      اطلاعات مالی
                    </h4>
                    <div className="space-y-3 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">قیمت تخمینی اولیه</span>
                        <span className="font-medium">
                          {selectedOrder.estimatedPrice?.toLocaleString()} تومان
                        </span>
                      </div>
                      {selectedOrder.finalPrice && (
                        <>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <span className="font-medium">قیمت نهایی</span>
                            <span className="font-medium text-primary">
                              {selectedOrder.finalPrice.toLocaleString()} تومان
                            </span>
                          </div>
                        </>
                      )}
                      {selectedOrder.finalPrice && selectedOrder.estimatedPrice && (
                        <>
                          <Separator />
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">اختلاف قیمت</span>
                            <span
                              className={
                                selectedOrder.finalPrice - selectedOrder.estimatedPrice > 0
                                  ? 'text-red-600'
                                  : 'text-green-600'
                              }
                            >
                              {(
                                selectedOrder.finalPrice - selectedOrder.estimatedPrice
                              ).toLocaleString()}{' '}
                              تومان
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* زمان‌بندی */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      زمان‌بندی
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground">تاریخ ثبت سفارش</div>
                        <div className="mt-1 font-medium">
                          {new Date(selectedOrder.createdAt).toLocaleDateString('fa-IR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                          {' - '}
                          {new Date(selectedOrder.createdAt).toLocaleTimeString('fa-IR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      {selectedOrder.preferredDateTime && (
                        <div className="rounded-lg border p-4">
                          <div className="text-sm text-muted-foreground">زمان درخواستی</div>
                          <div className="mt-1 font-medium">
                            {new Date(selectedOrder.preferredDateTime).toLocaleDateString('fa-IR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                            {' - '}
                            {new Date(selectedOrder.preferredDateTime).toLocaleTimeString('fa-IR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      )}
                      {selectedOrder.completedAt && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                          <div className="text-sm text-green-600">زمان تکمیل</div>
                          <div className="mt-1 font-medium text-green-900">
                            {new Date(selectedOrder.completedAt).toLocaleDateString('fa-IR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                            {' - '}
                            {new Date(selectedOrder.completedAt).toLocaleTimeString('fa-IR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    handleChangeStatus(selectedOrder);
                  }}
                >
                  <Edit className="ml-2 h-4 w-4" />
                  تغییر وضعیت
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    handleAssignDriver(selectedOrder);
                  }}
                >
                  <UserCheck className="ml-2 h-4 w-4" />
                  مدیریت راننده
                </Button>
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  بستن
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* دیالوگ اختصاص راننده */}
      <Dialog open={isAssignDriverDialogOpen} onOpenChange={setIsAssignDriverDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>اختصاص راننده</DialogTitle>
            <DialogDescription>
              یک راننده برای سفارش #{selectedOrder?.id} انتخاب کنید
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>انتخاب راننده</Label>
              <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                <SelectTrigger>
                  <SelectValue placeholder="راننده را انتخاب کنید..." />
                </SelectTrigger>
                <SelectContent>
                  {drivers
                    .filter((d) => d.isActive && d.documentsVerified)
                    .map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        <div className="flex items-center gap-2">
                          <span>{driver.fullName || 'راننده'}</span>
                          <span className="text-xs text-muted-foreground">
                            ({vehicleTypeLabels[driver.vehicleType]} - {driver.licensePlate})
                          </span>
                          {driver.isOnline && (
                            <Badge variant="outline" className="mr-2 text-xs">
                              آنلاین
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {selectedDriverId && (() => {
              const driver = drivers.find((d) => d.id === selectedDriverId);
              return driver ? (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={driver.profileImage} />
                      <AvatarFallback>{driver.fullName?.charAt(0) || 'D'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{driver.fullName}</div>
                      <div className="text-sm text-muted-foreground">{driver.phoneNumber}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{driver.rating}</span>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">نوع وسیله:</span>
                      <span className="mr-2 font-medium">
                        {vehicleTypeLabels[driver.vehicleType]}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">پلاک:</span>
                      <span className="mr-2 font-medium">{driver.licensePlate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">تعداد کارگر:</span>
                      <span className="mr-2 font-medium">{driver.availableWorkers} نفر</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">سفرها:</span>
                      <span className="mr-2 font-medium">{driver.totalRides} سفر</span>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDriverDialogOpen(false)}>
              انصراف
            </Button>
            <Button onClick={confirmAssignDriver} disabled={!selectedDriverId}>
              تایید و اختصاص
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* دیالوگ تغییر وضعیت */}
      <Dialog open={isChangeStatusDialogOpen} onOpenChange={setIsChangeStatusDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تغییر وضعیت سفارش</DialogTitle>
            <DialogDescription>
              وضعیت جدید را برای سفارش #{selectedOrder?.id} انتخاب کنید
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>وضعیت جدید</Label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={OrderStatus.PENDING}>در انتظار تایید</SelectItem>
                  <SelectItem value={OrderStatus.CONFIRMED}>تایید شده</SelectItem>
                  <SelectItem value={OrderStatus.DRIVER_ASSIGNED}>اختصاص داده شده</SelectItem>
                  <SelectItem value={OrderStatus.IN_PROGRESS}>در حال انجام</SelectItem>
                  <SelectItem value={OrderStatus.COMPLETED}>تکمیل شده</SelectItem>
                  <SelectItem value={OrderStatus.CANCELLED}>لغو شده</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>یادداشت (اختیاری)</Label>
              <Textarea
                placeholder="دلیل تغییر وضعیت یا توضیحات..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangeStatusDialogOpen(false)}>
              انصراف
            </Button>
            <Button onClick={confirmChangeStatus}>تایید تغییر</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* دیالوگ حذف */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              حذف سفارش
            </DialogTitle>
            <DialogDescription>
              آیا از حذف سفارش #{selectedOrder?.id} اطمینان دارید؟ این عمل قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">مشتری:</span>
                  <span className="font-medium">{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">وضعیت:</span>
                  <Badge className={getOrderStatusColor(selectedOrder.status)} variant="outline">
                    {getOrderStatusLabel(selectedOrder.status)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">قیمت:</span>
                  <span className="font-medium">
                    {(selectedOrder.finalPrice || selectedOrder.estimatedPrice)?.toLocaleString()}{' '}
                    تومان
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              انصراف
            </Button>
            <Button variant="destructive" onClick={confirmDeleteOrder}>
              حذف سفارش
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { AdminOrders };
