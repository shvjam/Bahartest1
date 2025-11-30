import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';
import { Save, RefreshCw, Truck } from 'lucide-react';
import { pricingService } from '../../services/api';
import { VehicleType } from '../../types';
import { VEHICLE_TYPES } from '../../constants';
import { Switch } from '../../components/ui/switch';

export const PricingSettingsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pricing, setPricing] = useState<any>({
    baseWorkerRate: 900000,
    baseVehicleRates: {
      [VehicleType.PICKUP]: 1500000,
      [VehicleType.NISSAN]: 2000000,
      [VehicleType.TRUCK]: 2500000,
      [VehicleType.HEAVY_TRUCK]: 2660300,
    },
    workerRatesByVehicle: {
      [VehicleType.PICKUP]: 300000,
      [VehicleType.NISSAN]: 350000,
      [VehicleType.TRUCK]: 400000,
      [VehicleType.HEAVY_TRUCK]: 450000,
    },
    perKmRate: 15000,
    perFloorWithElevatorRate: 30000,
    perFloorWithoutElevatorRate: 75000,
    walkingDistanceRates: {
      0: 0,
      20: 200000,
      35: 350000,
      40: 400000,
      50: 500000,
      65: 800000,
    },
    stopRate: 250000,
    packingHourlyRate: 200000,
    cancellationFee: 250000,
    expertVisitFee: 250000,
    packingMaterialsEstimatedCost: 500000,
    includePackingMaterialsInInvoice: true,
  });

  useEffect(() => {
    loadPricingConfig();
  }, []);

  const loadPricingConfig = async () => {
    setIsLoading(true);
    try {
      const config = await pricingService.getPricingConfig();
      setPricing(config);
    } catch (error) {
      toast.error('خطا در بارگذاری تنظیمات قیمت‌گذاری');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await pricingService.updatePricingConfig(pricing);
      toast.success('تنظیمات قیمت‌گذاری با موفقیت ذخیره شد');
    } catch (error) {
      toast.error('خطا در ذخیره تنظیمات');
    } finally {
      setIsSaving(false);
    }
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('fa-IR').format(value);
  };

  const handleNumberChange = (path: string[], value: string) => {
    const numValue = parseInt(value.replace(/[^\\d]/g, '')) || 0;
    setPricing((prev: any) => {
      const updated = { ...prev };
      let current = updated;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = numValue;
      return updated;
    });
  };

  const handleBooleanChange = (path: string[], value: boolean) => {
    setPricing((prev: any) => {
      const updated = { ...prev };
      let current = updated;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return updated;
    });
  };

  if (isLoading) {
    return (
      <div className="p-8" dir="rtl">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">تنظیمات قیمت‌گذاری</h1>
            <p className="text-muted-foreground">
              مدیریت تعرفه‌ها و قیمت‌گذاری خدمات اسباب‌کشی
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            <Save className="w-5 h-5 ml-2" />
            {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </div>

        {/* Vehicle Base Rates Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-primary" />
              <div>
                <h3>نرخ پایه خودروها</h3>
                <p className="text-sm text-muted-foreground">
                  نرخ پایه هر نوع خودرو (شامل 4 کارگر پایه)
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {VEHICLE_TYPES.map((vehicle) => (
                <div key={vehicle.value} className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-2xl">{vehicle.icon}</span>
                    {vehicle.label}
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={formatNumber(pricing.baseVehicleRates[vehicle.value] || 0)}
                      onChange={(e) => handleNumberChange(['baseVehicleRates', vehicle.value], e.target.value)}
                      className="text-left"
                      dir="ltr"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      تومان
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Worker Rates by Vehicle Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-primary" />
              <div>
                <h3>نرخ کارگر اضافی به ازای هر خودرو</h3>
                <p className="text-sm text-muted-foreground">
                  نرخ هر کارگر اضافی (بیش از 4 نفر) برای هر نوع خودرو
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {VEHICLE_TYPES.map((vehicle) => (
                <div key={vehicle.value} className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-2xl">{vehicle.icon}</span>
                    {vehicle.label} - کارگر اضافی
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={formatNumber(pricing.workerRatesByVehicle[vehicle.value] || 0)}
                      onChange={(e) => handleNumberChange(['workerRatesByVehicle', vehicle.value], e.target.value)}
                      className="text-left"
                      dir="ltr"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      تومان
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    مثال: برای {vehicle.label} با 6 کارگر = نرخ پایه + (2 × این مبلغ)
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Other Rates Card */}
        <Card>
          <CardHeader>
            <h3>سایر هزینه‌ها</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>هزینه هر کیلومتر</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formatNumber(pricing.perKmRate || 0)}
                    onChange={(e) => handleNumberChange(['perKmRate'], e.target.value)}
                    className="text-left"
                    dir="ltr"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    تومان
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>هزینه هر طبقه (با آسانسور)</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formatNumber(pricing.perFloorWithElevatorRate || 0)}
                    onChange={(e) => handleNumberChange(['perFloorWithElevatorRate'], e.target.value)}
                    className="text-left"
                    dir="ltr"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    تومان
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>هزینه هر طبقه (بدون آسانسور)</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formatNumber(pricing.perFloorWithoutElevatorRate || 0)}
                    onChange={(e) => handleNumberChange(['perFloorWithoutElevatorRate'], e.target.value)}
                    className="text-left"
                    dir="ltr"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    تومان
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>هزینه هر توقف</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formatNumber(pricing.stopRate || 0)}
                    onChange={(e) => handleNumberChange(['stopRate'], e.target.value)}
                    className="text-left"
                    dir="ltr"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    تومان
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>نرخ ساعتی بسته‌بندی</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formatNumber(pricing.packingHourlyRate || 0)}
                    onChange={(e) => handleNumberChange(['packingHourlyRate'], e.target.value)}
                    className="text-left"
                    dir="ltr"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    تومان
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>جریمه لغو سفارش</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formatNumber(pricing.cancellationFee || 0)}
                    onChange={(e) => handleNumberChange(['cancellationFee'], e.target.value)}
                    className="text-left"
                    dir="ltr"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    تومان
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>هزینه کارشناسی</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formatNumber(pricing.expertVisitFee || 0)}
                    onChange={(e) => handleNumberChange(['expertVisitFee'], e.target.value)}
                    className="text-left"
                    dir="ltr"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    تومان
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>هزینه تخمینی مواد بسته‌بندی</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formatNumber(pricing.packingMaterialsEstimatedCost || 0)}
                    onChange={(e) => handleNumberChange(['packingMaterialsEstimatedCost'], e.target.value)}
                    className="text-left"
                    dir="ltr"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    تومان
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>درج مواد بسته‌بندی در فاکتور</Label>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={pricing.includePackingMaterialsInInvoice ?? true}
                    onCheckedChange={(checked) => handleBooleanChange(['includePackingMaterialsInInvoice'], checked)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {pricing.includePackingMaterialsInInvoice ?? true ? 'فعال' : 'غیرفعال'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  آیا هزینه تخمینی مواد بسته‌بندی در فاکتورها نمایش داده شود؟
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Walking Distance Rates Card */}
        <Card>
          <CardHeader>
            <h3>تعرفه مسافت پیاده‌روی</h3>
            <p className="text-sm text-muted-foreground">
              هزینه حمل بار به ازای فاصله پیاده‌روی از محل پارک تا درب منزل
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(pricing.walkingDistanceRates || {}).map((distance) => (
                <div key={distance} className="space-y-2">
                  <Label>{distance === '0' ? 'ندارم' : `${distance} متر`}</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={formatNumber(pricing.walkingDistanceRates[distance] || 0)}
                      onChange={(e) => handleNumberChange(['walkingDistanceRates', distance], e.target.value)}
                      className="text-left"
                      dir="ltr"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      تومان
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardContent className="p-6">
            <h4 className="mb-3">📌 نکات مهم</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong>نرخ پایه خودرو:</strong> شامل خودرو + 4 کارگر پایه است
              </li>
              <li>
                • <strong>کارگر اضافی:</strong> برای هر کارگر بیش از 4 نفر، این نرخ به قیمت اضافه می‌شود
              </li>
              <li>
                • <strong>مثال محاسبه:</strong> وانت با 6 کارگر = نرخ پایه وانت + (2 × نرخ کارگر اضافی وانت)
              </li>
              <li>
                • تمام قیمت‌ها به تومان هستند
              </li>
              <li>
                • پس از ذخیره، تغییرات بلافاصله در محاسبات قیمت اعمال می‌شود
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Save Button - Bottom */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            <Save className="w-5 h-5 ml-2" />
            {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingSettingsPage;