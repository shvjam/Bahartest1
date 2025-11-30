import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Phone,
  Navigation,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  Truck,
  Eye,
  MessageSquare,
  Star,
  MoreVertical,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Separator } from '../../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { ScrollArea } from '../../components/ui/scroll-area';
import { OrderStatus } from '../../types';
import { toast } from 'sonner';

// Mock Orders Data
const mockOrders = [
  {
    id: 'o1',
    orderNumber: 'BH-1234',
    customer: {
      name: 'علی محمدی',
      phone: '09123456789',
      avatar: '',
      rating: 4.5,
    },
    origin: {
      address: 'تهران، منطقه 5، خیابان آزادی، پلاک 123',
      lat: 35.6892,
      lng: 51.3890,
    },
    destination: {
      address: 'تهران، منطقه 2، خیابان ولیعصر، پلاک 456',
      lat: 35.7219,
      lng: 51.4185,
    },
    distance: 12.5,
    estimatedDuration: 45,
    scheduledTime: new Date('2024-11-08T10:00:00'),
    price: 1200000,
    commission: 180000,
    status: OrderStatus.DRIVER_ASSIGNED,
    serviceType: 'اسباب‌کشی منزل',
    items: ['یخچال', 'ماشین لباسشویی', 'مبل راحتی'],
    notes: 'لطفاً دقیق باشید، لوازم شکستنی داریم',
  },
  {
    id: 'o2',
    orderNumber: 'BH-1235',
    customer: {
      name: 'سارا کریمی',
      phone: '09127654321',
      avatar: '',
      rating: 5.0,
    },
    origin: {
      address: 'تهران، منطقه 3، میدان انقلاب',
      lat: 35.7089,
      lng: 51.4011,
    },
    destination: {
      address: 'تهران، منطقه 1، میدان تجریش',
      lat: 35.8042,
      lng: 51.4335,
    },
    distance: 18.2,
    estimatedDuration: 60,
    scheduledTime: new Date('2024-11-08T14:00:00'),
    price: 1800000,
    commission: 270000,
    status: OrderStatus.PENDING,
    serviceType: 'حمل اثاثیه',
    items: ['کتابخانه', 'میز تحریر', 'صندلی'],
    notes: '',
  },
  {
    id: 'o3',
    orderNumber: 'BH-1220',
    customer: {
      name: 'محمد رضایی',
      phone: '09129876543',
      avatar: '',
      rating: 4.8,
    },
    origin: {
      address: 'تهران، منطقه 4، میدان آرژانتین',
      lat: 35.7312,
      lng: 51.4194,
    },
    destination: {
      address: 'کرج، شهرک گلستان',
      lat: 35.8353,
      lng: 50.9566,
    },
    distance: 35.8,
    estimatedDuration: 90,
    scheduledTime: new Date('2024-11-07T16:30:00'),
    price: 3200000,
    commission: 480000,
    status: OrderStatus.COMPLETED,
    serviceType: 'اسباب‌کشی اداری',
    items: ['میز اداری', 'صندلی اداری', 'کمد بایگانی'],
    notes: '',
    completedAt: new Date('2024-11-07T18:45:00'),
  },
  {
    id: 'o4',
    orderNumber: 'BH-1210',
    customer: {
      name: 'فاطمه حسینی',
      phone: '09121112233',
      avatar: '',
      rating: 4.2,
    },
    origin: {
      address: 'تهران، منطقه 6، خیابان شریعتی',
      lat: 35.7536,
      lng: 51.4386,
    },
    destination: {
      address: 'تهران، منطقه 7، خیابان رسالت',
      lat: 35.7450,
      lng: 51.5089,
    },
    distance: 8.5,
    estimatedDuration: 30,
    scheduledTime: new Date('2024-11-06T09:00:00'),
    price: 950000,
    commission: 142500,
    status: OrderStatus.IN_TRANSIT,
    serviceType: 'حمل لوازم',
    items: ['جعبه‌های کتاب', 'لوازم آشپزخانه'],
    notes: 'آسانسور موجود است',
  },
];

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.DRIVER_ASSIGNED]: 'bg-purple-100 text-purple-800',
  [OrderStatus.IN_TRANSIT]: 'bg-orange-100 text-orange-800',
  [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
  [OrderStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [OrderStatus.REVIEWING]: 'bg-blue-100 text-blue-800',
  [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN]: 'bg-orange-100 text-orange-800',
  [OrderStatus.PACKING_IN_PROGRESS]: 'bg-purple-100 text-purple-800',
  [OrderStatus.LOADING_IN_PROGRESS]: 'bg-purple-100 text-purple-800',
  [OrderStatus.IN_PROGRESS]: 'bg-orange-100 text-orange-800',
  [OrderStatus.ARRIVED_AT_DESTINATION]: 'bg-green-100 text-green-800',
};

const statusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'در انتظار',
  [OrderStatus.DRIVER_ASSIGNED]: 'اختصاص داده شده',
  [OrderStatus.IN_TRANSIT]: 'در حال حمل',
  [OrderStatus.COMPLETED]: 'تکمیل شده',
  [OrderStatus.CANCELLED]: 'لغو شده',
  [OrderStatus.DRAFT]: 'پیش‌نویس',
  [OrderStatus.REVIEWING]: 'در حال بررسی',
  [OrderStatus.CONFIRMED]: 'تایید شده',
  [OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN]: 'در مسیر مبدا',
  [OrderStatus.PACKING_IN_PROGRESS]: 'در حال بسته‌بندی',
  [OrderStatus.LOADING_IN_PROGRESS]: 'در حال بارگیری',
  [OrderStatus.IN_PROGRESS]: 'در حال انجام',
  [OrderStatus.ARRIVED_AT_DESTINATION]: 'رسیده به مقصد',
};

