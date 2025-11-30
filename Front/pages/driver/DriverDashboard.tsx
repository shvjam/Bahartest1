import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Navigation,
  Phone,
  Calendar,
  Star,
  Award,
  Target,
  Activity,
  Truck,
  Users,
  Timer,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { OrderStatus } from '../../types';

// Mock Data
const mockDriver = {
  id: 'd1',
  name: 'رضا احمدی',
  avatar: '',
  phone: '09121234567',
  vehicle: 'وانت نیسان',
  vehiclePlate: '12 ج 345 ایران 78',
  rating: 4.8,
  totalRides: 342,
  status: 'available', // available, busy, offline
  todayEarnings: 2500000,
  weekEarnings: 15600000,
  monthEarnings: 58400000,
  completionRate: 96,
  onTimeRate: 94,
};

const mockTodayOrders = [
  {
    id: 'o1',
    orderNumber: 'BH-1234',
    customer: {
      name: 'علی محمدی',
      phone: '09123456789',
      avatar: '',
    },
    origin: 'تهران، منطقه 5، خیابان آزادی',
    destination: 'تهران، منطقه 2، خیابان ولیعصر',
    distance: 12.5,
    estimatedDuration: 45,
    scheduledTime: new Date('2024-11-08T10:00:00'),
    price: 1200000,
    status: OrderStatus.DRIVER_ASSIGNED,
  },
  {
    id: 'o2',
    orderNumber: 'BH-1235',
    customer: {
      name: 'سارا کریمی',
      phone: '09127654321',
      avatar: '',
    },
    origin: 'تهران، منطقه 3، میدان انقلاب',
    destination: 'تهران، منطقه 1، میدان تجریش',
    distance: 18.2,
    estimatedDuration: 60,
    scheduledTime: new Date('2024-11-08T14:00:00'),
    price: 1800000,
    status: OrderStatus.PENDING,
  },
  {
    id: 'o3',
    orderNumber: 'BH-1236',
    customer: {
      name: 'محمد رضایی',
      phone: '09129876543',
      avatar: '',
    },
    origin: 'تهران، منطقه 4، میدان آرژانتین',
    destination: 'کرج، شهرک گلستان',
    distance: 35.8,
    estimatedDuration: 90,
    scheduledTime: new Date('2024-11-08T16:30:00'),
    price: 3200000,
    status: OrderStatus.PENDING,
  },
];

const mockStats = {
  todayOrders: 3,
  completedToday: 1,
  cancelledToday: 0,
  inProgress: 1,
  todayDistance: 45.8,
  todayDuration: 180,
};

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.DRIVER_ASSIGNED]: 'bg-purple-100 text-purple-800',
  [OrderStatus.IN_TRANSIT]: 'bg-orange-100 text-orange-800',
  [OrderStatus.IN_PROGRESS]: 'bg-orange-100 text-orange-800',
  [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
  [OrderStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [OrderStatus.REVIEWING]: 'bg-blue-100 text-blue-800',
  [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN]: 'bg-orange-100 text-orange-800',
  [OrderStatus.PACKING_IN_PROGRESS]: 'bg-purple-100 text-purple-800',
  [OrderStatus.LOADING_IN_PROGRESS]: 'bg-purple-100 text-purple-800',
  [OrderStatus.ARRIVED_AT_DESTINATION]: 'bg-green-100 text-green-800',
};

const statusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'در انتظار',
  [OrderStatus.DRIVER_ASSIGNED]: 'اختصاص داده شده',
  [OrderStatus.IN_TRANSIT]: 'در حال حمل',
  [OrderStatus.IN_PROGRESS]: 'در حال انجام',
  [OrderStatus.COMPLETED]: 'تکمیل شده',
  [OrderStatus.CANCELLED]: 'لغو شده',
  [OrderStatus.DRAFT]: 'پیش‌نویس',
  [OrderStatus.REVIEWING]: 'در حال بررسی',
  [OrderStatus.CONFIRMED]: 'تایید شده',
  [OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN]: 'راننده در راه',
  [OrderStatus.PACKING_IN_PROGRESS]: 'در حال بسته‌بندی',
  [OrderStatus.LOADING_IN_PROGRESS]: 'در حال بارگیری',
  [OrderStatus.ARRIVED_AT_DESTINATION]: 'رسیده به مقصد',
};

