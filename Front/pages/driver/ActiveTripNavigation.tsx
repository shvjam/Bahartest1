import { useState, useEffect } from 'react';
import {
  Navigation,
  MapPin,
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
  Target,
  Play,
  Pause,
  Flag,
  DollarSign,
  Camera,
  User,
  Home,
  Package,
  TrendingUp,
  Activity,
  Gauge,
  ChevronRight,
  X,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { ScrollArea } from '../../components/ui/scroll-area';

// Mock Active Trip Data
const mockActiveTrip = {
  id: 'trip-001',
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
    floor: 3,
    elevator: true,
    contactPerson: 'علی محمدی',
    contactPhone: '09123456789',
  },
  destination: {
    address: 'تهران، منطقه 2، خیابان ولیعصر، پلاک 456',
    lat: 35.7219,
    lng: 51.4185,
    floor: 2,
    elevator: false,
    contactPerson: 'زهرا محمدی',
    contactPhone: '09121234567',
  },
  totalDistance: 12.5,
  estimatedDuration: 45,
  startTime: new Date('2024-11-08T10:00:00'),
  price: 1200000,
  commission: 180000,
  serviceType: 'اسباب‌کشی منزل',
  items: ['یخچال', 'ماشین لباسشویی', 'مبل راحتی', 'میز ناهارخوری'],
  notes: 'لطفاً دقیق باشید، لوازم شکستنی داریم',
  workers: 2,
};

// Trip Stages
const tripStages = [
  { id: 1, key: 'started', label: 'شروع سفر', icon: Play },
  { id: 2, key: 'en-route-origin', label: 'در مسیر مبدا', icon: Navigation },
  { id: 3, key: 'arrived-origin', label: 'رسیدن به مبدا', icon: MapPin },
  { id: 4, key: 'loading', label: 'بارگیری', icon: Package },
  { id: 5, key: 'en-route-destination', label: 'در مسیر مقصد', icon: Truck },
  { id: 6, key: 'arrived-destination', label: 'رسیدن به مقصد', icon: Target },
  { id: 7, key: 'unloading', label: 'تخلیه بار', icon: Package },
  { id: 8, key: 'completed', label: 'اتمام سفر', icon: Flag },
];