export const DriverOrders = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // فیلتر سفارشات بر اساس تب
  const getFilteredOrders = () => {
    let filtered = mockOrders;

    // فیلتر بر اساس تب
    if (activeTab === 'available') {
      filtered = filtered.filter((o) => o.status === OrderStatus.PENDING);
    } else if (activeTab === 'assigned') {
      filtered = filtered.filter(
        (o) =>
          o.status === OrderStatus.DRIVER_ASSIGNED ||
          o.status === OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN
      );
    } else if (activeTab === 'in-progress') {
      filtered = filtered.filter(
        (o) =>
          o.status === OrderStatus.IN_TRANSIT ||
          o.status === OrderStatus.PACKING_IN_PROGRESS ||
          o.status === OrderStatus.LOADING_IN_PROGRESS ||
          o.status === OrderStatus.ARRIVED_AT_DESTINATION
      );
    } else if (activeTab === 'completed') {
      filtered = filtered.filter((o) => o.status === OrderStatus.COMPLETED);
    }

    // جستجو
    if (searchQuery) {
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.origin.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.destination.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // مر��ب‌سازی
    if (sortBy === 'date') {
      filtered.sort(
        (a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()
      );
    } else if (sortBy === 'price') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'distance') {
      filtered.sort((a, b) => b.distance - a.distance);
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const handleAcceptOrder = (orderId: string) => {
    toast.success('سفارش پذیرفته شد');
  };

  const handleRejectOrder = (orderId: string) => {
    toast.error('سفارش رد شد');
  };

  const handleStartNavigation = (orderId: string) => {
    navigate(`/driver/active-trip/${orderId}`);
  };

  const handleViewDetails = (order: typeof mockOrders[0]) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            سفارشات من
          </h1>
          <p className="text-muted-foreground">مدیریت سفارشات خود</p>
        </div>
      </div>

      {/* فیلترها و جستجو */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="جستجو بر اساس شماره سفارش، نام مشتری یا آدرس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">مرتب‌سازی: تاریخ</SelectItem>
                <SelectItem value="price">مرتب‌سازی: قیمت</SelectItem>
                <SelectItem value="distance">مرتب‌سازی: مسافت</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* تب‌های سفارشات */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="available">
            موجود
            <Badge variant="secondary" className="mr-2">
              {mockOrders.filter((o) => o.status === OrderStatus.PENDING).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="assigned">
            اختصاص داده شده
            <Badge variant="secondary" className="mr-2">
              {
                mockOrders.filter(
                  (o) =>
                    o.status === OrderStatus.DRIVER_ASSIGNED ||
                    o.status === OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN
                ).length
              }
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            در حال انجام
            <Badge variant="secondary" className="mr-2">
              {
                mockOrders.filter(
                  (o) =>
                    o.status === OrderStatus.IN_TRANSIT ||
                    o.status === OrderStatus.PACKING_IN_PROGRESS ||
                    o.status === OrderStatus.LOADING_IN_PROGRESS ||
                    o.status === OrderStatus.ARRIVED_AT_DESTINATION
                ).length
              }
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            تکمیل شده
            <Badge variant="secondary" className="mr-2">
              {mockOrders.filter((o) => o.status === OrderStatus.COMPLETED).length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">سفارشی یافت نشد</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? 'نتیجه‌ای برای جستجوی شما پیدا نشد'
                    : 'در حال حاضر سفارشی در این دسته وجود ندارد'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4">
                    {/* هدر سفارش */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
                          <AvatarFallback>
                            {order.customer.name.split(' ')[0][0]}
                            {order.customer.name.split(' ')[1]?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{order.customer.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{order.orderNumber}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              {order.customer.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                              <Eye className="ml-2 h-4 w-4" />
                              مشاهده جزئیات
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <Separator />

                    {/* اطلاعات سفارش */}
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* مسیر */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 text-sm">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                            <div className="h-2 w-2 rounded-full bg-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-muted-foreground">مبدا</p>
                            <p className="font-medium">{order.origin.address}</p>
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
                        <div className="flex items-start gap-2 text-sm">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
                            <div className="h-2 w-2 rounded-full bg-red-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-muted-foreground">مقصد</p>
                            <p className="font-medium">{order.destination.address}</p>
                          </div>
                        </div>
                      </div>

                      {/* جزئیات */}
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">نوع خدمت:</span>
                          <span className="font-medium">{order.serviceType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">زمان:</span>
                          <span className="font-medium">
                            {new Date(order.scheduledTime).toLocaleDateString('fa-IR', {
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-muted-foreground">کرایه:</span>
                          <span className="font-bold text-green-600">
                            {order.price.toLocaleString('fa-IR')} تومان
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">کمیسیون شما:</span>
                          <span className="font-bold text-primary">
                            {order.commission.toLocaleString('fa-IR')} تومان
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* آیتم‌ها */}
                    {order.items.length > 0 && (
                      <>
                        <Separator />
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item, index) => (
                            <Badge key={index} variant="outline">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}

                    {/* یادداشت */}
                    {order.notes && (
                      <>
                        <Separator />
                        <div className="rounded-lg bg-muted p-3 text-sm">
                          <p className="mb-1 font-medium">یادداشت مشتری:</p>
                          <p className="text-muted-foreground">{order.notes}</p>
                        </div>
                      </>
                    )}

                    {/* دکمه‌های عملیات */}
                    <Separator />
                    <div className="flex flex-wrap gap-2">
                      {order.status === OrderStatus.PENDING && (
                        <>
                          <Button
                            onClick={() => handleAcceptOrder(order.id)}
                            className="flex-1 gap-2 md:flex-none"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            پذیرش سفارش
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleRejectOrder(order.id)}
                            className="flex-1 gap-2 md:flex-none"
                          >
                            <XCircle className="h-4 w-4" />
                            رد سفارش
                          </Button>
                        </>
                      )}
                      {(order.status === OrderStatus.DRIVER_ASSIGNED ||
                        order.status === OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN) && (
                        <Button
                          onClick={() => handleStartNavigation(order.id)}
                          className="flex-1 gap-2 md:flex-none"
                        >
                          <Navigation className="h-4 w-4" />
                          شروع مسیریابی
                        </Button>
                      )}
                      <Button variant="outline" className="gap-2">
                        <Phone className="h-4 w-4" />
                        تماس
                      </Button>
                      <Button variant="outline" onClick={() => handleViewDetails(order)} className="gap-2">
                        <Eye className="h-4 w-4" />
                        جزئیات
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog جزئیات سفارش */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>جزئیات سفارش</DialogTitle>
            <DialogDescription>اطلاعات کامل سفارش {selectedOrder?.orderNumber}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <ScrollArea className="max-h-[600px] pr-4">
              <div className="space-y-4">
                {/* اطلاعات مشتری */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">اطلاعات مشتری</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedOrder.customer.avatar} alt={selectedOrder.customer.name} />
                        <AvatarFallback>
                          {selectedOrder.customer.name.split(' ')[0][0]}
                          {selectedOrder.customer.name.split(' ')[1]?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedOrder.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedOrder.customer.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium">{selectedOrder.customer.rating}</span>
                      <span className="text-sm text-muted-foreground">امتیاز مشتری</span>
                    </div>
                  </CardContent>
                </Card>

                {/* مسیر */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">مسیر</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                        <div className="h-2 w-2 rounded-full bg-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-muted-foreground">مبدا</p>
                        <p className="font-medium">{selectedOrder.origin.address}</p>
                      </div>
                    </div>
                    <div className="mr-2 border-r-2 border-dashed border-muted pr-3">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {selectedOrder.distance} کیلومتر
                        <Clock className="h-3 w-3" />
                        {selectedOrder.estimatedDuration} دقیقه
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
                        <div className="h-2 w-2 rounded-full bg-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-muted-foreground">مقصد</p>
                        <p className="font-medium">{selectedOrder.destination.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* لوازم */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">لوازم حمل</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedOrder.items.map((item, index) => (
                        <Badge key={index} variant="secondary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* مالی */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">اطلاعات مالی</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">کرایه کل:</span>
                      <span className="font-bold">{selectedOrder.price.toLocaleString('fa-IR')} تومان</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">کمیسیون شما (15%):</span>
                      <span className="font-bold text-primary">
                        {selectedOrder.commission.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};