import { toast } from 'sonner';
import { orderService } from '../../services/api/order.service';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Star,
  Calendar,
  DollarSign,
  Truck,
  User,
  Eye,
  Navigation,
  Filter,
  Search,
  Download,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  FileText,
  MoreVertical,
  Phone,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
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
import { ScrollArea } from '../../components/ui/scroll-area';
import { Textarea } from '../../components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Order, OrderStatus, VehicleType } from '../../types';

// Mock Data - سفارشات مشتری
const generateMockOrders = (): Order[] => {
  const statuses = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.DRIVER_ASSIGNED,
    OrderStatus.IN_PROGRESS,
    OrderStatus.COMPLETED,
    OrderStatus.CANCELLED,
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

  for (let i = 1; i <= 15; i++) {
    const addressPair = addresses[Math.floor(Math.random() * addresses.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const daysAgo = Math.floor(Math.random() * 60);
    const createdDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const preferredDate = new Date(createdDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);
    const isCompleted = status === OrderStatus.COMPLETED;

    const distanceKm = Math.floor(Math.random() * 30) + 5;
    const estimatedPrice = distanceKm * 150000 + Math.floor(Math.random() * 500000);
    const finalPrice = isCompleted ? estimatedPrice + Math.floor(Math.random() * 200000) - 100000 : estimatedPrice;

    orders.push({
      id: i.toString(),
      customerId: 'c1',
      customerPhone: '09121234567',
      customerName: 'مریم احمدی',
      serviceCategoryId: 's1',
      driverId: status !== OrderStatus.PENDING ? `d${Math.floor(Math.random() * 3) + 1}` : undefined,
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
        userId: 'c1',
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
        userId: 'c1',
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
      rating: isCompleted && Math.random() > 0.3 ? Math.floor(Math.random() * 2) + 4 : undefined,
    });
  }

  return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

const vehicleTypeLabels: Record<VehicleType, string> = {
  [VehicleType.PICKUP]: 'وانت',
  [VehicleType.NISSAN]: 'نیسان',
  [VehicleType.TRUCK]: 'کامیون',
  [VehicleType.HEAVY_TRUCK]: 'خاور',
};

export const CustomerOrders = () => {
  const [orders, setOrders] = useState<Order[]>(generateMockOrders());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  const getStatusLabel = (status: OrderStatus) => {
    const labels: Record<OrderStatus, string> = {
      [OrderStatus.DRAFT]: 'پیش‌نویس',
      [OrderStatus.PENDING]: 'در انتظار',
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
    return labels[status] || 'نامشخص';
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      [OrderStatus.DRAFT]: 'bg-gray-100 text-gray-800',
      [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [OrderStatus.REVIEWING]: 'bg-blue-100 text-blue-800',
      [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
      [OrderStatus.DRIVER_ASSIGNED]: 'bg-purple-100 text-purple-800',
      [OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN]: 'bg-orange-100 text-orange-800',
      [OrderStatus.PACKING_IN_PROGRESS]: 'bg-purple-100 text-purple-800',
      [OrderStatus.LOADING_IN_PROGRESS]: 'bg-purple-100 text-purple-800',
      [OrderStatus.IN_TRANSIT]: 'bg-orange-100 text-orange-800',
      [OrderStatus.IN_PROGRESS]: 'bg-orange-100 text-orange-800',
      [OrderStatus.ARRIVED_AT_DESTINATION]: 'bg-green-100 text-green-800',
      [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
    return icons[status] || Clock;
  };

  // فیلتر سفارشات
  const filteredOrders = orders.filter((order) => {
    if (searchQuery && !order.id.includes(searchQuery)) {
      return false;
    }
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // گروه‌بندی سفارشات
  const groupedOrders = {
    active: filteredOrders.filter(
      (o) =>
        o.status === OrderStatus.PENDING ||
        o.status === OrderStatus.CONFIRMED ||
        o.status === OrderStatus.DRIVER_ASSIGNED ||
        o.status === OrderStatus.IN_PROGRESS
    ),
    completed: filteredOrders.filter((o) => o.status === OrderStatus.COMPLETED),
    cancelled: filteredOrders.filter((o) => o.status === OrderStatus.CANCELLED),
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const handleCancelOrder = (order: Order) => {
    setSelectedOrder(order);
    setCancelReason('');
    setIsCancelDialogOpen(true);
  };

  const handleRateOrder = (order: Order) => {
    setSelectedOrder(order);
    setRating(order.rating || 0);
    setRatingComment('');
    setIsRatingDialogOpen(true);
  };

  const confirmCancel = () => {
    if (!selectedOrder || !cancelReason) return;

    setOrders(
      orders.map((o) => (o.id === selectedOrder.id ? { ...o, status: OrderStatus.CANCELLED } : o))
    );

    toast.success('سفارش با موفقیت لغو شد');
    setIsCancelDialogOpen(false);
    setSelectedOrder(null);
  };

  const submitRating = () => {
    if (!selectedOrder || rating === 0) return;

    setOrders(orders.map((o) => (o.id === selectedOrder.id ? { ...o, rating } : o)));

    toast.success('امتیاز شما ثبت شد. متشکریم!');
    setIsRatingDialogOpen(false);
    setSelectedOrder(null);
  };

  const renderOrderCard = (order: Order) => {
    const StatusIcon = getStatusIcon(order.status);
    const canCancel =
      order.status === OrderStatus.PENDING ||
      order.status === OrderStatus.CONFIRMED ||
      order.status === OrderStatus.DRIVER_ASSIGNED;
    const canRate = order.status === OrderStatus.COMPLETED && !order.rating;
    const canTrack =
      order.status === OrderStatus.DRIVER_ASSIGNED || order.status === OrderStatus.IN_PROGRESS;

    return (
      <Card key={order.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* هدر */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    order.status === OrderStatus.COMPLETED
                      ? 'bg-green-100'
                      : order.status === OrderStatus.IN_PROGRESS
                      ? 'bg-orange-100'
                      : order.status === OrderStatus.CANCELLED
                      ? 'bg-red-100'
                      : 'bg-blue-100'
                  }`}
                >
                  <StatusIcon
                    className={`h-6 w-6 ${
                      order.status === OrderStatus.COMPLETED
                        ? 'text-green-600'
                        : order.status === OrderStatus.IN_PROGRESS
                        ? 'text-orange-600'
                        : order.status === OrderStatus.CANCELLED
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">سفارش #{order.id}</span>
                    {order.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{order.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString('fa-IR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(order.status)} variant="outline">
                  {getStatusLabel(order.status)}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
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
                    {canTrack && (
                      <DropdownMenuItem asChild>
                        <Link to={`/customer/tracking/${order.id}`}>
                          <Navigation className="ml-2 h-4 w-4" />
                          پیگیری لحظه‌ای
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {canRate && (
                      <DropdownMenuItem onClick={() => handleRateOrder(order)}>
                        <Star className="ml-2 h-4 w-4" />
                        ثبت امتیاز
                      </DropdownMenuItem>
                    )}
                    {canCancel && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleCancelOrder(order)}
                          className="text-red-600"
                        >
                          <XCircle className="ml-2 h-4 w-4" />
                          لغو سفارش
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Separator />

            {/* مسیر */}
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <div>
                  <div className="font-medium">{order.originAddress.title || 'مبدا'}</div>
                  <div className="text-muted-foreground">{order.originAddress.fullAddress}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ArrowRight className="mr-4 h-4 w-4" />
                <span className="text-xs">
                  {order.distanceKm} کیلومتر • {order.estimatedDuration} دقیقه
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                <div>
                  <div className="font-medium">{order.destinationAddress.title || 'مقصد'}</div>
                  <div className="text-muted-foreground">
                    {order.destinationAddress.fullAddress}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* جزئیات */}
            <div className="grid gap-3 md:grid-cols-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">وسیله</div>
                  <div className="font-medium">{vehicleTypeLabels[order.details.vehicleType]}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">کارگر</div>
                  <div className="font-medium">{order.details.workerCount} نفر</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">زمان</div>
                  <div className="font-medium">
                    {new Date(order.preferredDateTime).toLocaleTimeString('fa-IR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-muted-foreground">هزینه</div>
                  <div className="font-medium">
                    {((order.finalPrice || order.estimatedPrice) / 1000000).toFixed(1)}م
                  </div>
                </div>
              </div>
            </div>

            {/* دکمه‌های اکشن */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleViewDetails(order)}>
                <Eye className="ml-2 h-4 w-4" />
                جزئیات
              </Button>
              {canTrack && (
                <Link to={`/customer/tracking/${order.id}`}>
                  <Button size="sm" variant="default">
                    <Navigation className="ml-2 h-4 w-4" />
                    پیگیری لحظه‌ای
                  </Button>
                </Link>
              )}
              {canRate && (
                <Button size="sm" variant="secondary" onClick={() => handleRateOrder(order)}>
                  <Star className="ml-2 h-4 w-4" />
                  ثبت امتیاز
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر */}
      <div>
        <h1 className="mb-2">سفارشات من</h1>
        <p className="text-muted-foreground">مشاهده و مدیریت تمام سفارشات شما</p>
      </div>

      {/* فیلترها */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="جستجو با شماره سفارش..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value={OrderStatus.PENDING}>در انتظار تایید</SelectItem>
                  <SelectItem value={OrderStatus.CONFIRMED}>تایید شده</SelectItem>
                  <SelectItem value={OrderStatus.IN_PROGRESS}>در حال انجام</SelectItem>
                  <SelectItem value={OrderStatus.COMPLETED}>تکمیل شده</SelectItem>
                  <SelectItem value={OrderStatus.CANCELLED}>لغو شده</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
            >
              <RefreshCw className="ml-2 h-4 w-4" />
              بازنشانی
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* تب‌ها */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            فعال ({groupedOrders.active.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            تکمیل شده ({groupedOrders.completed.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            لغو شده ({groupedOrders.cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {groupedOrders.active.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="mb-4 h-16 w-16 text-muted-foreground/50" />
                <h3 className="mb-2">سفارش فعالی وجود ندارد</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  هنوز سفارشی ثبت نکرده‌اید یا همه سفارشات شما تکمیل شده‌اند
                </p>
                <Link to="/order">
                  <Button>
                    <Package className="ml-2 h-4 w-4" />
                    ثبت سفارش جدید
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            groupedOrders.active.map(renderOrderCard)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {groupedOrders.completed.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="mb-4 h-16 w-16 text-muted-foreground/50" />
                <h3 className="mb-2">سفارش تکمیل شده‌ای وجود ندارد</h3>
                <p className="text-sm text-muted-foreground">
                  هنوز سفارشی تکمیل نشده است
                </p>
              </CardContent>
            </Card>
          ) : (
            groupedOrders.completed.map(renderOrderCard)
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {groupedOrders.cancelled.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <XCircle className="mb-4 h-16 w-16 text-muted-foreground/50" />
                <h3 className="mb-2">سفارش لغو شده‌ای وجود ندارد</h3>
                <p className="text-sm text-muted-foreground">
                  خوشبختانه هیچ سفارشی لغو نشده است
                </p>
              </CardContent>
            </Card>
          ) : (
            groupedOrders.cancelled.map(renderOrderCard)
          )}
        </TabsContent>
      </Tabs>

      {/* دیالوگ جزئیات */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto" dir="rtl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  جزئیات سفارش #{selectedOrder.id}
                </DialogTitle>
                <DialogDescription>اطلاعات کامل سفارش</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                  <div>
                    <div className="text-sm text-muted-foreground">وضعیت</div>
                    <Badge
                      className={`mt-1 ${getStatusColor(selectedOrder.status)}`}
                      variant="outline"
                    >
                      {getStatusLabel(selectedOrder.status)}
                    </Badge>
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

                <div>
                  <h4 className="mb-3">مسیر</h4>
                  <div className="space-y-3">
                    <div className="rounded-lg border p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{selectedOrder.originAddress.title || 'مبدا'}</span>
                      </div>
                      <p className="mr-6 text-sm text-muted-foreground">
                        {selectedOrder.originAddress.fullAddress}
                      </p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <span className="font-medium">{selectedOrder.destinationAddress.title || 'مقصد'}</span>
                      </div>
                      <p className="mr-6 text-sm text-muted-foreground">
                        {selectedOrder.destinationAddress.fullAddress}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3">جزئیات خدمات</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border p-3">
                      <div className="text-sm text-muted-foreground">نوع وسیله</div>
                      <div className="mt-1 font-medium">
                        {vehicleTypeLabels[selectedOrder.details.vehicleType]}
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm text-muted-foreground">تعداد کارگر</div>
                      <div className="mt-1 font-medium">
                        {selectedOrder.details.workerCount} نفر
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm text-muted-foreground">مسافت</div>
                      <div className="mt-1 font-medium">{selectedOrder.distanceKm} کیلومتر</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm text-muted-foreground">زمان تخمینی</div>
                      <div className="mt-1 font-medium">
                        {selectedOrder.estimatedDuration} دقیقه
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3">اطلاعات مالی</h4>
                  <div className="space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">قیمت تخمینی</span>
                      <span>{selectedOrder.estimatedPrice?.toLocaleString()} تومان</span>
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
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  بستن
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* دیالوگ لغو سفارش */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              لغو سفارش
            </DialogTitle>
            <DialogDescription>
              آیا از لغو سفارش #{selectedOrder?.id} اطمینان دارید؟
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cancelReason">دلیل لغو (اختیاری)</Label>
              <Textarea
                id="cancelReason"
                placeholder="لطفاً دلیل لغو سفارش را بنویسید..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
              />
            </div>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>توجه</AlertTitle>
              <AlertDescription>
                با لغو سفارش، ممکن است مشمول جریمه شوید
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              انصراف
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              تایید لغو
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* دیالوگ امتیازدهی */}
      <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              ثبت امتیاز و نظر
            </DialogTitle>
            <DialogDescription>
              لطفاً تجربه خود را با ما به اشتراک بگذارید
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>امتیاز شما</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-10 w-10 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ratingComment">نظر شما (اختیاری)</Label>
              <Textarea
                id="ratingComment"
                placeholder="نظر خود را در مورد کیفیت خدمات بنویسید..."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRatingDialogOpen(false)}>
              انصراف
            </Button>
            <Button onClick={submitRating} disabled={rating === 0}>
              <Star className="ml-2 h-4 w-4" />
              ثبت امتیاز
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};