import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { MapPin, Navigation, Trash2, Map } from 'lucide-react';

interface MapSelectorProps {
  onOriginSelect?: (lat: number, lng: number, address: string) => void;
  onDestinationSelect?: (lat: number, lng: number, address: string) => void;
  originMarker?: { lat: number; lng: number } | null;
  destinationMarker?: { lat: number; lng: number } | null;
}

export const MapSelector = ({
  onOriginSelect,
  onDestinationSelect,
  originMarker,
  destinationMarker,
}: MapSelectorProps) => {
  const [showMap, setShowMap] = useState(false);
  const [selectingType, setSelectingType] = useState<'origin' | 'destination' | null>(null);
  const [mapCenter] = useState<[number, number]>([35.6892, 51.389]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          alert(`موقعیت شما: ${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('نتوانستیم موقعیت شما را دریافت کنیم.');
        }
      );
    } else {
      alert('مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند.');
    }
  };

  return (
    <Card className="border-2 border-primary">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2">
            <Map className="w-5 h-5 text-primary" />
            انتخاب از روی نقشه
          </h3>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGetCurrentLocation}
            >
              <Navigation className="w-4 h-4 ml-2" />
              موقعیت من
            </Button>
            <Button
              type="button"
              variant={showMap ? 'secondary' : 'default'}
              size="sm"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? 'بستن نقشه' : 'باز کردن نقشه'}
            </Button>
          </div>
        </div>

        {showMap && (
          <div className="space-y-4">
            <div className="p-8 bg-muted rounded-lg text-center">
              <Map className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                نقشه تعاملی در نسخه بعدی اضافه خواهد شد
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                فعلاً می‌توانید آدرس را به صورت دستی وارد کنید
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="font-medium flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-green-600" />
                  مبدا:
                </p>
                <p className="text-xs text-muted-foreground">
                  {originMarker
                    ? `${originMarker.lat.toFixed(6)}, ${originMarker.lng.toFixed(6)}`
                    : 'انتخاب نشده'}
                </p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="font-medium flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-red-600" />
                  مقصد:
                </p>
                <p className="text-xs text-muted-foreground">
                  {destinationMarker
                    ? `${destinationMarker.lat.toFixed(6)}, ${destinationMarker.lng.toFixed(6)}`
                    : 'انتخاب نشده'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
