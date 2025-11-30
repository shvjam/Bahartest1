import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Save,
  Edit,
  Check,
  X,
  Truck,
  FileText,
  CreditCard,
  Award,
  Star,
  TrendingUp,
  Package,
  DollarSign,
  Clock,
  Fingerprint,
  Settings,
  LogOut,
  Upload,
  Download,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { ScrollArea } from '../../components/ui/scroll-area';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Progress } from '../../components/ui/progress';

// Mock Driver Data
const mockDriver = {
  id: 'd1',
  firstName: 'رضا',
  lastName: 'احمدی',
  email: 'reza.ahmadi@email.com',
  phone: '09121234567',
  nationalId: '1234567890',
  birthDate: '1365/03/20',
  avatar: '',
  joinedDate: '1402/01/15',
  lastActive: '1403/08/07',
  
  // اطلاعات خودرو
  vehicle: {
    type: 'وانت نیسان',
    model: '1395',
    plate: '12 ج 345 ایران 78',
    color: 'سفید',
    capacity: '1.5 تن',
  },
  
  // مدارک
  documents: {
    drivingLicense: {
      number: 'DL-123456789',
      expiry: '1405/12/29',
      verified: true,
    },
    vehicleCard: {
      verified: true,
    },
    insurance: {
      expiry: '1404/06/15',
      verified: true,
    },
  },
  
  // اطلاعات بانکی
  banking: {
    accountNumber: '1234567890123456',
    iban: 'IR123456789012345678901234',
    bankName: 'بانک ملی',
    accountHolder: 'رضا احمدی',
  },
  
  // آمار
  stats: {
    rating: 4.8,
    totalRides: 342,
    completionRate: 96,
    onTimeRate: 94,
    totalEarnings: 342500000,
  },
  
  // تنظیمات
  settings: {
    notifications: {
      newOrders: true,
      orderUpdates: true,
      earnings: true,
      promotions: false,
    },
    availability: {
      acceptOrders: true,
      maxDistance: 50,
    },
  },
};

export const DriverProfile = () => {
  const [driver, setDriver] = useState(mockDriver);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // Form States
  const [formData, setFormData] = useState({
    firstName: driver.firstName,
    lastName: driver.lastName,
    email: driver.email,
    phone: driver.phone,
    nationalId: driver.nationalId,
    birthDate: driver.birthDate,
  });

  const [vehicleData, setVehicleData] = useState({
    type: driver.vehicle.type,
    model: driver.vehicle.model,
    plate: driver.vehicle.plate,
    color: driver.vehicle.color,
    capacity: driver.vehicle.capacity,
  });

  const [bankingData, setBankingData] = useState({
    accountNumber: driver.banking.accountNumber,
    iban: driver.banking.iban,
    bankName: driver.banking.bankName,
    accountHolder: driver.banking.accountHolder,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [notifications, setNotifications] = useState(driver.settings.notifications);
  const [availability, setAvailability] = useState(driver.settings.availability);

  // Handlers
  const handleSaveProfile = () => {
    setDriver({
      ...driver,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      nationalId: formData.nationalId,
      birthDate: formData.birthDate,
    });
    setIsEditMode(false);
    toast.success('اطلاعات پروفایل با موفقیت ذخیره شد');
  };

  const handleCancelEdit = () => {
    setFormData({
      firstName: driver.firstName,
      lastName: driver.lastName,
      email: driver.email,
      phone: driver.phone,
      nationalId: driver.nationalId,
      birthDate: driver.birthDate,
    });
    setIsEditMode(false);
  };

  const handleSaveVehicle = () => {
    setDriver({
      ...driver,
      vehicle: vehicleData,
    });
    toast.success('اطلاعات خودرو ذخیره شد');
  };

  const handleSaveBanking = () => {
    // اعتبارسنجی شماره شبا
    if (bankingData.iban && !bankingData.iban.startsWith('IR')) {
      toast.error('شماره شبا باید با IR شروع شود');
      return;
    }

    if (bankingData.iban && bankingData.iban.length !== 26) {
      toast.error('شماره شبا باید 26 کاراکتر باشد');
      return;
    }

    setDriver({
      ...driver,
      banking: bankingData,
    });
    toast.success('اطلاعات بانکی ذخیره شد');
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('لطفاً همه فیلدها را پر کنید');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('رمز عبور جدید و تکرار آن یکسان نیستند');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('رمز عبور باید حداقل 8 کاراکتر باشد');
      return;
    }

    setShowPasswordDialog(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast.success('رمز عبور با موفقیت تغییر کرد');
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDriver({ ...driver, avatar: reader.result as string });
        toast.success('تصویر پروفایل با موفقیت تغییر کرد');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    setDriver({
      ...driver,
      settings: {
        notifications,
        availability,
      },
    });
    toast.success('تنظیمات ذخیره شد');
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header با تصویر پروفایل */}
      <Card className="relative overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5" />
        <CardContent className="relative -mt-16 space-y-4">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={driver.avatar} alt={`${driver.firstName} ${driver.lastName}`} />
                <AvatarFallback className="text-3xl">
                  {driver.firstName[0]}
                  {driver.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-10 w-10 rounded-full shadow-lg"
                onClick={() => setShowAvatarDialog(true)}
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 text-center md:text-right">
              <div className="flex flex-col items-center gap-2 md:flex-row md:items-center">
                <h1 className="flex items-center gap-2">
                  {driver.firstName} {driver.lastName}
                </h1>
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  {driver.stats.rating}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Truck className="h-3 w-3" />
                  راننده
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground md:justify-start">
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {driver.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="h-4 w-4" />
                  {driver.vehicle.type}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  عضو از {driver.joinedDate}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <LogOut className="ml-2 h-4 w-4" />
                خروج
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* کارت‌های آمار */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">کل سفرها</p>
                <p className="text-2xl font-bold">{driver.stats.totalRides}</p>
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
                <p className="text-sm text-muted-foreground">کل درآمد</p>
                <p className="text-2xl font-bold">{Math.round(driver.stats.totalEarnings / 1000000)}</p>
                <p className="text-xs text-muted-foreground">میلیون تومان</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">نرخ تکمیل</p>
                <p className="text-2xl font-bold">{driver.stats.completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">به موقع بودن</p>
                <p className="text-2xl font-bold">{driver.stats.onTimeRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs اصلی */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        {/* Desktop Tabs */}
        <TabsList className="hidden md:grid w-full grid-cols-6">
          <TabsTrigger value="personal">
            <User className="ml-2 h-4 w-4" />
            <span className="hidden lg:inline">اطلاعات شخصی</span>
            <span className="lg:hidden">شخصی</span>
          </TabsTrigger>
          <TabsTrigger value="vehicle">
            <Truck className="ml-2 h-4 w-4" />
            خودرو
          </TabsTrigger>
          <TabsTrigger value="banking">
            <CreditCard className="ml-2 h-4 w-4" />
            <span className="hidden lg:inline">اطلاعات بانکی</span>
            <span className="lg:hidden">بانک</span>
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="ml-2 h-4 w-4" />
            مدارک
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="ml-2 h-4 w-4" />
            امنیت
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="ml-2 h-4 w-4" />
            تنظیمات
          </TabsTrigger>
        </TabsList>

        {/* Mobile Tabs - Scrollable */}
        <div className="md:hidden">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex w-auto">
              <TabsTrigger value="personal" className="flex-shrink-0">
                <User className="ml-2 h-4 w-4" />
                شخصی
              </TabsTrigger>
              <TabsTrigger value="vehicle" className="flex-shrink-0">
                <Truck className="ml-2 h-4 w-4" />
                خودرو
              </TabsTrigger>
              <TabsTrigger value="banking" className="flex-shrink-0">
                <CreditCard className="ml-2 h-4 w-4" />
                بانک
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex-shrink-0">
                <FileText className="ml-2 h-4 w-4" />
                مدارک
              </TabsTrigger>
              <TabsTrigger value="security" className="flex-shrink-0">
                <Shield className="ml-2 h-4 w-4" />
                امنیت
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-shrink-0">
                <Settings className="ml-2 h-4 w-4" />
                تنظیمات
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
        </div>

        {/* Tab: اطلاعات شخصی */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>اطلاعات شخصی</CardTitle>
                <CardDescription>مدیریت اطلاعات حساب کاربری</CardDescription>
              </div>
              {!isEditMode ? (
                <Button onClick={() => setIsEditMode(true)}>
                  <Edit className="ml-2 h-4 w-4" />
                  ویرایش
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="ml-2 h-4 w-4" />
                    انصراف
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    <Save className="ml-2 h-4 w-4" />
                    ذخیره
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">نام *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">نام خانوادگی *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!isEditMode}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">شماره تلفن *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditMode}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nationalId">کد ملی</Label>
                  <Input
                    id="nationalId"
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    disabled={!isEditMode}
                    maxLength={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">تاریخ تولد</Label>
                  <Input
                    id="birthDate"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    disabled={!isEditMode}
                    placeholder="1365/01/01"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: خودرو */}
        <TabsContent value="vehicle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات خودرو</CardTitle>
              <CardDescription>مشخصات وسیله نقلیه</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-type">نوع خودرو *</Label>
                  <Select
                    value={vehicleData.type}
                    onValueChange={(value) => setVehicleData({ ...vehicleData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="وانت نیسان">وانت نیسان</SelectItem>
                      <SelectItem value="کامیونت">کامیونت</SelectItem>
                      <SelectItem value="کامیون">کامیون</SelectItem>
                      <SelectItem value="خاور">خاور</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle-model">مدل</Label>
                  <Input
                    id="vehicle-model"
                    value={vehicleData.model}
                    onChange={(e) => setVehicleData({ ...vehicleData, model: e.target.value })}
                    placeholder="1400"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-plate">پلاک *</Label>
                  <Input
                    id="vehicle-plate"
                    value={vehicleData.plate}
                    onChange={(e) => setVehicleData({ ...vehicleData, plate: e.target.value })}
                    placeholder="12 ج 345 ایران 78"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle-color">رنگ</Label>
                  <Input
                    id="vehicle-color"
                    value={vehicleData.color}
                    onChange={(e) => setVehicleData({ ...vehicleData, color: e.target.value })}
                    placeholder="سفید"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle-capacity">ظرفیت بار</Label>
                <Input
                  id="vehicle-capacity"
                  value={vehicleData.capacity}
                  onChange={(e) => setVehicleData({ ...vehicleData, capacity: e.target.value })}
                  placeholder="1.5 تن"
                />
              </div>

              <Separator />

              <Button onClick={handleSaveVehicle} className="w-full md:w-auto">
                <Save className="ml-2 h-4 w-4" />
                ذخیره اطلاعات خودرو
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: اطلاعات بانکی */}
        <TabsContent value="banking" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <div>
                  <CardTitle>اطلاعات بانکی</CardTitle>
                  <CardDescription>اطلاعات حساب برای دریافت درآمدها</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  اطلاعات بانکی شما کاملاً محرمانه است و تنها برای واریز درآمدها استفاده می‌شود.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="account-holder">نام صاحب حساب *</Label>
                  <Input
                    id="account-holder"
                    value={bankingData.accountHolder}
                    onChange={(e) => setBankingData({ ...bankingData, accountHolder: e.target.value })}
                    placeholder="رضا احمدی"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank-name">نام بانک *</Label>
                  <Select
                    value={bankingData.bankName}
                    onValueChange={(value) => setBankingData({ ...bankingData, bankName: value })}
                  >
                    <SelectTrigger id="bank-name">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="بانک ملی">بانک ملی</SelectItem>
                      <SelectItem value="بانک ملت">بانک ملت</SelectItem>
                      <SelectItem value="بانک صادرات">بانک صادرات</SelectItem>
                      <SelectItem value="بانک تجارت">بانک تجارت</SelectItem>
                      <SelectItem value="بانک سپه">بانک سپه</SelectItem>
                      <SelectItem value="بانک پاسارگاد">بانک پاسارگاد</SelectItem>
                      <SelectItem value="بانک پارسیان">بانک پارسیان</SelectItem>
                      <SelectItem value="بانک کشاورزی">بانک کشاورزی</SelectItem>
                      <SelectItem value="بانک رفاه">بانک رفاه</SelectItem>
                      <SelectItem value="بانک سامان">بانک سامان</SelectItem>
                      <SelectItem value="سایر">سایر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="iban">شماره شبا (IBAN) *</Label>
                <Input
                  id="iban"
                  value={bankingData.iban}
                  onChange={(e) => {
                    let value = e.target.value.toUpperCase();
                    // حذف فاصله‌ها
                    value = value.replace(/\s/g, '');
                    // اضافه کردن IR اگر وجود نداشته باشد
                    if (value && !value.startsWith('IR')) {
                      value = 'IR' + value;
                    }
                    // محدود کردن به 26 کاراکتر
                    value = value.substring(0, 26);
                    setBankingData({ ...bankingData, iban: value });
                  }}
                  placeholder="IR123456789012345678901234"
                  maxLength={26}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  شماره شبا باید 26 رقم باشد و با IR شروع شود
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-number">شماره حساب</Label>
                <Input
                  id="account-number"
                  value={bankingData.accountNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setBankingData({ ...bankingData, accountNumber: value });
                  }}
                  placeholder="1234567890123456"
                  maxLength={16}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  شماره حساب بانکی (اختیاری)
                </p>
              </div>

              <Separator />

              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-3 flex items-center gap-2 font-medium">
                  <CreditCard className="h-4 w-4" />
                  پیش‌نمایش
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">صاحب حساب:</span>
                    <span className="font-medium">{bankingData.accountHolder || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">بانک:</span>
                    <span className="font-medium">{bankingData.bankName || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">شماره شبا:</span>
                    <span className="font-mono text-xs">
                      {bankingData.iban || '-'}
                    </span>
                  </div>
                  {bankingData.accountNumber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">شماره حساب:</span>
                      <span className="font-mono text-xs">{bankingData.accountNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={handleSaveBanking} className="w-full md:w-auto">
                <Save className="ml-2 h-4 w-4" />
                ذخیره اطلاعات بانکی
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: مدارک */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>گواهینامه</CardTitle>
              <CardDescription>اطلاعات گواهینامه رانندگی</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>شماره گواهینامه</Label>
                  <Input value={driver.documents.drivingLicense.number} disabled />
                </div>
                <div className="space-y-2">
                  <Label>تاریخ انقضا</Label>
                  <Input value={driver.documents.drivingLicense.expiry} disabled />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={driver.documents.drivingLicense.verified ? 'default' : 'secondary'}>
                  {driver.documents.drivingLicense.verified ? (
                    <>
                      <Check className="ml-1 h-3 w-3" />
                      تایید شده
                    </>
                  ) : (
                    'در انتظار تایید'
                  )}
                </Badge>
              </div>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                آپلود مجدد
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>کارت خودرو</CardTitle>
              <CardDescription>سند و مدارک خودرو</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={driver.documents.vehicleCard.verified ? 'default' : 'secondary'}>
                  {driver.documents.vehicleCard.verified ? (
                    <>
                      <Check className="ml-1 h-3 w-3" />
                      تایید شده
                    </>
                  ) : (
                    'در انتظار تایید'
                  )}
                </Badge>
              </div>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                آپلود مجدد
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>بیمه شخص ثالث</CardTitle>
              <CardDescription>اطلاعات بیمه</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>تاریخ انقضا</Label>
                <Input value={driver.documents.insurance.expiry} disabled />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={driver.documents.insurance.verified ? 'default' : 'secondary'}>
                  {driver.documents.insurance.verified ? (
                    <>
                      <Check className="ml-1 h-3 w-3" />
                      تایید شده
                    </>
                  ) : (
                    'در انتظار تایید'
                  )}
                </Badge>
              </div>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                آپلود مجدد
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: امنیت */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                رمز عبور
              </CardTitle>
              <CardDescription>مدیریت رمز عبور حساب کاربری</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Fingerprint className="h-4 w-4" />
                <AlertDescription>
                  برای امنیت بیشتر، رمز عبور خود را هر 3 ماه یکبار تغییر دهید.
                </AlertDescription>
              </Alert>
              <Button onClick={() => setShowPasswordDialog(true)} className="w-full md:w-auto">
                <Lock className="ml-2 h-4 w-4" />
                تغییر رمز عبور
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: تنظیمات */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                اعلان‌ها
              </CardTitle>
              <CardDescription>مدیریت اعلان‌ها</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-orders">اعلان سفارشات جدید</Label>
                  <p className="text-sm text-muted-foreground">دریافت اطلاع از سفارشات جدید</p>
                </div>
                <Switch
                  id="notif-orders"
                  checked={notifications.newOrders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, newOrders: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-updates">به‌روزرسانی سفارشات</Label>
                  <p className="text-sm text-muted-foreground">اطلاعات تغییرات سفارش</p>
                </div>
                <Switch
                  id="notif-updates"
                  checked={notifications.orderUpdates}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, orderUpdates: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-earnings">اعلان درآمدها</Label>
                  <p className="text-sm text-muted-foreground">اطلاعات واریزی‌ها</p>
                </div>
                <Switch
                  id="notif-earnings"
                  checked={notifications.earnings}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, earnings: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-promotions">تخفیف‌ها و پیشنهادات</Label>
                  <p className="text-sm text-muted-foreground">دریافت پیشنهادات ویژه</p>
                </div>
                <Switch
                  id="notif-promotions"
                  checked={notifications.promotions}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, promotions: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                دسترس‌پذیری
              </CardTitle>
              <CardDescription>تنظیمات دریافت سفارش</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="accept-orders">پذیرش سفارشات</Label>
                  <p className="text-sm text-muted-foreground">فعال/غیرفعال کردن دریافت سفارش</p>
                </div>
                <Switch
                  id="accept-orders"
                  checked={availability.acceptOrders}
                  onCheckedChange={(checked) =>
                    setAvailability({ ...availability, acceptOrders: checked })
                  }
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="max-distance">حداکثر مسافت (کیلومتر)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="max-distance"
                    type="number"
                    value={availability.maxDistance}
                    onChange={(e) =>
                      setAvailability({ ...availability, maxDistance: parseInt(e.target.value) })
                    }
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">{availability.maxDistance} کیلومتر</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveSettings} className="w-full md:w-auto">
            <Save className="ml-2 h-4 w-4" />
            ذخیره تنظیمات
          </Button>
        </TabsContent>
      </Tabs>

      {/* Dialog تغییر تصویر */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تغییر تصویر پروفایل</DialogTitle>
            <DialogDescription>یک تصویر جدید انتخاب کنید</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src={driver.avatar} />
                <AvatarFallback className="text-3xl">
                  {driver.firstName[0]}
                  {driver.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <Input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAvatarDialog(false)}>
              بستن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog تغییر رمز */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تغییر رمز عبور</DialogTitle>
            <DialogDescription>رمز عبور جدید را وارد کنید</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">رمز عبور فعلی *</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-0 h-full"
                  onClick={() =>
                    setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                  }
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">رمز عبور جدید *</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-0 h-full"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">حداقل 8 کاراکتر</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">تکرار رمز عبور *</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-0 h-full"
                  onClick={() =>
                    setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                  }
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}
            >
              انصراف
            </Button>
            <Button onClick={handleChangePassword}>
              <Check className="ml-2 h-4 w-4" />
              تغییر رمز
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
