import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  MessageSquare,
  Star,
  Truck,
  User,
  Clock,
  Navigation,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Info,
  Package,
  ArrowRight,
  RefreshCw,
  Share2,
  Download,
  DollarSign,
  Calendar,
  Shield,
  TrendingUp,
  Home,
  Building2,
  Timer,
  Activity,
  Send,
  Paperclip,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Progress } from '../../components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { Order, OrderStatus, VehicleType } from '../../types';
import { useLocationTracking } from '../../lib/hooks/useLocationTracking';
import { MapComponent } from '../../components/order/MapComponent';

// Mock Data - اطلاعات سفارش
const mockOrder: Order = {
  id: '1',
  customerId: 'c1',
  customerPhone: '09121234567',
  customerName: 'مریم احمدی',
  serviceCategoryId: 's1',
  driverId: 'd1',
  status: OrderStatus.IN_PROGRESS,
  preferredDateTime: new Date('2024-11-09T10:00:00'),
  createdAt: new Date('2024-11-08T15:30:00'),
  estimatedPrice: 2500000,
  details: {
    needsPacking: true,
    needsWorkers: true,
    workerCount: 2,
    vehicleType: VehicleType.NISSAN,
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
};

// Mock Data - اطلاعات راننده
const mockDriver = {
  id: 'd1',
  name: 'علی محمدی',
  phone: '09121111111',
  rating: 4.8,
  totalRides: 234,
  vehicleModel: 'نیسان تک کابین مدل 1401',
  vehiclePlate: 'ت 123 ب 45',
  profileImage: '',
};

// Mock Data - موقعیت فعلی راننده
interface DriverLocation {
  lat: number;
  lng: number;
  heading: number; // جهت حرکت
  speed: number; // سرعت (کیلومتر در ساعت)
  lastUpdate: Date;
}

const vehicleTypeLabels: Record<VehicleType, string> = {
  [VehicleType.PICKUP]: 'وانت',
  [VehicleType.NISSAN]: 'نیسان',
  [VehicleType.TRUCK]: 'کامیون',
  [VehicleType.HEAVY_TRUCK]: 'خاور',
};

// Interface برای پیام‌ها
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'driver';
  message: string;
  attachment?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  };
  timestamp: Date;
  isRead: boolean;
}

// Mock Data - تاریخچه پیام‌ها
const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: 'd1',
    senderName: 'علی محمدی',
    senderType: 'driver',
    message: 'سلام، من الان در مسیر هستم. حدود 15 دقیقه دیگر می‌رسم.',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 دقیقه پیش
    isRead: true,
  },
  {
    id: 'm2',
    senderId: 'c1',
    senderName: 'مریم احمدی',
    senderType: 'customer',
    message: 'سلام، ممنون. در انتظارم.',
    timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 دقیقه پیش
    isRead: true,
  },
  {
    id: 'm3',
    senderId: 'd1',
    senderName: 'علی محمدی',
    senderType: 'driver',
    message: 'لطفاً شماره واحد را بهم بگید تا راحت‌تر پیدا کنم.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 دقیقه پیش
    isRead: false,
  },
];

