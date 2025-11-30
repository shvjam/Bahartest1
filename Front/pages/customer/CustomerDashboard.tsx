import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Truck,
  User,
  Plus,
  ArrowRight,
  Calendar,
  DollarSign,
  History,
  MessageSquare,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Order, OrderStatus, VehicleType } from '../../types';

// Mock Data - سفارشات اخیر مشتری
const mockOrders: Order[] = [
  {
    id: '1',
    customerId: 'c1',
    customerPhone: '09121234567',
    customerName: 'مریم احمدی',
    serviceCategoryId: 's1',
    driverId: 'd1',
    status: OrderStatus.IN_TRANSIT,
    preferredDateTime: new Date('2024-11-09T10:00:00'),
    createdAt: new Date('2024-11-08T15:30:00'),
    estimatedPrice: 2500000,
    details: {
      needsPacking: true,
      needsWorkers: true,
      workerCount: 2,
      vehicleType: VehicleType.PICKUP,
    },
    items: [],
    locationDetails: {
      orderId: '1',
      originFloor: 3,
      originHasElevator: true,
      destinationFloor: 2,
      destinationHasElevator: false,
      walkDistanceMeters: 10,
      stopCount: 0,
      originWalkingDistance: 10,
      destinationWalkingDistance: 15,
    },
    originAddress: {
      id: 'a1',
      userId: 'c1',
      title: 'منزل',
      fullAddress: 'تهران، منطقه 5، خیابان آزادی، پلاک 123',
      lat: 35.6892,
      lng: 51.3890,
      district: '5',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    destinationAddress: {
      id: 'a2',
      userId: 'c1',
      title: 'منزل جدید',
      fullAddress: 'تهران، منطقه 3، خیابان انقلاب، پلاک 456',
      lat: 35.7089,
      lng: 51.4011,
      district: '3',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    distanceKm: 12,
    estimatedDuration: 45,
  },
  {
    id: '2',
    customerId: 'c1',
    customerPhone: '09121234567',
    customerName: 'مریم احمدی',
    serviceCategoryId: 's1',
    driverId: 'd2',
    status: OrderStatus.COMPLETED,
    preferredDateTime: new Date('2024-11-05T14:00:00'),
    createdAt: new Date('2024-11-04T10:00:00'),
    completedAt: new Date('2024-11-05T16:30:00'),
    estimatedPrice: 1800000,
    finalPrice: 1750000,
    details: {
      needsPacking: false,
      needsWorkers: true,
      workerCount: 1,
      vehicleType: VehicleType.NISSAN,
    },
    items: [],
    locationDetails: {
      orderId: '2',
      originFloor: 1,
      originHasElevator: false,
      destinationFloor: 4,
      destinationHasElevator: true,
      walkDistanceMeters: 5,
      stopCount: 1,
      originWalkingDistance: 5,
      destinationWalkingDistance: 8,
    },
    originAddress: {
      id: 'a3',
      userId: 'c1',
      title: 'دفتر',
      fullAddress: 'تهران، منطقه 2، خیابان ولیعصر، پلاک 789',
      lat: 35.7219,
      lng: 51.4056,
      district: '2',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    destinationAddress: {
      id: 'a4',
      userId: 'c1',
      title: 'انبار',
      fullAddress: 'تهران، منطقه 1، خیابان پاسداران، پلاک 321',
      lat: 35.7515,
      lng: 51.4679,
      district: '1',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    distanceKm: 8,
    estimatedDuration: 30,
    rating: 5,
  },
  {
    id: '3',
    customerId: 'c1',
    customerPhone: '09121234567',
    customerName: 'مریم احمدی',
    serviceCategoryId: 's1',
    status: OrderStatus.CONFIRMED,
    preferredDateTime: new Date('2024-11-12T09:00:00'),
    createdAt: new Date('2024-11-08T12:00:00'),
    estimatedPrice: 3200000,
    details: {
      needsPacking: true,
      needsWorkers: true,
      workerCount: 3,
      vehicleType: VehicleType.TRUCK,
    },
    items: [],
    locationDetails: {
      orderId: '3',
      originFloor: 0,
      originHasElevator: false,
      destinationFloor: 5,
      destinationHasElevator: true,
      walkDistanceMeters: 15,
      stopCount: 2,
      originWalkingDistance: 15,
      destinationWalkingDistance: 20,
    },
    originAddress: {
      id: 'a5',
      userId: 'c1',
      title: 'فروشگاه',
      fullAddress: 'تهران، منطقه 6، میدان انقلاب، پلاک 555',
      lat: 35.7008,
      lng: 51.3912,
      district: '6',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    destinationAddress: {
      id: 'a6',
      userId: 'c1',
      title: 'خانه',
      fullAddress: 'تهران، منطقه 12، اتوبان تهران-کرج، پلاک 888',
      lat: 35.7219,
      lng: 51.2456,
      district: '12',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    distanceKm: 18,
    estimatedDuration: 55,
  },
];

const vehicleTypeLabels: Record<VehicleType, string> = {
  [VehicleType.PICKUP]: 'وانت',
  [VehicleType.NISSAN]: 'نیسان',
  [VehicleType.TRUCK]: 'کامیون',
  [VehicleType.HEAVY_TRUCK]: 'خاور',
};

export const CustomerDashboard = () => {
  const [orders] = useState<Order[]>(mockOrders);

  const stats = {
    totalOrders: orders.length,
    inProgress: orders.filter((o) => 
      o.status === OrderStatus.IN_TRANSIT || 
      o.status === OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN ||
      o.status === OrderStatus.PACKING_IN_PROGRESS ||
      o.status === OrderStatus.LOADING_IN_PROGRESS ||
      o.status === OrderStatus.DRIVER_ASSIGNED
    ).length,
    completed: orders.filter((o) => o.status === OrderStatus.COMPLETED).length,
    totalSpent: orders
      .filter((o) => o.status === OrderStatus.COMPLETED)
      .reduce((sum, o) => sum + (o.finalPrice || 0), 0),
  };

  const getStatusLabel = (status: OrderStatus) => {
    const labels: Record<OrderStatus, string> = {
      [OrderStatus.DRAFT]: 'پیش‌نویس',
      [OrderStatus.PENDING]: 'در انتظار تایید',
      [OrderStatus.REVIEWING]: 'در حال بررسی',
      [OrderStatus.CONFIRMED]: 'تایید شده',
      [OrderStatus.DRIVER_ASSIGNED]: 'راننده اختصاص یافته',
      [OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN]: 'راننده در مسیر',
      [OrderStatus.PACKING_IN_PROGRESS]: 'در حال بسته‌بندی',
      [OrderStatus.LOADING_IN_PROGRESS]: 'در حال بارگیری',
      [OrderStatus.IN_TRANSIT]: 'در حال انتقال',
      [OrderStatus.IN_PROGRESS]: 'در حال انجام',
      [OrderStatus.ARRIVED_AT_DESTINATION]: 'رسیده به مقصد',
      [OrderStatus.COMPLETED]: 'تکمیل شده',
      [OrderStatus.CANCELLED]: 'لغو شده',
    };
    return labels[status];
  };

  const getStatusColor = (status: OrderStatus) => {
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

  const getStatusIcon = (status: OrderStatus) => {
    const icons: Record<OrderStatus, any> = {
      [OrderStatus.DRAFT]: Clock,
      [OrderStatus.PENDING]: Clock,
      [OrderStatus.REVIEWING]: Clock,
      [OrderStatus.CONFIRMED]: CheckCircle,
      [OrderStatus.DRIVER_ASSIGNED]: User,
      [OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN]: Truck,
      [OrderStatus.PACKING_IN_PROGRESS]: Package,
      [OrderStatus.LOADING_IN_PROGRESS]: Package,
      [OrderStatus.IN_TRANSIT]: Truck,
      [OrderStatus.IN_PROGRESS]: Truck,
      [OrderStatus.ARRIVED_AT_DESTINATION]: MapPin,
      [OrderStatus.COMPLETED]: CheckCircle,
      [OrderStatus.CANCELLED]: XCircle,
    };
    return icons[status];
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر خوش‌آمدگویی */}
      <div>
        <h1 className="mb-2">سلام مریم عزیز! 👋</h1>
        <p className="text-muted-foreground">
          خوشحالیم که دوباره اینجا هستید.
        </p>
      </div>

      {/* دکمه سفارش سریع */}
      <Card className="border-primary bg-gradient-to-l from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <h3 className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                سفارش جدید
              </h3>
              <p className="text-sm text-muted-foreground">
                اسباب‌کشی راحت و سریع با بهترین قیمت
              </p>
            </div>
            <Link to="/services">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                ثبت سفارش
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* کارت‌های آماری */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">کل سفارشات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div>{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">سفارش ثبت شده</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">در حال انجام</CardTitle>
            <Truck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div>{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">سفارش فعال</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">تکمیل شده</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div>{stats.completed}</div>
            <p className="text-xs text-muted-foreground">موفقیت‌آمیز</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">هزینه کل</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{(stats.totalSpent / 1000000).toFixed(1)}م</div>
            <p className="text-xs text-muted-foreground">میلیون تومان</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* بخش اصلی */}
        <div className="space-y-6 lg:col-span-2">
          {/* سفارش در حال انجام */}
          {stats.inProgress > 0 && (
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-orange-600" />
                  سفارش در حال انجام
                </CardTitle>
                <CardDescription>پیگیری وضعیت سفارش جاری شما</CardDescription>
              </CardHeader>
              <CardContent>
                {orders
                  .filter((o) => 
                    o.status === OrderStatus.IN_TRANSIT ||
                    o.status === OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN ||
                    o.status === OrderStatus.PACKING_IN_PROGRESS ||
                    o.status === OrderStatus.LOADING_IN_PROGRESS ||
                    o.status === OrderStatus.DRIVER_ASSIGNED
                  )
                  .map((order) => (
                    <div key={order.id} className="space-y-4">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="space-y-1 flex-1 min-w-[200px]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className="bg-orange-100 text-orange-800">
                              سفارش #{order.id}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(order.preferredDateTime).toLocaleDateString('fa-IR')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm flex-wrap">
                            <MapPin className="h-4 w-4 text-green-600" />
                            <span className="text-muted-foreground">
                              {order.originAddress.title}
                            </span>
                            <ArrowRight className="h-3 w-3" />
                            <MapPin className="h-4 w-4 text-red-600" />
                            <span className="text-muted-foreground">
                              {order.destinationAddress.title}
                            </span>
                          </div>
                        </div>
                        <Link to={`/customer/tracking/${order.id}`}>
                          <Button size="sm" variant="outline">
                            پیگیری لحظه‌ای
                          </Button>
                        </Link>
                      </div>

                      <Separator />

                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            <div className="text-muted-foreground">نوع وسیله</div>
                            <div className="font-medium">
                              {vehicleTypeLabels[order.details.vehicleType]}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            <div className="text-muted-foreground">تعداد کارگر</div>
                            <div className="font-medium">{order.details.workerCount} نفر</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            <div className="text-muted-foreground">زمان تخمینی</div>
                            <div className="font-medium">{order.estimatedDuration} دقیقه</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}

          {/* سفارشات اخیر */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    سفارشات اخیر
                  </CardTitle>
                  <CardDescription>آخرین سفارشات شما</CardDescription>
                </div>
                <Link to="/customer/orders">
                  <Button variant="ghost" size="sm">
                    مشاهده همه
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50 gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full flex-shrink-0 ${
                            order.status === OrderStatus.COMPLETED
                              ? 'bg-green-100'
                              : order.status === OrderStatus.IN_PROGRESS
                              ? 'bg-orange-100'
                              : 'bg-blue-100'
                          }`}
                        >
                          <StatusIcon
                            className={`h-6 w-6 ${
                              order.status === OrderStatus.COMPLETED
                                ? 'text-green-600'
                                : order.status === OrderStatus.IN_PROGRESS
                                ? 'text-orange-600'
                                : 'text-blue-600'
                            }`}
                          />
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium whitespace-nowrap">سفارش #{order.id}</span>
                            <Badge className={getStatusColor(order.status)} variant="outline">
                              {getStatusLabel(order.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span className="whitespace-nowrap">
                              {new Date(order.preferredDateTime).toLocaleDateString('fa-IR', {
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                            <span>•</span>
                            <span className="whitespace-nowrap">{order.distanceKm} کیلومتر</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left whitespace-nowrap">
                        <div className="font-medium">
                          {(order.finalPrice || order.estimatedPrice)?.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">تومان</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ساید بار */}
        <div className="space-y-6">
          {/* لینک‌های سریع */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">دسترسی سریع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/customer/orders">
                <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                  <Package className="h-4 w-4" />
                  سفارشات من
                </Button>
              </Link>
              <Link to="/customer/profile">
                <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                  <User className="h-4 w-4" />
                  ویرایش پروفایل
                </Button>
              </Link>
              <Link to="/customer/tickets">
                <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                  <MessageSquare className="h-4 w-4" />
                  پشتیبانی و تیکت‌ها
                </Button>
              </Link>
              <Link to="/customer/transactions">
                <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                  <DollarSign className="h-4 w-4" />
                  تراکنش‌های مالی
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* تماس سریع */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">نیاز به کمک دارید؟</div>
                    <div className="text-xs text-muted-foreground">تماس با پشتیبانی</div>
                  </div>
                </div>
                <a href="tel:02191005100">
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="ml-2 h-4 w-4" />
                    021-91005100
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};