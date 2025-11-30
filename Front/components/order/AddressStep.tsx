import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { MapPin, ArrowRight } from 'lucide-react';
import { Address } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { AddressInput } from '../AddressInput';

interface AddressStepProps {
  originAddress?: Address;
  destinationAddress?: Address;
  onUpdate: (data: { originAddress?: Address; destinationAddress?: Address }) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const AddressStep = ({
  originAddress,
  destinationAddress,
  onUpdate,
  onBack,
  showBackButton = false,
}: AddressStepProps) => {
  const { user } = useAuth();

  const handleOriginChange = (address: Partial<Address>) => {
    const newAddress: Address = {
      id: originAddress?.id || Math.random().toString(),
      userId: user?.id || 'guest',
      title: address.title || 'آدرس مبدا',
      fullAddress: address.fullAddress || '',
      lat: address.lat || 35.6892,
      lng: address.lng || 51.389,
      district: address.district || '',
      city: address.city || 'تهران',
      province: address.province || 'تهران',
      postalCode: address.postalCode,
      details: address.details,
      createdAt: new Date(),
    };
    onUpdate({ originAddress: newAddress, destinationAddress });
  };

  const handleDestinationChange = (address: Partial<Address>) => {
    const newAddress: Address = {
      id: destinationAddress?.id || Math.random().toString(),
      userId: user?.id || 'guest',
      title: address.title || 'آدرس مقصد',
      fullAddress: address.fullAddress || '',
      lat: address.lat || 35.7219,
      lng: address.lng || 51.4056,
      district: address.district || '',
      city: address.city || 'تهران',
      province: address.province || 'تهران',
      postalCode: address.postalCode,
      details: address.details,
      createdAt: new Date(),
    };
    onUpdate({ originAddress, destinationAddress: newAddress });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="mb-2">آدرس مبدا و مقصد</h2>
          <p className="text-muted-foreground">
            آدرس‌ها را می‌توانید به صورت دستی وارد کنید یا از روی نقشه انتخاب نمایید
          </p>
        </div>
        {showBackButton && onBack && (
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowRight className="ml-2 h-4 w-4" />
            بازگشت
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* آدرس مبدا */}
          <AddressInput
            label="آدرس مبدا (بارگیری)"
            value={originAddress}
            onChange={handleOriginChange}
            placeholder="آدرس مبدا را وارد کنید یا از روی نقشه انتخاب کنید"
            required
          />

          {/* جدا کننده */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-muted-foreground">
                ↓
              </span>
            </div>
          </div>

          {/* آدرس مقصد */}
          <AddressInput
            label="آدرس مقصد (تخلیه)"
            value={destinationAddress}
            onChange={handleDestinationChange}
            placeholder="آدرس مقصد را وارد کنید یا از روی نقشه انتخاب کنید"
            required
          />
        </CardContent>
      </Card>
    </div>
  );
};