export const OrderTracking = () => {
  const { orderId } = useParams();
  const [order] = useState<Order>(mockOrder);
  const [driver] = useState(mockDriver);
  const [showDetails, setShowDetails] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [driverLocation, setDriverLocation] = useState<DriverLocation>({
    lat: 35.6950,
    lng: 51.3950,
    heading: 45,
    speed: 35,
    lastUpdate: new Date(),
  });

  // State برای سیستم پیام‌رسانی
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // شبیه‌سازی به‌روزرسانی موقعیت راننده
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
        heading: prev.heading + (Math.random() - 0.5) * 10,
        speed: Math.max(0, prev.speed + (Math.random() - 0.5) * 5),
        lastUpdate: new Date(),
      }));
    }, 5000); // هر 5 ثانیه

    return () => clearInterval(interval);
  }, []);

  // محاسبه زمان تخمینی رسیدن
  const calculateETA = () => {
    const distanceToDestination = 5.2; // کیلومتر
    const averageSpeed = driverLocation.speed || 30;
    const timeInMinutes = Math.round((distanceToDestination / averageSpeed) * 60);
    return timeInMinutes;
  };

  const eta = calculateETA();

  // محاسبه پیشرفت سفر
  const calculateProgress = () => {
    // فرض می‌کنیم 60% مسیر طی شده
    return 60;
  };

  const progress = calculateProgress();

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.success('اطلاعات به‌روزرسانی شد');
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleCallDriver = () => {
    toast.info(`در حال برقراری تماس با ${driver.name}...`);
  };

  const handleMessageDriver = () => {
    setMessageDialogOpen(true);
  };

  const handleShare = () => {
    toast.success('لینک پیگیری کپی شد');
  };

  // Handler برای ارسال پیام
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) {
      toast.error('لطفاً پیام خود را بنویسید یا فایلی را انتخاب کنید');
      return;
    }

    setIsSendingMessage(true);

    // شبیه‌سازی ارسال پیام
    setTimeout(() => {
      const message: Message = {
        id: `m${Date.now()}`,
        senderId: order.customerId,
        senderName: order.customerName,
        senderType: 'customer',
        message: newMessage,
        attachment: selectedFile
          ? {
              type: selectedFile.type.startsWith('image/') ? 'image' : 'file',
              url: URL.createObjectURL(selectedFile),
              name: selectedFile.name,
            }
          : undefined,
        timestamp: new Date(),
        isRead: false,
      };

      setMessages([...messages, message]);
      setNewMessage('');
      setSelectedFile(null);
      setIsSendingMessage(false);
      toast.success('پیام شما با موفقیت ارسال شد');
    }, 1000);
  };

  // Handler برای انتخاب فایل
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // بررسی حجم فایل (حداکثر 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم فایل نباید بیشتر از 5 مگابایت باشد');
        return;
      }
      setSelectedFile(file);
      toast.success(`فایل ${file.name} انتخاب شد`);
    }
  };

  // Helper function برای فرمت زمان
  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'الان';
    if (minutes < 60) return `${minutes} دقیقه پیش`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ساعت پیش`;
    
    return date.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' });
  };

  // تعداد پیام‌های خوانده نشده
  const unreadCount = messages.filter(m => !m.isRead && m.senderType === 'driver').length;

  // تایم‌لاین وضعیت سفارش
  const orderTimeline = [
    {
      status: 'ثبت سفارش',
      time: new Date('2024-11-08T15:30:00'),
      completed: true,
      icon: Package,
    },
    {
      status: 'تایید سفارش',
      time: new Date('2024-11-08T15:45:00'),
      completed: true,
      icon: CheckCircle,
    },
    {
      status: 'اختصاص راننده',
      time: new Date('2024-11-09T09:00:00'),
      completed: true,
      icon: User,
    },
    {
      status: 'راننده در مسیر',
      time: new Date('2024-11-09T09:30:00'),
      completed: true,
      icon: Truck,
      active: true,
    },
    {
      status: 'تحویل بار',
      time: null,
      completed: false,
      icon: MapPin,
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="flex items-center gap-2">
              <Navigation className="h-8 w-8 text-primary" />
              پیگیری لحظه‌ای
            </h1>
            <Badge className="bg-orange-100 text-orange-800">زنده</Badge>
          </div>
          <p className="text-muted-foreground">سفارش #{orderId}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="ml-2 h-4 w-4" />
            اشتراک
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`ml-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            بروزرسانی
          </Button>
        </div>
      </div>

      {/* هشدار زنده */}
      <Alert className="border-orange-200 bg-orange-50">
        <Activity className="h-4 w-4 animate-pulse text-orange-600" />
        <AlertTitle>پیگیری زنده</AlertTitle>
        <AlertDescription>
          موقعیت راننده هر 5 ثانیه به‌روز می‌شود • آخرین بروزرسانی:{' '}
          {driverLocation.lastUpdate.toLocaleTimeString('fa-IR')}
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* بخش اصلی - نقشه */}
        <div className="space-y-6 lg:col-span-2">
          {/* زمان تخمینی رسیدن */}
          <Card className="border-primary bg-gradient-to-l from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Timer className="h-4 w-4" />
                    <span>زمان تخمینی رسیدن</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">{eta}</span>
                    <span className="text-lg text-muted-foreground">دقیقه</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm text-muted-foreground">سرعت فعلی</div>
                  <div className="mt-1">
                    <span className="text-2xl font-bold">{Math.round(driverLocation.speed)}</span>
                    <span className="text-sm text-muted-foreground"> km/h</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">پیشرفت سفر</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* نقشه */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                نقشه مسیر
              </CardTitle>
              <CardDescription>موقعیت لحظه‌ای راننده و مسیر حرکت</CardDescription>
            </CardHeader>
            <CardContent>
              {/* شبیه‌سازی نقشه */}
              <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                  <div className="relative h-full w-full">
                    {/* نقطه مبدا */}
                    <div
                      className="absolute"
                      style={{ top: '20%', right: '30%' }}
                    >
                      <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 shadow-lg">
                          <Home className="h-5 w-5 text-white" />
                        </div>
                        <div className="absolute -bottom-1 right-full mr-2 whitespace-nowrap rounded bg-white px-2 py-1 text-xs font-medium shadow">
                          {order.originAddress.title}
                        </div>
                      </div>
                    </div>

                    {/* نقطه مقصد */}
                    <div
                      className="absolute"
                      style={{ top: '70%', left: '25%' }}
                    >
                      <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 shadow-lg">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div className="absolute -bottom-1 left-full ml-2 whitespace-nowrap rounded bg-white px-2 py-1 text-xs font-medium shadow">
                          {order.destinationAddress.title}
                        </div>
                      </div>
                    </div>

                    {/* موقعیت راننده */}
                    <div
                      className="absolute transition-all duration-1000"
                      style={{ top: '45%', right: '40%' }}
                    >
                      <div className="relative">
                        {/* دایره انیمیشن */}
                        <div className="absolute inset-0 -m-4 animate-ping rounded-full bg-primary/30" />
                        {/* آیکون راننده */}
                        <div
                          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-xl"
                          style={{
                            transform: `rotate(${driverLocation.heading}deg)`,
                          }}
                        >
                          <Truck className="h-6 w-6 text-white" />
                        </div>
                        {/* بادج نام راننده */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs font-medium text-white shadow-lg">
                          {driver.name}
                        </div>
                      </div>
                    </div>

                    {/* خط مسیر */}
                    <svg className="absolute inset-0 h-full w-full">
                      <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.8 }} />
                          <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 30% 20% Q 50% 40%, 75% 70%"
                        stroke="url(#pathGradient)"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="10,5"
                      />
                    </svg>

                    {/* اطلاعات نقشه */}
                    <div className="absolute bottom-4 left-4 space-y-2">
                      <div className="rounded-lg bg-white p-2 shadow-md">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                            <span>مبدا</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-primary" />
                            <span>راننده</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            <span>مقصد</span>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg bg-white p-2 text-xs shadow-md">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 text-primary" />
                          <span>فاصله تا مقصد: 5.2 کیلومتر</span>
                        </div>
                      </div>
                    </div>

                    {/* دکمه‌های کنترل نقشه */}
                    <div className="absolute right-4 top-4 space-y-2">
                      <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </Button>
                      <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* اطلاعات مسیر */}
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border bg-muted/50 p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Navigation className="h-4 w-4" />
                    <span>مسافت کل</span>
                  </div>
                  <div className="mt-1 font-medium">{order.distanceKm} کیلومتر</div>
                </div>
                <div className="rounded-lg border bg-muted/50 p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>زمان تخمینی</span>
                  </div>
                  <div className="mt-1 font-medium">{order.estimatedDuration} دقیقه</div>
                </div>
                <div className="rounded-lg border bg-muted/50 p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>توقف‌گاه‌ها</span>
                  </div>
                  <div className="mt-1 font-medium">
                    {order.locationDetails?.stopCount || 0} مکان
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* تایم‌لاین سفارش */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    وضعیت سفارش
                  </CardTitle>
                  <CardDescription>پیشرفت مراحل سفارش</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            {showDetails && (
              <CardContent>
                <div className="relative space-y-6 border-r-2 border-muted pr-6">
                  {orderTimeline.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="relative">
                        {/* نقطه */}
                        <div
                          className={`absolute -right-[33px] flex h-8 w-8 items-center justify-center rounded-full ${
                            item.active
                              ? 'animate-pulse bg-primary'
                              : item.completed
                              ? 'bg-green-500'
                              : 'bg-muted'
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 ${
                              item.completed || item.active ? 'text-white' : 'text-muted-foreground'
                            }`}
                          />
                        </div>

                        {/* محتوا */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium ${
                                item.active
                                  ? 'text-primary'
                                  : item.completed
                                  ? 'text-foreground'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {item.status}
                            </span>
                            {item.active && (
                              <Badge className="bg-primary/10 text-primary">در حال انجام</Badge>
                            )}
                            {item.completed && !item.active && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          {item.time && (
                            <div className="text-xs text-muted-foreground">
                              {item.time.toLocaleDateString('fa-IR', {
                                month: 'long',
                                day: 'numeric',
                              })}{' '}
                              • {item.time.toLocaleTimeString('fa-IR')}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* ساید بار */}
        <div className="space-y-6">
          {/* اطلاعات راننده */}
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5" />
                اطلاعات راننده
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={driver.profileImage} />
                  <AvatarFallback className="bg-primary text-lg text-white">
                    {driver.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4>{driver.name}</h4>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{driver.rating}</span>
                    <span className="text-muted-foreground">• {driver.totalRides} سفر</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">وسیله نقلیه</span>
                  <span className="font-medium">{driver.vehicleModel}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">پلاک</span>
                  <Badge variant="outline" className="font-mono">
                    {driver.vehiclePlate}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid gap-2">
                <Button onClick={handleCallDriver} className="gap-2">
                  <Phone className="h-4 w-4" />
                  تماس با راننده
                </Button>
                <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2 relative">
                      <MessageSquare className="h-4 w-4" />
                      ارسال پیام
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-2 -left-2 h-5 w-5 rounded-full bg-red-500 p-0 flex items-center justify-center text-xs">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh]" dir="rtl">
                    <DialogHeader>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={driver.profileImage} />
                          <AvatarFallback className="bg-primary text-white">
                            {driver.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <DialogTitle>گفتگو با {driver.name}</DialogTitle>
                          <DialogDescription>
                            راننده سفارش شماره #{order.id}
                          </DialogDescription>
                        </div>
                        <Badge variant="outline" className="gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {driver.rating}
                        </Badge>
                      </div>
                    </DialogHeader>

                    {/* تاریخچه پیام‌ها */}
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                      <div className="space-y-4">
                        {messages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <MessageSquare className="h-12 w-12 text-muted-foreground opacity-50" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              هنوز پیامی رد و بدل نشده است
                            </p>
                            <p className="text-xs text-muted-foreground">
                              اولین پیام را ارسال کنید
                            </p>
                          </div>
                        ) : (
                          messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex gap-3 ${
                                message.senderType === 'customer'
                                  ? 'flex-row-reverse'
                                  : ''
                              }`}
                            >
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarFallback
                                  className={
                                    message.senderType === 'customer'
                                      ? 'bg-primary text-white'
                                      : 'bg-muted'
                                  }
                                >
                                  {message.senderName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>

                              <div
                                className={`flex-1 space-y-1 ${
                                  message.senderType === 'customer'
                                    ? 'text-right'
                                    : ''
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium">
                                    {message.senderName}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatMessageTime(message.timestamp)}
                                  </span>
                                  {!message.isRead && message.senderType === 'driver' && (
                                    <Badge variant="destructive" className="h-4 text-[10px] px-1">
                                      جدید
                                    </Badge>
                                  )}
                                </div>

                                <div
                                  className={`inline-block rounded-lg px-3 py-2 text-sm ${
                                    message.senderType === 'customer'
                                      ? 'bg-primary text-white'
                                      : 'bg-muted'
                                  }`}
                                >
                                  <p className="whitespace-pre-wrap break-words">
                                    {message.message}
                                  </p>

                                  {/* ضمیمه */}
                                  {message.attachment && (
                                    <div className="mt-2 pt-2 border-t border-white/20">
                                      {message.attachment.type === 'image' ? (
                                        <div className="relative overflow-hidden rounded">
                                          <img
                                            src={message.attachment.url}
                                            alt="ضمیمه"
                                            className="max-w-[200px] rounded"
                                          />
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-2 text-xs">
                                          <Paperclip className="h-3 w-3" />
                                          <span>{message.attachment.name}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>

                    {/* فرم ارسال پیام */}
                    <div className="space-y-3">
                      {/* نمایش فایل انتخاب شده */}
                      {selectedFile && (
                        <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                          <div className="flex items-center gap-2">
                            {selectedFile.type.startsWith('image/') ? (
                              <ImageIcon className="h-4 w-4 text-primary" />
                            ) : (
                              <Paperclip className="h-4 w-4 text-primary" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{selectedFile.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(selectedFile.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setSelectedFile(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {/* Input پیام */}
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="پیام خود را بنویسید..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className="min-h-[80px] resize-none"
                          disabled={isSendingMessage}
                        />
                      </div>

                      {/* دکمه‌های اکشن */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex gap-2">
                          <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={handleFileSelect}
                          />
                          <label htmlFor="file-upload">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              asChild
                            >
                              <span>
                                <Paperclip className="h-4 w-4" />
                                انتخاب فایل
                              </span>
                            </Button>
                          </label>
                          <p className="text-xs text-muted-foreground flex items-center">
                            حداکثر 5 مگابایت
                          </p>
                        </div>

                        <Button
                          onClick={handleSendMessage}
                          disabled={isSendingMessage || (!newMessage.trim() && !selectedFile)}
                          className="gap-2"
                        >
                          {isSendingMessage ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              در حال ارسال...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              ارسال پیام
                            </>
                          )}
                        </Button>
                      </div>

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          پیام‌های شما به صورت آنی برای راننده ارسال می‌شود. برای مکالمات فوری از تماس تلفنی استفاده کنید.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* جزئیات سفارش */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-5 w-5" />
                جزئیات سفارش
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="rounded-lg border bg-muted/50 p-3">
                  <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 text-green-600" />
                    <span>مبدا</span>
                  </div>
                  <div className="text-sm font-medium">{order.originAddress.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {order.originAddress.fullAddress}
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="rounded-lg border bg-muted/50 p-3">
                  <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 text-red-600" />
                    <span>مقصد</span>
                  </div>
                  <div className="text-sm font-medium">{order.destinationAddress.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {order.destinationAddress.fullAddress}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">نوع وسیله</span>
                  <span className="font-medium">
                    {vehicleTypeLabels[order.details.vehicleType]}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">تعداد کارگر</span>
                  <span className="font-medium">{order.details.workerCount} نفر</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">تاریخ و زمان</span>
                  <span className="font-medium">
                    {new Date(order.preferredDateTime).toLocaleDateString('fa-IR', {
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    •{' '}
                    {new Date(order.preferredDateTime).toLocaleTimeString('fa-IR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">قیمت تخمینی</span>
                  <span className="font-medium">
                    {order.estimatedPrice?.toLocaleString()} تومان
                  </span>
                </div>
                <div className="rounded-lg bg-primary/10 p-3 text-center">
                  <div className="text-xs text-muted-foreground">شماره سفارش</div>
                  <div className="mt-1 font-mono text-sm font-bold text-primary">#{order.id}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* دکمه‌های اضطراری */}
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-red-600">
                <Shield className="h-5 w-5" />
                امکانات اضطراری
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <AlertCircle className="h-4 w-4" />
                    گزارش مشکل
                  </Button>
                </DialogTrigger>
                <DialogContent dir="rtl">
                  <DialogHeader>
                    <DialogTitle>گزارش مشکل</DialogTitle>
                    <DialogDescription>
                      لطفاً مشکل خود را توضیح دهید. تیم پشتیبانی در اسرع وقت پاسخگو خواهند بود.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        برای مشکلات اضطاری با شماره 021-88776655 تماس بگیرید
                      </AlertDescription>
                    </Alert>
                    <Textarea
                      placeholder="توضیح مشکل..."
                      className="h-24"
                    />
                    <Button className="w-full">ارسال گزارش</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
                onClick={() => toast.error('تماس با پشتیبانی اضطراری...')}
              >
                <Phone className="h-4 w-4" />
                تماس اضطراری
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Download className="h-4 w-4" />
                    دانلود رسید
                  </Button>
                </DialogTrigger>
                <DialogContent dir="rtl">
                  <DialogHeader>
                    <DialogTitle>دانلود رسید</DialogTitle>
                    <DialogDescription>
                      رسید سفارش شما آماده دانلود است
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>شماره سفارش:</span>
                          <span className="font-medium">#{order.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>تاریخ:</span>
                          <span className="font-medium">
                            {new Date().toLocaleDateString('fa-IR')}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>مبلغ:</span>
                          <span>{order.estimatedPrice?.toLocaleString()} تومان</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      دانلود PDF
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* راهنمای سریع */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="h-5 w-5" />
                راهنما
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <p>موقعیت راننده ر 5 ثانیه به‌روزرسانی می‌شود</p>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <p>می‌توانید در هر زمان با راننده تماس بگیرید</p>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <p>زمان رسیدن به صورت خودکار محاسبه می‌شود</p>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <p>برای هرگونه مشکل با پشتیبانی تماس بگیرید</p>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <p>پس از تحویل بار، امتیاز خود را ثبت کنید</p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* بازگشت به سفارشات */}
          <Link to="/customer/orders">
            <Button variant="outline" className="w-full gap-2">
              <Package className="h-4 w-4" />
              بازگشت به سفارشات
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};