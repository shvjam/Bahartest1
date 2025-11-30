import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { FLOOR_OPTIONS, WALKING_DISTANCE_OPTIONS } from '../../constants';
import { Checkbox } from '../ui/checkbox';
import { ArrowRight } from 'lucide-react';

interface FloorDetailsStepProps {
  originFloor?: number;
  originHasElevator?: boolean;
  destinationFloor?: number;
  destinationHasElevator?: boolean;
  walkDistance?: number;
  onUpdate: (data: {
    originFloor: number;
    originHasElevator: boolean;
    destinationFloor: number;
    destinationHasElevator: boolean;
    walkDistance: number;
  }) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const FloorDetailsStep = ({
  originFloor = 1,
  originHasElevator = false,
  destinationFloor = 1,
  destinationHasElevator = false,
  walkDistance = 0,
  onUpdate,
  onBack,
  showBackButton = false,
}: FloorDetailsStepProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex-1 text-right">
          <h2 className="mb-2">جزئیات مبدا و مقصد</h2>
          <p className="text-muted-foreground">
            اطلاعات طبقه و مسافت پیاده‌روی برای محاسبه دقیق‌تر هزینه
          </p>
        </div>
        {showBackButton && onBack && (
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowRight className="w-4 h-4 ml-2" />
            بازگشت
          </Button>
        )}
      </div>

      {/* Origin Floor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3>طبقه مبدا</h3>
          <div className="flex items-center gap-3 flex-row-reverse">
            <Checkbox
              id="origin-elevator"
              checked={originHasElevator}
              onCheckedChange={(checked) =>
                onUpdate({
                  originFloor: typeof originFloor === 'number' ? originFloor : 0,
                  originHasElevator: checked as boolean,
                  destinationFloor: typeof destinationFloor === 'number' ? destinationFloor : 0,
                  destinationHasElevator,
                  walkDistance: walkDistance || 0,
                })
              }
            />
            <Label htmlFor="origin-elevator" className="cursor-pointer">
              آسانسور دارد
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {FLOOR_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={originFloor === option.value ? 'default' : 'outline'}
              onClick={() =>
                onUpdate({
                  originFloor: option.value,
                  originHasElevator,
                  destinationFloor: typeof destinationFloor === 'number' ? destinationFloor : 0,
                  destinationHasElevator,
                  walkDistance: walkDistance || 0,
                })
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Destination Floor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3>طبقه مقصد</h3>
          <div className="flex items-center gap-3 flex-row-reverse">
            <Checkbox
              id="destination-elevator"
              checked={destinationHasElevator}
              onCheckedChange={(checked) =>
                onUpdate({
                  originFloor: typeof originFloor === 'number' ? originFloor : 0,
                  originHasElevator,
                  destinationFloor: typeof destinationFloor === 'number' ? destinationFloor : 0,
                  destinationHasElevator: checked as boolean,
                  walkDistance: walkDistance || 0,
                })
              }
            />
            <Label htmlFor="destination-elevator" className="cursor-pointer">
              آسانسور دارد
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {FLOOR_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={destinationFloor === option.value ? 'default' : 'outline'}
              onClick={() =>
                onUpdate({
                  originFloor: typeof originFloor === 'number' ? originFloor : 0,
                  originHasElevator,
                  destinationFloor: option.value,
                  destinationHasElevator,
                  walkDistance: walkDistance || 0,
                })
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Walking Distance */}
      <div className="space-y-4">
        <div className="text-right">
          <h3>مسافت پیاده‌روی تا محل پارک ماشین</h3>
          <p className="text-sm text-muted-foreground mt-1">
            اگر ماشین نمی‌تواند دقیقاً جلوی درب پارک کند، مسافت را مشخص کنید
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {WALKING_DISTANCE_OPTIONS.map((option) => (
            <Card
              key={option.value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                walkDistance === option.value ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
              onClick={() =>
                onUpdate({
                  originFloor: typeof originFloor === 'number' ? originFloor : 0,
                  originHasElevator,
                  destinationFloor: typeof destinationFloor === 'number' ? destinationFloor : 0,
                  destinationHasElevator,
                  walkDistance: option.value,
                })
              }
            >
              <CardContent className="p-4 text-center">
                <p>{option.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="p-4 bg-accent rounded-lg text-right">
        <p className="text-sm">
          💡 اطلاعات دقیق‌تر، محاسبه بهتر! این اطلاعات به ما کمک می‌کند تا نیروی کار
          و زمان مورد نیاز را بهتر تخمین بزنیم.
        </p>
      </div>
    </div>
  );
};