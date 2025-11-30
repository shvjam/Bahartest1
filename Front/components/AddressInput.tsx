import { useState } from 'react';
import { MapPin, Edit3 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AddressMapPicker } from './AddressMapPicker';
import type { Address } from '../types';

interface AddressInputProps {
  label: string;
  value: Partial<Address> | null;
  onChange: (address: Partial<Address>) => void;
  placeholder?: string;
  required?: boolean;
}

export function AddressInput({
  label,
  value,
  onChange,
  placeholder = 'آدرس را وارد کنید یا از روی نقشه انتخاب کنید',
  required = false,
}: AddressInputProps) {
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);

  // انتخاب از روی نقشه
  const handleMapSelect = (address: Partial<Address>) => {
    onChange(address);
    setIsManualMode(false);
  };

  // ویرایش دستی
  const handleManualEdit = () => {
    setIsManualMode(true);
    setManualAddress(value?.fullAddress || '');
  };

  // ذخیره آدرس دستی
  const handleManualSave = () => {
    if (manualAddress.trim()) {
      onChange({
        ...value,
        fullAddress: manualAddress,
      });
      setIsManualMode(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </Label>

      <div className="flex gap-2">
        {/* نمایش آدرس یا Input دستی */}
        {isManualMode ? (
          <div className="flex-1 flex gap-2">
            <Input
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="آدرس را وارد کنید..."
              onKeyDown={(e) => e.key === 'Enter' && handleManualSave()}
            />
            <Button onClick={handleManualSave} size="sm">
              ذخیره
            </Button>
            <Button
              onClick={() => setIsManualMode(false)}
              variant="outline"
              size="sm"
            >
              انصراف
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 relative">
              {value?.fullAddress ? (
                <div className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-start gap-2">
                    <MapPin className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{value.fullAddress}</p>
                      {value.city && (
                        <p className="text-xs text-gray-500 mt-1">
                          {value.city}
                          {value.province && value.province !== value.city && ` • ${value.province}`}
                          {value.district && ` • ${value.district}`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed rounded-lg p-3 text-center text-gray-400">
                  <p className="text-sm">{placeholder}</p>
                </div>
              )}
            </div>

            {/* دکمه‌های عملیات */}
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setShowMapPicker(true)}
                variant={value?.fullAddress ? 'outline' : 'default'}
              >
                <MapPin className="size-4" />
                {value?.fullAddress ? 'تغییر' : 'انتخاب از نقشه'}
              </Button>
              
              {value?.fullAddress && (
                <Button
                  type="button"
                  onClick={handleManualEdit}
                  variant="outline"
                  size="icon"
                >
                  <Edit3 className="size-4" />
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {/* نمایش مختصات (برای دیباگ) */}
      {value?.lat && value?.lng && (
        <p className="text-xs text-gray-400">
          📍 مختصات: {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
        </p>
      )}

      {/* Map Picker Dialog */}
      <AddressMapPicker
        open={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onSelectAddress={handleMapSelect}
        initialLocation={
          value?.lat && value?.lng
            ? { lat: value.lat, lng: value.lng }
            : undefined
        }
        title={label}
      />
    </div>
  );
}
