import { useState, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import type { Address } from '../types';

interface AddressMapPickerProps {
  open: boolean;
  onClose: () => void;
  onSelectAddress: (address: Partial<Address>) => void;
  initialLocation?: { lat: number; lng: number };
  title?: string;
}

// تعریف Type برای Leaflet
declare global {
  interface Window {
    L: any;
  }
}

export function AddressMapPicker({
  open,
  onClose,
  onSelectAddress,
  initialLocation,
  title = 'انتخاب آدرس از روی نقشه',
}: AddressMapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || { lat: 35.6892, lng: 51.389 } // مرکز تهران
  );
  const [address, setAddress] = useState<Partial<Address>>({
    fullAddress: '',
    city: 'تهران',
    province: 'تهران',
    district: '',
  });

  // بارگذاری Leaflet CSS و JS
  useEffect(() => {
    if (!open) return;

    // بررسی اینکه آیا CSS قبلاً لود شده یا نه
    const existingLink = document.getElementById('leaflet-css');
    if (!existingLink) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // بارگذاری Leaflet JS
    const existingScript = document.getElementById('leaflet-js');
    if (!existingScript && !window.L) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.async = true;
      script.onload = () => setIsLeafletLoaded(true);
      document.head.appendChild(script);
    } else if (window.L) {
      setIsLeafletLoaded(true);
    }
  }, [open]);

  // ایجاد نقشه
  useEffect(() => {
    if (!open || !mapRef.current || !isLeafletLoaded || !window.L) return;

    // پاک کردن نقشه قبلی
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    }

    const L = window.L;

    // ایجاد نقشه
    const map = L.map(mapRef.current).setView(
      [selectedLocation.lat, selectedLocation.lng],
      13
    );

    // اضافه کردن تایل‌های OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // اضافه کردن مارکر
    const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
      draggable: true,
    }).addTo(map);

    // به‌روزرسانی موقعیت با کشیدن مارکر
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      handleLocationChange(position.lat, position.lng);
    });

    // کلیک روی نقشه
    map.on('click', (e: any) => {
      marker.setLatLng(e.latlng);
      handleLocationChange(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [open, isLeafletLoaded]);

  // تغییر موقعیت
  const handleLocationChange = async (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    
    // Reverse Geocoding برای دریافت آدرس
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`
      );
      const data = await response.json();
      
      const newAddress: Partial<Address> = {
        fullAddress: data.display_name || '',
        lat,
        lng,
        city: data.address?.city || data.address?.town || data.address?.village || 'تهران',
        province: data.address?.state || 'تهران',
        district: data.address?.suburb || data.address?.neighbourhood || '',
        postalCode: data.address?.postcode,
      };
      
      setAddress(newAddress);
    } catch (error) {
      console.error('خطا در دریافت آدرس:', error);
    }
  };

  // جستجوی آدرس
  const handleSearch = async () => {
    if (!searchQuery.trim() || !window.L) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ', ایران'
        )}&accept-language=fa&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        
        // به‌روزرسانی نقشه و مارکر
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 15);
          markerRef.current.setLatLng([lat, lng]);
          handleLocationChange(lat, lng);
        }
      }
    } catch (error) {
      console.error('خطا در جستجو:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // تایید انتخاب
  const handleConfirm = () => {
    onSelectAddress(address);
    onClose();
  };

  // دریافت موقعیت فعلی کاربر
  const handleGetCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('مرورگر شما از قابلیت موقعیت‌یابی پشتیبانی نمی‌کند.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 15);
          markerRef.current.setLatLng([lat, lng]);
          handleLocationChange(lat, lng);
        }
      },
      (error) => {
        // مدیریت انواع خطاهای Geolocation
        let errorMessage = 'امکان دریافت موقعیت فعلی وجود ندارد.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'دسترسی به موقعیت مکانی رد شد. لطفاً در تنظیمات مرورگر اجازه دسترسی به موقعیت را فعال کنید.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'اطلاعات موقعیت مکانی در دسترس نیست.';
            break;
          case error.TIMEOUT:
            errorMessage = 'زمان درخواست موقعیت مکانی به پایان رسید.';
            break;
        }
        
        console.error('خطا در دریافت موقعیت:', {
          code: error.code,
          message: error.message,
          errorType: error.code === 1 ? 'PERMISSION_DENIED' : 
                     error.code === 2 ? 'POSITION_UNAVAILABLE' : 
                     error.code === 3 ? 'TIMEOUT' : 'UNKNOWN'
        });
        
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0" aria-describedby="map-picker-description">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="size-5 text-blue-600" />
              {title}
            </DialogTitle>
            <DialogDescription id="map-picker-description" className="sr-only">
              انتخاب آدرس از روی نقشه با امکان جستجو و دریافت موقعیت فعلی
            </DialogDescription>
          </DialogHeader>

          {/* جستجو */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="جستجوی آدرس... (مثال: میدان آزادی، تهران)"
                  className="pr-10"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !isLeafletLoaded}
                variant="outline"
              >
                {isSearching ? 'در حال جستجو...' : 'جستجو'}
              </Button>
              <Button 
                onClick={handleGetCurrentLocation} 
                variant="outline"
                disabled={!isLeafletLoaded}
              >
                <MapPin className="size-4" />
                موقعیت فعلی
              </Button>
            </div>
          </div>

          {/* نقشه */}
          <div className="flex-1 relative">
            {!isLeafletLoaded ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">در حال بارگذاری نقشه...</p>
                </div>
              </div>
            ) : (
              <div ref={mapRef} className="w-full h-full" />
            )}
            
            {/* راهنما */}
            {isLeafletLoaded && (
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-lg shadow-lg p-3 text-sm max-w-xs">
                <p className="font-medium mb-1">📍 راهنما:</p>
                <ul className="text-gray-600 space-y-1 text-xs">
                  <li>• روی نقشه کلیک کنید یا مارکر را بکشید</li>
                  <li>• از جستجو برای یافتن آدرس استفاده کنید</li>
                  <li>• با اسکرول زوم کنید</li>
                </ul>
              </div>
            )}
          </div>

          {/* آدرس انتخاب شده */}
          {address.fullAddress && (
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm mb-1">آدرس انتخاب شده:</p>
                  <p className="text-sm text-gray-600">{address.fullAddress}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {address.city} • {address.province}
                    {address.district && ` • ${address.district}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* دکمه‌ها */}
          <div className="px-6 py-4 border-t flex gap-2 justify-end">
            <Button onClick={onClose} variant="outline">
              انصراف
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!address.fullAddress}
            >
              تایید انتخاب
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}