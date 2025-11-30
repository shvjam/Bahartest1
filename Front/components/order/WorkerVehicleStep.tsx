import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { VEHICLE_TYPES, WORKER_COUNT_OPTIONS } from '../../constants';
import { VehicleType } from '../../types';
import { ArrowRight } from 'lucide-react';

interface WorkerVehicleStepProps {
  workerCount?: number;
  vehicleType?: VehicleType;
  onUpdate: (data: { workerCount: number; vehicleType: VehicleType }) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const WorkerVehicleStep = ({
  workerCount = 4,
  vehicleType,
  onUpdate,
  onBack,
  showBackButton = false,
}: WorkerVehicleStepProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="mb-2">تعداد کارگر و نوع خودرو</h2>
          <p className="text-muted-foreground">
            با توجه به حجم بار خود، تعداد کارگر و نوع خودرو را انتخاب کنید
          </p>
        </div>
        {showBackButton && onBack && (
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowRight className="w-4 h-4 ml-2" />
            بازگشت
          </Button>
        )}
      </div>

      {/* Worker Count */}
      <div className="space-y-4">
        <h3>تعداد کارگر مورد نیاز</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {WORKER_COUNT_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={workerCount === option.value ? 'default' : 'outline'}
              onClick={() =>
                onUpdate({
                  workerCount: option.value,
                  vehicleType: vehicleType || VehicleType.PICKUP,
                })
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          💡 برای اسباب‌کشی منزل معمولی ۴-۶ نفر کافی است
        </p>
      </div>

      {/* Vehicle Type */}
      <div className="space-y-4">
        <h3>نوع خودرو</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {VEHICLE_TYPES.map((vehicle) => (
            <Card
              key={vehicle.value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                vehicleType === vehicle.value ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
              onClick={() =>
                onUpdate({
                  workerCount,
                  vehicleType: vehicle.value,
                })
              }
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="text-4xl">{vehicle.icon}</div>
                  <div>
                    <Label className="text-lg">{vehicle.label}</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      ظرفیت: {vehicle.capacity}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="p-4 bg-accent rounded-lg space-y-2">
        <p className="text-sm">
          💡 <strong>راهنمای انتخاب:</strong>
        </p>
        <ul className="text-sm space-y-1 mr-6">
          <li>• وانت: مناسب برای چند قلم وسیله یا منزل کوچک</li>
          <li>• نیسان: مناسب برای منزل ۵۰-۸۰ متری</li>
          <li>• کامیون: مناسب برای منزل ۸۰-۱۲۰ متری</li>
          <li>• خاور: مناسب برای منزل بزرگ یا اداری</li>
        </ul>
      </div>
    </div>
  );
};