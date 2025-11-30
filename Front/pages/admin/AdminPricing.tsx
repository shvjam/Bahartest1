import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { 
  Pencil, 
  Save, 
  DollarSign, 
  Truck, 
  Users, 
  MapPin,
  Building2,
  StopCircle,
  Clock,
  Info,
  AlertCircle
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { toast } from 'sonner';
import { VehicleType } from '../../types';
import { VEHICLE_TYPES, DEFAULT_PRICING } from '../../constants';

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
};

export const AdminPricing = () => {
  // State for pricing config
  const [pricingConfig, setPricingConfig] = useState(DEFAULT_PRICING);
  
  // Dialog states
  const [editingWorkerRate, setEditingWorkerRate] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleType | null>(null);

  // Temp values for editing
  const [tempWorkerRate, setTempWorkerRate] = useState(pricingConfig.baseWorkerRate);
  const [tempVehicleRate, setTempVehicleRate] = useState(0);
  const [tempPerKmRate, setTempPerKmRate] = useState(pricingConfig.perKmRate);
  const [tempPerFloorRate, setTempPerFloorRate] = useState(pricingConfig.perFloorRate);
  const [tempStopRate, setTempStopRate] = useState(pricingConfig.stopRate);
  const [tempPackingHourlyRate, setTempPackingHourlyRate] = useState(pricingConfig.packingHourlyRate);
  const [tempCancellationFee, setTempCancellationFee] = useState(pricingConfig.cancellationFee);
  const [tempExpertVisitFee, setTempExpertVisitFee] = useState(pricingConfig.expertVisitFee);

  // Save handlers
  const handleSaveWorkerRate = () => {
    setPricingConfig({ ...pricingConfig, baseWorkerRate: tempWorkerRate });
    setEditingWorkerRate(false);
    toast.success('نرخ کارگر با موفقیت ذخیره شد');
  };

  const handleSaveVehicleRate = () => {
    if (editingVehicle) {
      setPricingConfig({
        ...pricingConfig,
        baseVehicleRates: {
          ...pricingConfig.baseVehicleRates,
          [editingVehicle]: tempVehicleRate
        }
      });
      setEditingVehicle(null);
      toast.success('نرخ وسیله نقلیه با موفقیت ذخیره شد');
    }
  };

  const handleSaveDistancePricing = () => {
    setPricingConfig({ 
      ...pricingConfig, 
      perKmRate: tempPerKmRate 
    });
    toast.success('تعرفه مسافت با موفقیت ذخیره شد');
  };

  const handleSaveFloorPricing = () => {
    setPricingConfig({ 
      ...pricingConfig, 
      perFloorRate: tempPerFloorRate 
    });
    toast.success('تعرفه طبقه با موفقیت ذخیره شد');
  };

  const handleSaveAdditionalServices = () => {
    setPricingConfig({ 
      ...pricingConfig, 
      stopRate: tempStopRate,
      packingHourlyRate: tempPackingHourlyRate,
      cancellationFee: tempCancellationFee,
      expertVisitFee: tempExpertVisitFee
    });
    toast.success('تعرفه خدمات اضافی با موفقیت ذخیره شد');
  };

  const handleSaveAllSettings = () => {
    toast.success('همه تنظیمات با موفقیت ذخیره شد');
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 flex items-center gap-2">
            <DollarSign className="w-8 h-8" />
            تعرفه و قیمت‌گذاری پایه
          </h1>
          <p className="text-muted-foreground">
            مدیریت تعرفه‌های کلی سیستم (کارگر، ماشین، مسافت، طبقه و خدمات اضافی)
          </p>
        </div>
        <Button className="gap-2" onClick={handleSaveAllSettings}>
          <Save className="w-4 h-4" />
          ذخیره همه تغییرات
        </Button>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>راهنما</AlertTitle>
        <AlertDescription>
          برای مدیریت قیمت هر خدمت به <strong>مدیریت خدمات</strong> و برای مدیریت آیتم‌های کاتالوگ به <strong>مدیریت کاتالوگ</strong> مراجعه کنید.
        </AlertDescription>
      </Alert>

      {/* Worker Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            نرخ کارگر
          </CardTitle>
          <CardDescription>
            نرخ پایه هر کارگر را تعیین کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div>
              <p className="mb-1 font-medium">نرخ هر کارگر</p>
              <p className="text-sm text-muted-foreground">
                این مبلغ برای هر کارگر در فرم ثبت سفارش محاسبه می‌شود
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-lg">{formatCurrency(pricingConfig.baseWorkerRate)}</span>
              <Dialog 
                open={editingWorkerRate}
                onOpenChange={(open) => {
                  if (open) {
                    setEditingWorkerRate(true);
                    setTempWorkerRate(pricingConfig.baseWorkerRate);
                  } else {
                    setEditingWorkerRate(false);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="w-4 h-4" />
                    ویرایش
                  </Button>
                </DialogTrigger>
                <DialogContent dir="rtl">
                  <DialogHeader>
                    <DialogTitle>ویرایش نرخ کارگر</DialogTitle>
                    <DialogDescription>
                      نرخ پایه هر کارگر را وارد کنید
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>نرخ (تومان)</Label>
                      <Input
                        type="number"
                        value={tempWorkerRate}
                        onChange={(e) => setTempWorkerRate(Number(e.target.value))}
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSaveWorkerRate}>ذخیره</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            نرخ وسایل نقلیه
          </CardTitle>
          <CardDescription>
            نرخ پایه هر نوع وسیله نقلیه را تعیین کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">نوع وسیله</TableHead>
                  <TableHead className="text-right">ظرفیت</TableHead>
                  <TableHead className="text-right">نرخ پایه</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {VEHICLE_TYPES.map((vehicle) => (
                  <TableRow key={vehicle.value}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{vehicle.icon}</span>
                        <span className="font-medium">{vehicle.label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {vehicle.capacity}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">
                        {formatCurrency(pricingConfig.baseVehicleRates[vehicle.value])}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Dialog 
                        open={editingVehicle === vehicle.value}
                        onOpenChange={(open) => {
                          if (open) {
                            setEditingVehicle(vehicle.value);
                            setTempVehicleRate(pricingConfig.baseVehicleRates[vehicle.value]);
                          } else {
                            setEditingVehicle(null);
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Pencil className="w-4 h-4" />
                            ویرایش
                          </Button>
                        </DialogTrigger>
                        <DialogContent dir="rtl">
                          <DialogHeader>
                            <DialogTitle>ویرایش نرخ {vehicle.label}</DialogTitle>
                            <DialogDescription>
                              نرخ پایه این وسیله نقلیه را وارد کنید
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>نرخ (تومان)</Label>
                              <Input
                                type="number"
                                value={tempVehicleRate}
                                onChange={(e) => setTempVehicleRate(Number(e.target.value))}
                                dir="ltr"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleSaveVehicleRate}>ذخیره</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Distance & Floor Pricing */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Distance Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              تعرفه مسافت
            </CardTitle>
            <CardDescription>
              نرخ محاسبه هزینه بر اساس مسافت
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>نرخ هر کیلومتر (تومان)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={tempPerKmRate}
                  onChange={(e) => setTempPerKmRate(Number(e.target.value))}
                  dir="ltr"
                  className="flex-1"
                />
                <Button onClick={handleSaveDistancePricing}>ذخیره</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                قیمت فعلی: {formatCurrency(pricingConfig.perKmRate)} به ازای هر کیلومتر
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Floor Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              تعرفه طبقه
            </CardTitle>
            <CardDescription>
              نرخ اضافی برای هر طبقه ساختمان
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>نرخ هر طبقه (تومان)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={tempPerFloorRate}
                  onChange={(e) => setTempPerFloorRate(Number(e.target.value))}
                  dir="ltr"
                  className="flex-1"
                />
                <Button onClick={handleSaveFloorPricing}>ذخیره</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                قیمت فعلی: {formatCurrency(pricingConfig.perFloorRate)} به ازای هر طبقه
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            خدمات اضافی و هزینه‌های جانبی
          </CardTitle>
          <CardDescription>
            تعرفه سایر خدمات و هزینه‌ها
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stopRate" className="flex items-center gap-2">
                <StopCircle className="w-4 h-4" />
                نرخ هر توقف (تومان)
              </Label>
              <Input
                id="stopRate"
                type="number"
                value={tempStopRate}
                onChange={(e) => setTempStopRate(Number(e.target.value))}
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground">
                هزینه توقف در مسیر برای بارگیری یا تخلیه
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="packingHourlyRate" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                نرخ بسته‌بندی ساعتی (تومان)
              </Label>
              <Input
                id="packingHourlyRate"
                type="number"
                value={tempPackingHourlyRate}
                onChange={(e) => setTempPackingHourlyRate(Number(e.target.value))}
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground">
                هزینه بسته‌بندی به ازای هر ساعت
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancellationFee" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                جریمه لغو سفارش (تومان)
              </Label>
              <Input
                id="cancellationFee"
                type="number"
                value={tempCancellationFee}
                onChange={(e) => setTempCancellationFee(Number(e.target.value))}
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground">
                جریمه لغو سفارش توسط مشتری
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expertVisitFee" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                هزینه کارشناسی (تومان)
              </Label>
              <Input
                id="expertVisitFee"
                type="number"
                value={tempExpertVisitFee}
                onChange={(e) => setTempExpertVisitFee(Number(e.target.value))}
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground">
                هزینه بازدید کارشناس قبل از اسباب‌کشی
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveAdditionalServices}>
              <Save className="ml-2 h-4 w-4" />
              ذخیره تعرفه‌های خدمات اضافی
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Info className="w-5 h-5" />
            خلاصه تنظیمات فعلی
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background">
              <span className="text-sm text-muted-foreground">نرخ کارگر:</span>
              <span className="font-mono">{formatCurrency(pricingConfig.baseWorkerRate)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background">
              <span className="text-sm text-muted-foreground">نرخ هر کیلومتر:</span>
              <span className="font-mono">{formatCurrency(pricingConfig.perKmRate)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background">
              <span className="text-sm text-muted-foreground">نرخ هر طبقه:</span>
              <span className="font-mono">{formatCurrency(pricingConfig.perFloorRate)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background">
              <span className="text-sm text-muted-foreground">نرخ توقف:</span>
              <span className="font-mono">{formatCurrency(pricingConfig.stopRate)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background">
              <span className="text-sm text-muted-foreground">بسته‌بندی ساعتی:</span>
              <span className="font-mono">{formatCurrency(pricingConfig.packingHourlyRate)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background">
              <span className="text-sm text-muted-foreground">جریمه لغو:</span>
              <span className="font-mono">{formatCurrency(pricingConfig.cancellationFee)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPricing;