export const ActiveTripNavigation = () => {
  const [currentStage, setCurrentStage] = useState(5); // Stage 5: در مسیر مقصد
  const [isPaused, setIsPaused] = useState(false);
  const [isTracking, setIsTracking] = useState(true);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const [showCustomerInfoDialog, setShowCustomerInfoDialog] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [issueDescription, setIssueDescription] = useState('');

  // Real-time trip stats
  const [tripStats, setTripStats] = useState({
    elapsedTime: 25, // دقیقه
    remainingDistance: 6.8, // کیلومتر
    remainingTime: 20, // دقیقه
    currentSpeed: 42, // کیلومتر در ساعت
    avgSpeed: 38,
    distanceCovered: 5.7, // کیلومتر
  });

  // Simulate real-time updates
  useEffect(() => {
    if (!isPaused && isTracking) {
      const interval = setInterval(() => {
        setTripStats((prev) => ({
          ...prev,
          elapsedTime: prev.elapsedTime + 0.016, // 1 second
          remainingDistance: Math.max(0, prev.remainingDistance - 0.01),
          remainingTime: Math.max(0, prev.remainingTime - 0.016),
          currentSpeed: Math.floor(Math.random() * 20) + 35, // 35-55 km/h
          distanceCovered: prev.distanceCovered + 0.01,
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPaused, isTracking]);

  const progressPercentage = (currentStage / tripStages.length) * 100;
  const distanceProgress = (tripStats.distanceCovered / mockActiveTrip.totalDistance) * 100;

  const handleNextStage = () => {
    if (currentStage < tripStages.length) {
      setCurrentStage(currentStage + 1);
      toast.success(`مرحله ${tripStages[currentStage].label} تکمیل شد`);

      if (currentStage === tripStages.length - 1) {
        setShowCompleteDialog(true);
        setIsTracking(false);
      }
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'سفر از سر گرفته شد' : 'سفر متوقف شد');
  };

  const handleCompleteTrip = () => {
    toast.success('سفر با موفقیت تکمیل شد');
    setShowCompleteDialog(false);
    // Navigate to earnings or dashboard
  };

  const handleReportIssue = () => {
    toast.success('مشکل گزارش شد');
    setShowIssueDialog(false);
    setIssueDescription('');
  };

  const handleCallCustomer = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleOpenExternalMap = () => {
    const lat = mockActiveTrip.destination.lat;
    const lng = mockActiveTrip.destination.lng;
    window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
  };

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hrs > 0 ? `${hrs}س ${mins}د` : `${mins} دقیقه`;
  };

  const currentStageData = tripStages[currentStage - 1];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Navigation className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="flex items-center gap-2">
                  سفر فعال
                  <Badge variant={isPaused ? 'secondary' : 'default'} className="gap-1">
                    {isPaused ? (
                      <>
                        <Pause className="h-3 w-3" />
                        متوقف
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" />
                        در حال انجام
                      </>
                    )}
                  </Badge>
                </h2>
                <p className="text-sm text-muted-foreground">{mockActiveTrip.orderNumber}</p>
              </div>
            </div>
            <Button
              variant={isPaused ? 'default' : 'outline'}
              size="sm"
              onClick={handlePauseResume}
              className="gap-2"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {isPaused ? 'ادامه' : 'توقف'}
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="container mx-auto space-y-4 p-4">
          {/* Map Section */}
          <Card className="overflow-hidden">
            <div className="relative aspect-[16/9] bg-gradient-to-br from-blue-50 to-blue-100">
              {/* Simulated Map */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative mx-auto mb-4 h-48 w-48">
                    {/* Animated route */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative h-32 w-full">
                        {/* Origin */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 shadow-lg">
                            <Home className="h-6 w-6 text-white" />
                          </div>
                          <p className="mt-1 text-xs font-medium">مبدا</p>
                        </div>

                        {/* Route line */}
                        <div className="absolute left-12 right-12 top-1/2 h-1 -translate-y-1/2 bg-gradient-to-r from-green-500 via-blue-500 to-red-500">
                          {/* Current position */}
                          <div
                            className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000"
                            style={{ left: `${distanceProgress}%` }}
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg animate-pulse">
                              <Truck className="h-4 w-4 text-primary-foreground" />
                            </div>
                          </div>
                        </div>

                        {/* Destination */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 shadow-lg">
                            <Target className="h-6 w-6 text-white" />
                          </div>
                          <p className="mt-1 text-xs font-medium">مقصد</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleOpenExternalMap} variant="secondary" size="sm" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    باز کردن در نقشه
                  </Button>
                </div>
              </div>

              {/* Live Stats Overlay */}
              <div className="absolute left-4 top-4 space-y-2">
                <div className="flex items-center gap-2 rounded-lg bg-background/90 px-3 py-2 text-sm shadow-lg backdrop-blur">
                  <Gauge className="h-4 w-4 text-primary" />
                  <span className="font-bold">{tripStats.currentSpeed}</span>
                  <span className="text-muted-foreground">km/h</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-background/90 px-3 py-2 text-sm shadow-lg backdrop-blur">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="font-bold">{Math.floor(tripStats.elapsedTime)}</span>
                  <span className="text-muted-foreground">دقیقه</span>
                </div>
              </div>

              {/* Distance Remaining */}
              <div className="absolute right-4 top-4">
                <div className="rounded-lg bg-background/90 p-3 text-center shadow-lg backdrop-blur">
                  <p className="text-3xl font-bold text-primary">
                    {tripStats.remainingDistance.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">کیلومتر باقیمانده</p>
                </div>
              </div>

              {/* ETA */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-lg bg-background/90 px-4 py-2 shadow-lg backdrop-blur">
                  <p className="text-center text-sm text-muted-foreground">زمان رسیدن تقریبی</p>
                  <p className="text-center text-xl font-bold text-primary">
                    {formatTime(tripStats.remainingTime)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid gap-3 md:grid-cols-4">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">طی شده</p>
                    <p className="font-bold">{tripStats.distanceCovered.toFixed(1)} km</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">زمان سپری شده</p>
                    <p className="font-bold">{formatTime(tripStats.elapsedTime)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">میانگین سرعت</p>
                    <p className="font-bold">{tripStats.avgSpeed} km/h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                    <DollarSign className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">کمیسیون</p>
                    <p className="font-bold">{(mockActiveTrip.commission / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Stage & Progress */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">مرحله فعلی</CardTitle>
                  <CardDescription>
                    {currentStageData.label} - مرحله {currentStage} از {tripStages.length}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="gap-2">
                  <currentStageData.icon className="h-4 w-4" />
                  {Math.round(progressPercentage)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progressPercentage} className="h-3" />

              {/* Stage Timeline */}
              <div className="space-y-2">
                {tripStages.map((stage, index) => {
                  const isCompleted = index < currentStage - 1;
                  const isActive = index === currentStage - 1;
                  const Icon = stage.icon;

                  return (
                    <div
                      key={stage.id}
                      className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                        isActive ? 'border-primary bg-primary/5' : isCompleted ? 'bg-muted/50' : ''
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          isCompleted
                            ? 'bg-green-100'
                            : isActive
                            ? 'bg-primary'
                            : 'bg-muted'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Icon
                            className={`h-4 w-4 ${
                              isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                            }`}
                          />
                        )}
                      </div>
                      <span
                        className={`flex-1 text-sm ${
                          isActive ? 'font-medium' : 'text-muted-foreground'
                        }`}
                      >
                        {stage.label}
                      </span>
                      {isActive && (
                        <Badge variant="default" className="gap-1">
                          <Activity className="h-3 w-3" />
                          فعال
                        </Badge>
                      )}
                      {isCompleted && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  );
                })}
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button
                  onClick={handleNextStage}
                  className="flex-1 gap-2"
                  disabled={isPaused || currentStage >= tripStages.length}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {currentStage === tripStages.length ? 'سفر تکمیل شد' : 'مرحله بعد'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">اطلاعات مشتری</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomerInfoDialog(true)}
                >
                  جزئیات بیشتر
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={mockActiveTrip.customer.avatar} />
                    <AvatarFallback>
                      {mockActiveTrip.customer.name.split(' ')[0][0]}
                      {mockActiveTrip.customer.name.split(' ')[1]?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{mockActiveTrip.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{mockActiveTrip.customer.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCallCustomer(mockActiveTrip.customer.phone)}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {mockActiveTrip.notes && (
                <>
                  <Separator />
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{mockActiveTrip.notes}</AlertDescription>
                  </Alert>
                </>
              )}
            </CardContent>
          </Card>

          {/* Route Info */}
          <div className="grid gap-3 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                  </div>
                  مبدا
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">{mockActiveTrip.origin.address}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>طبقه {mockActiveTrip.origin.floor}</span>
                  <span>•</span>
                  <span>{mockActiveTrip.origin.elevator ? 'آسانسور دارد' : 'بدون آسانسور'}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">تماس:</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => handleCallCustomer(mockActiveTrip.origin.contactPhone)}
                  >
                    {mockActiveTrip.origin.contactPhone}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                    <div className="h-2 w-2 rounded-full bg-red-600" />
                  </div>
                  مقصد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">{mockActiveTrip.destination.address}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>طبقه {mockActiveTrip.destination.floor}</span>
                  <span>•</span>
                  <span>
                    {mockActiveTrip.destination.elevator ? 'آسانسور دارد' : 'بدون آسانسور'}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">تماس:</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => handleCallCustomer(mockActiveTrip.destination.contactPhone)}
                  >
                    {mockActiveTrip.destination.contactPhone}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-3 md:grid-cols-3">
            <Button variant="outline" onClick={() => setShowIssueDialog(true)} className="gap-2">
              <AlertCircle className="h-4 w-4" />
              گزارش مشکل
            </Button>
            <Button variant="outline" className="gap-2">
              <Camera className="h-4 w-4" />
              ثبت عکس
            </Button>
            <Button variant="outline" onClick={handleOpenExternalMap} className="gap-2">
              <Navigation className="h-4 w-4" />
              مسیریابی خارجی
            </Button>
          </div>

          {/* Bottom spacing */}
          <div className="h-4" />
        </div>
      </ScrollArea>

      {/* Dialog: Customer Full Info */}
      <Dialog open={showCustomerInfoDialog} onOpenChange={setShowCustomerInfoDialog}>
        <DialogContent dir="rtl" className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>جزئیات کامل سفارش</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[600px] pr-4">
            <div className="space-y-4">
              {/* Customer */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">مشتری</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mockActiveTrip.customer.avatar} />
                      <AvatarFallback>
                        {mockActiveTrip.customer.name.split(' ')[0][0]}
                        {mockActiveTrip.customer.name.split(' ')[1]?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{mockActiveTrip.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{mockActiveTrip.customer.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">جزئیات خدمت</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">نوع خدمت:</span>
                    <span className="font-medium">{mockActiveTrip.serviceType}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">تعداد کارگر:</span>
                    <span className="font-medium">{mockActiveTrip.workers} نفر</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">مسافت کل:</span>
                    <span className="font-medium">{mockActiveTrip.totalDistance} کیلومتر</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">زمان تخمینی:</span>
                    <span className="font-medium">{mockActiveTrip.estimatedDuration} دقیقه</span>
                  </div>
                </CardContent>
              </Card>

              {/* Items */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">لوازم حمل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockActiveTrip.items.map((item, index) => (
                      <Badge key={index} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Financial */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">اطلاعات مالی</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">کرایه کل:</span>
                    <span className="font-bold">
                      {mockActiveTrip.price.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">کمیسیون شما (15%):</span>
                    <span className="font-bold text-primary">
                      {mockActiveTrip.commission.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Dialog: Complete Trip */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              تکمیل سفر
            </DialogTitle>
            <DialogDescription>سفر را تکمیل و نهایی کنید</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                کمیسیون شما:{' '}
                <strong>{mockActiveTrip.commission.toLocaleString('fa-IR')} تومان</strong>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="completion-notes">یادداشت (اختیاری)</Label>
              <Textarea
                id="completion-notes"
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="توضیحات تکمیلی درباره سفر..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              انصراف
            </Button>
            <Button onClick={handleCompleteTrip} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              تکمیل سفر
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Report Issue */}
      <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              گزارش مشکل
            </DialogTitle>
            <DialogDescription>مشکل خود را شرح دهید</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="issue-description">شرح مشکل *</Label>
              <Textarea
                id="issue-description"
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="لطفاً مشکل را با جزئیات توضیح دهید..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIssueDialog(false)}>
              انصراف
            </Button>
            <Button onClick={handleReportIssue} variant="destructive" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              ثبت گزارش
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
