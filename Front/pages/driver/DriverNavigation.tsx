import { useState } from 'react';
import {
  Navigation,
  MapPin,
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
  User,
  Target,
  Play,
  Pause,
  Flag,
  DollarSign,
  Camera,
  FileText,
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

// Mock Active Order
const mockActiveOrder = {
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
  distance: 12.5,
  estimatedDuration: 45,
  currentDuration: 25,
  scheduledTime: new Date('2024-11-08T10:00:00'),
  startTime: new Date('2024-11-08T09:55:00'),
  price: 1200000,
  commission: 180000,
  status: 'in-transit', // pending, en-route-to-origin, loading, in-transit, unloading, completed
  serviceType: 'اسباب‌کشی منزل',
  items: ['یخچال', 'ماشین لباسشویی', 'مبل راحتی', 'میز ناهارخوری'],
  notes: 'لطفاً دقیق باشید، لوازم شکستنی داریم',
  workers: 2,
};

const navigationSteps = [
  { id: 1, label: 'شروع سفر', status: 'completed' },
  { id: 2, label: 'در مسیر مبدا', status: 'completed' },
  { id: 3, label: 'رسیدن به مبدا', status: 'completed' },
  { id: 4, label: 'بارگیری', status: 'completed' },
  { id: 5, label: 'در مسیر مقصد', status: 'active' },
  { id: 6, label: 'رسیدن به مقصد', status: 'pending' },
  { id: 7, label: 'تخلیه بار', status: 'pending' },
  { id: 8, label: 'اتمام سفر', status: 'pending' },
];

export const DriverNavigation = () => {
  const [currentStep, setCurrentStep] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [issueDescription, setIssueDescription] = useState('');

  const handleNextStep = () => {
    if (currentStep < navigationSteps.length) {
      setCurrentStep(currentStep + 1);
      toast.success(`مرحله ${navigationSteps[currentStep].label} تکمیل شد`);
      
      if (currentStep === navigationSteps.length - 1) {
        setShowCompleteDialog(true);
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
  };

  const handleReportIssue = () => {
    toast.success('مشکل گزارش شد');
    setShowIssueDialog(false);
    setIssueDescription('');
  };

  const handleCallCustomer = () => {
    window.location.href = `tel:${mockActiveOrder.customer.phone}`;
  };

  const handleOpenMap = () => {
    // Open in external map app
    const lat = mockActiveOrder.destination.lat;
    const lng = mockActiveOrder.destination.lng;
    window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
  };

  const progressPercentage = (currentStep / navigationSteps.length) * 100;

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر با وضعیت */}
      <Card className="border-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Navigation className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2>سفر در حال انجام</h2>
                <p className="text-sm text-muted-foreground">سفارش {mockActiveOrder.orderNumber}</p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-2">
              {isPaused ? (
                <>
                  <Pause className="h-3 w-3" />
                  متوقف شده
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  در حال انجام
                </>
              )}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* پیشرفت سفر */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">پیشرفت سفر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>مرحله {currentStep} از {navigationSteps.length}</span>
              <span className="font-bold">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="space-y-2">
            {navigationSteps.map((step, index) => {
              const isCompleted = index < currentStep - 1;
              const isActive = index === currentStep - 1;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                    isActive ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      isCompleted
                        ? 'bg-green-100'
                        : isActive
                        ? 'bg-primary/10'
                        : 'bg-muted'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : isActive ? (
                      <Clock className="h-4 w-4 text-primary" />
                    ) : (
                      <span className="text-sm text-muted-foreground">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`flex-1 text-sm ${
                      isActive ? 'font-medium' : isCompleted ? 'text-muted-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </span>
                  {isActive && (
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="h-3 w-3" />
                      در حال انجام
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button onClick={handleNextStep} className="flex-1 gap-2" disabled={isPaused}>
              <CheckCircle2 className="h-4 w-4" />
              مرحله بعد
            </Button>
            <Button
              variant={isPaused ? 'default' : 'outline'}
              onClick={handlePauseResume}
              className="gap-2"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {isPaused ? 'ادامه' : 'توقف'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* نقشه (شبیه‌سازی) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">مسیر</CardTitle>
            <Button variant="outline" size="sm" onClick={handleOpenMap} className="gap-2">
              <MapPin className="h-4 w-4" />
              باز کردن در نقشه
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="aspect-video overflow-hidden rounded-lg bg-muted">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">نقشه مسیریابی</p>
                <p className="text-xs text-muted-foreground">
                  مسافت باقیمانده: {mockActiveOrder.distance} کیلومتر
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                  <div className="h-2 w-2 rounded-full bg-green-600" />
                </div>
                <span className="text-sm font-medium">مبدا</span>
              </div>
              <p className="text-sm text-muted-foreground">{mockActiveOrder.origin.address}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>طبقه {mockActiveOrder.origin.floor}</span>
                <span>•</span>
                <span>{mockActiveOrder.origin.elevator ? 'آسانسور دارد' : 'بدون آسانسور'}</span>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                  <div className="h-2 w-2 rounded-full bg-red-600" />
                </div>
                <span className="text-sm font-medium">مقصد</span>
              </div>
              <p className="text-sm text-muted-foreground">{mockActiveOrder.destination.address}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>طبقه {mockActiveOrder.destination.floor}</span>
                <span>•</span>
                <span>{mockActiveOrder.destination.elevator ? 'آسانسور دارد' : 'بدون آسانسور'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* اطلاعات مشتری */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">اطلاعات مشتری</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={mockActiveOrder.customer.avatar} alt={mockActiveOrder.customer.name} />
                <AvatarFallback>
                  {mockActiveOrder.customer.name.split(' ')[0][0]}
                  {mockActiveOrder.customer.name.split(' ')[1]?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{mockActiveOrder.customer.name}</p>
                <p className="text-sm text-muted-foreground">{mockActiveOrder.customer.phone}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleCallCustomer}>
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {mockActiveOrder.notes && (
            <>
              <Separator />
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{mockActiveOrder.notes}</AlertDescription>
              </Alert>
            </>
          )}

          <Separator />

          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">نوع خدمت:</span>
              <span className="font-medium">{mockActiveOrder.serviceType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">تعداد کارگر:</span>
              <span className="font-medium">{mockActiveOrder.workers} نفر</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">کرایه:</span>
              <span className="font-bold text-green-600">
                {mockActiveOrder.price.toLocaleString('fa-IR')} تومان
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">کمیسیون شما:</span>
              <span className="font-bold text-primary">
                {mockActiveOrder.commission.toLocaleString('fa-IR')} تومان
              </span>
            </div>
          </div>

          {mockActiveOrder.items.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="mb-2 text-sm font-medium">لوازم حمل:</p>
                <div className="flex flex-wrap gap-2">
                  {mockActiveOrder.items.map((item, index) => (
                    <Badge key={index} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* دکمه‌های اقدام */}
      <div className="grid gap-3 md:grid-cols-2">
        <Button variant="outline" onClick={() => setShowIssueDialog(true)} className="gap-2">
          <AlertCircle className="h-4 w-4" />
          گزارش مشکل
        </Button>
        <Button variant="outline" className="gap-2">
          <Camera className="h-4 w-4" />
          ثبت عکس
        </Button>
      </div>

      {/* Dialog تکمیل سفر */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              تکمیل سفر
            </DialogTitle>
            <DialogDescription>سفر ��ا تکمیل و نهایی کنید</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                کمیسیون شما: <strong>{mockActiveOrder.commission.toLocaleString('fa-IR')} تومان</strong>
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

      {/* Dialog گزارش مشکل */}
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