export const DriverDashboard = () => {
  const navigate = useNavigate();
  const [driverStatus, setDriverStatus] = useState<'available' | 'busy' | 'offline'>(
    mockDriver.status as 'available' | 'busy' | 'offline'
  );

  const handleStatusChange = (newStatus: 'available' | 'busy' | 'offline') => {
    setDriverStatus(newStatus);
  };

  const handleStartTrip = (orderId: string) => {
    navigate(`/driver/active-trip/${orderId}`);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر با اطلاعات راننده */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={mockDriver.avatar} alt={mockDriver.name} />
                <AvatarFallback className="text-xl">
                  {mockDriver.name.split(' ')[0][0]}
                  {mockDriver.name.split(' ')[1][0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="flex items-center gap-2">
                  {mockDriver.name}
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    {mockDriver.rating}
                  </Badge>
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    {mockDriver.vehicle}
                  </span>
                  <span>•</span>
                  <span className="font-mono">{mockDriver.vehiclePlate}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    {mockDriver.totalRides} سفر
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={driverStatus === 'available' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('available')}
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                آماده
              </Button>
              <Button
                variant={driverStatus === 'busy' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('busy')}
                className="gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                مشغول
              </Button>
              <Button
                variant={driverStatus === 'offline' ? 'destructive' : 'outline'}
                onClick={() => handleStatusChange('offline')}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                آفلاین
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* کارت‌های آمار */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">سفارشات امروز</p>
                <p className="text-2xl font-bold">{mockStats.todayOrders}</p>
                <p className="text-xs text-green-600">+{mockStats.completedToday} تکمیل شده</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">درآمد امروز</p>
                <p className="text-2xl font-bold">{mockDriver.todayEarnings.toLocaleString('fa-IR')}</p>
                <p className="text-xs text-muted-foreground">تومان</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">مسافت امروز</p>
                <p className="text-2xl font-bold">{mockStats.todayDistance}</p>
                <p className="text-xs text-muted-foreground">کیلومتر</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">زمان کار امروز</p>
                <p className="text-2xl font-bold">{mockStats.todayDuration}</p>
                <p className="text-xs text-muted-foreground">دقیقه</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* عملکرد ماهانه */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">درآمد هفته</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">{mockDriver.weekEarnings.toLocaleString('fa-IR')}</p>
              <span className="text-sm text-muted-foreground">تومان</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>12% افزایش</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">نرخ تکمیل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>درصد موفقیت</span>
                <span className="font-bold">{mockDriver.completionRate}%</span>
              </div>
              <Progress value={mockDriver.completionRate} className="h-2" />
              <p className="text-xs text-muted-foreground">از 100 سفارش، {mockDriver.completionRate} تکمیل</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">نرخ به موقع بودن</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>درصد به موقع</span>
                <span className="font-bold">{mockDriver.onTimeRate}%</span>
              </div>
              <Progress value={mockDriver.onTimeRate} className="h-2" />
              <p className="text-xs text-muted-foreground">تحویل به موقع سفارشات</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* سفارشات امروز */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>سفارشات امروز</CardTitle>
              <CardDescription>لیست سفارشات برنامه‌ریزی شده برای امروز</CardDescription>
            </div>
            <Badge variant="secondary">{mockTodayOrders.length} سفارش</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTodayOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 space-y-3">
                      {/* هدر سفارش */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
                            <AvatarFallback>
                              {order.customer.name.split(' ')[0][0]}
                              {order.customer.name.split(' ')[1][0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{order.customer.name}</p>
                            <p className="text-sm text-muted-foreground">{order.orderNumber}</p>
                          </div>
                        </div>
                        <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                      </div>

                      <Separator />

                      {/* مسیر */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                            <div className="h-2 w-2 rounded-full bg-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-muted-foreground">مبدا</p>
                            <p className="font-medium">{order.origin}</p>
                          </div>
                        </div>
                        <div className="mr-2 border-r-2 border-dashed border-muted pr-3">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {order.distance} کیلومتر
                            <Clock className="h-3 w-3" />
                            {order.estimatedDuration} دقیقه
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
                            <div className="h-2 w-2 rounded-full bg-red-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-muted-foreground">مقصد</p>
                            <p className="font-medium">{order.destination}</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* اطلاعات تکمیلی */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date(order.scheduledTime).toLocaleDateString('fa-IR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-bold text-green-600">
                            {order.price.toLocaleString('fa-IR')} تومان
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* دکمه‌های عملیات */}
                    <div className="flex gap-2 md:flex-col">
                      {order.status === OrderStatus.DRIVER_ASSIGNED && (
                        <Button className="gap-2" onClick={() => handleStartTrip(order.id)}>
                          <Navigation className="h-4 w-4" />
                          شروع مسیر
                        </Button>
                      )}
                      {order.status === OrderStatus.PENDING && (
                        <Button variant="outline" className="gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          پذیرش
                        </Button>
                      )}
                      <Button variant="outline" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};