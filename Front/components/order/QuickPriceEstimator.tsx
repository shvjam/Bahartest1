import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Calculator } from 'lucide-react';

export const QuickPriceEstimator = () => {
  const [floors, setFloors] = useState(1);
  const [workers, setWorkers] = useState(4);
  const [distance, setDistance] = useState(10);

  const basePrice = 1500000; // Base vehicle price
  const floorPrice = (floors - 1) * 75000 * 2; // Both origin and destination
  const distancePrice = Math.max(0, (distance - 10) * 15000);
  const totalEstimate = basePrice + floorPrice + distancePrice;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          برآورد سریع قیمت
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>طبقه: {floors}</Label>
          <Slider
            value={[floors]}
            onValueChange={(value) => setFloors(value[0])}
            min={1}
            max={9}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label>تعداد کارگر: {workers} نفر</Label>
          <Slider
            value={[workers]}
            onValueChange={(value) => setWorkers(value[0])}
            min={4}
            max={8}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label>مسافت: {distance} کیلومتر</Label>
          <Slider
            value={[distance]}
            onValueChange={(value) => setDistance(value[0])}
            min={5}
            max={50}
            step={5}
          />
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">برآورد اولیه:</span>
            <span className="font-medium text-primary">{formatPrice(totalEstimate)} تومان</span>
          </div>
          <p className="text-xs text-muted-foreground">
            💡 برای محاسبه دقیق، فرم سفارش را تکمیل کنید
          </p>
        </div>

        <Button className="w-full" variant="outline">
          شروع ثبت سفارش
        </Button>
      </CardContent>
    </Card>
  );
};
