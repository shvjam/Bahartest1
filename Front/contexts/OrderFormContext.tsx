import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { OrderFormState, ServiceCategory, Address, PackingType, PackingItem, OrderItem, PriceBreakdown } from '../types';
import { pricingService } from '../services/api';

interface OrderFormContextType {
  formState: OrderFormState;
  updateFormState: (updates: Partial<OrderFormState>) => void;
  resetForm: () => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  calculatePrice: () => void;
}

const OrderFormContext = createContext<OrderFormContextType | undefined>(undefined);

export const useOrderForm = () => {
  const context = useContext(OrderFormContext);
  if (!context) {
    throw new Error('useOrderForm must be used within OrderFormProvider');
  }
  return context;
};

interface OrderFormProviderProps {
  children: ReactNode;
}

const initialFormState: OrderFormState = {
  step: 1,
};

// Function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

export const OrderFormProvider = ({ children }: OrderFormProviderProps) => {
  const [formState, setFormState] = useState<OrderFormState>(initialFormState);
  const [pricingConfig, setPricingConfig] = useState<any>(null);

  // Load pricing config on mount
  useEffect(() => {
    const loadPricingConfig = async () => {
      try {
        const config = await pricingService.getPricingConfig();
        setPricingConfig(config);
      } catch (error) {
        // Use default pricing config silently (no warning)
        setPricingConfig({
          perKmRate: 15000,
          pickupRate: 1500000,
          nissanRate: 2000000,
          truckRate: 2500000,
          heavyTruckRate: 2660300,
          baseWorkerRate: 200000,
          perFloorRate: 75000,
          packingHourlyRate: 200000,
        });
      }
    };
    loadPricingConfig();
  }, []);

  const updateFormState = (updates: Partial<OrderFormState>) => {
    setFormState(prev => {
      const newState = { ...prev, ...updates };
      
      // Calculate distance when both addresses are set
      if (updates.originAddress || updates.destinationAddress) {
        const origin = updates.originAddress || prev.originAddress;
        const destination = updates.destinationAddress || prev.destinationAddress;
        
        if (origin && destination) {
          const distance = calculateDistance(
            origin.lat,
            origin.lng,
            destination.lat,
            destination.lng
          );
          newState.distanceKm = distance;
        }
      }
      
      return newState;
    });
  };

  const resetForm = () => {
    setFormState(initialFormState);
  };

  const goToStep = (step: number) => {
    setFormState(prev => ({ ...prev, step }));
  };

  const nextStep = () => {
    setFormState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const prevStep = () => {
    setFormState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  };

  const calculatePrice = () => {
    if (!pricingConfig) {
      // تنظیمات قیمت‌گذاری هنوز بارگذاری نشده است
      return;
    }

    const breakdown: PriceBreakdown[] = [];
    let totalPrice = 0;

    // 1. هزینه پایه خودرو + کارگرهای پایه
    if (formState.workerCount && formState.workerCount >= 4 && formState.vehicleType) {
      // نرخ پایه خودرو
      const vehicleRates = pricingConfig.baseVehicleRates || {
        PICKUP: 1500000,
        NISSAN: 2000000,
        TRUCK: 2500000,
        HEAVY_TRUCK: 2660300,
      };

      const vehiclePrice = vehicleRates[formState.vehicleType] || vehicleRates.PICKUP;

      breakdown.push({
        label: 'هزینه پایه خودرو',
        quantity: 1,
        unitPrice: vehiclePrice,
        totalPrice: vehiclePrice,
        description: `نوع خودرو و کارگرهای پایه`,
      });
      totalPrice += vehiclePrice;

      // 2. هزینه کارگرهای اضافی (بیشتر از 4 نفر)
      // هر نوع ماشین حداقل 4 کارگر دارد، اگر بیشتر باشد باید هزینه اضافی محاسبه شود
      const minWorkers = 4;
      if (formState.workerCount > minWorkers) {
        const additionalWorkers = formState.workerCount - minWorkers;
        const workerRatesByVehicle = pricingConfig.workerRatesByVehicle || {
          PICKUP: 300000,
          NISSAN: 350000,
          TRUCK: 400000,
          HEAVY_TRUCK: 450000,
        };
        
        const workerRate = workerRatesByVehicle[formState.vehicleType] || workerRatesByVehicle.PICKUP;
        const additionalWorkersPrice = additionalWorkers * workerRate;

        breakdown.push({
          label: 'هزینه کارگرهای اضافی',
          quantity: additionalWorkers,
          unitPrice: workerRate,
          totalPrice: additionalWorkersPrice,
          description: `${additionalWorkers} کارگر اضافی`,
        });
        totalPrice += additionalWorkersPrice;
      }
    }

    // 3. هزینه مسافت - محاسبه برای کل مسافت
    if (formState.distanceKm && formState.distanceKm > 0) {
      const perKmRate = pricingConfig.perKmRate || 15000;
      const distancePrice = Math.round(formState.distanceKm * perKmRate);
      breakdown.push({
        label: 'هزینه مسافت',
        quantity: Math.round(formState.distanceKm * 10) / 10, // Round to 1 decimal
        unitPrice: perKmRate,
        totalPrice: distancePrice,
        description: `${Math.round(formState.distanceKm * 10) / 10} کیلومتر`,
      });
      totalPrice += distancePrice;
    }

    // 4. هزینه طبقه مبدا
    if (formState.originFloor && formState.originFloor > 1) {
      const rate = formState.originHasElevator 
        ? (pricingConfig.perFloorWithElevatorRate || 30000)
        : (pricingConfig.perFloorWithoutElevatorRate || pricingConfig.perFloorRate || 75000);
      
      const floorPrice = (formState.originFloor - 1) * rate;
      breakdown.push({
        label: 'هزینه طبقه مبدا',
        quantity: formState.originFloor - 1,
        unitPrice: rate,
        totalPrice: floorPrice,
        description: formState.originHasElevator ? 'با آسانسور' : 'بدون آسانسور',
      });
      totalPrice += floorPrice;
    }

    // 5. هزینه طبقه مقصد
    if (formState.destinationFloor && formState.destinationFloor > 1) {
      const rate = formState.destinationHasElevator 
        ? (pricingConfig.perFloorWithElevatorRate || 30000)
        : (pricingConfig.perFloorWithoutElevatorRate || pricingConfig.perFloorRate || 75000);
      
      const floorPrice = (formState.destinationFloor - 1) * rate;
      breakdown.push({
        label: 'هزینه طبقه مقصد',
        quantity: formState.destinationFloor - 1,
        unitPrice: rate,
        totalPrice: floorPrice,
        description: formState.destinationHasElevator ? 'با آسانسور' : 'بدون آسانسور',
      });
      totalPrice += floorPrice;
    }

    // 6. هزینه مسافت پیاده‌روی
    if (formState.walkDistance && formState.walkDistance > 0) {
      const walkRates: Record<number, number> = pricingConfig.walkingDistanceRates || {
        20: 200000,
        35: 350000,
        40: 400000,
        50: 500000,
        65: 800000,
      };
      const walkPrice = walkRates[formState.walkDistance] || 0;
      if (walkPrice > 0) {
        breakdown.push({
          label: 'هزینه مسافت پیاده‌روی',
          quantity: 1,
          unitPrice: walkPrice,
          totalPrice: walkPrice,
          description: `${formState.walkDistance} متر`,
        });
        totalPrice += walkPrice;
      }
    }

    // 7. هزینه بسته‌بندی
    if (formState.needsPacking && formState.packingDuration) {
      const packingWorkers = (formState.packingWorkerGender?.male || 0) + (formState.packingWorkerGender?.female || 0);
      if (packingWorkers > 0) {
        const packingHourlyRate = pricingConfig.packingHourlyRate || 200000;
        const packingPrice = packingWorkers * formState.packingDuration * packingHourlyRate;
        breakdown.push({
          label: 'هزینه بسته‌بندی',
          quantity: packingWorkers,
          unitPrice: formState.packingDuration * packingHourlyRate,
          totalPrice: packingPrice,
          description: `${packingWorkers} نفر × ${formState.packingDuration} ساعت`,
        });
        totalPrice += packingPrice;
      }
    }

    // 8. هزینه وسایل سنگین
    if (formState.heavyItems && formState.heavyItems.length > 0) {
      formState.heavyItems.forEach((item) => {
        breakdown.push({
          label: `هزینه جابجایی ${item.catalogItem?.name || item.catalogItemId}`,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        });
        totalPrice += item.totalPrice;
      });
    }

    // 9. هزینه مواد بسته‌بندی
    if (formState.needsPackingMaterials) {
      // اگر کاربر محصولات رو انتخاب کرده، قیمت واقعی محاسبه بشه
      if (formState.selectedPackingProducts && formState.selectedPackingProducts.length > 0) {
        formState.selectedPackingProducts.forEach((product) => {
          breakdown.push({
            label: `${product.name}`,
            quantity: product.quantity,
            unitPrice: product.unitPrice,
            totalPrice: product.totalPrice,
            description: 'مواد بسته‌بندی',
          });
          totalPrice += product.totalPrice;
        });
      } else if (pricingConfig.includePackingMaterialsInInvoice !== false) {
        // اگر محصولات انتخاب نشده و ادمین این هزینه رو فعال کرده، هزینه تخمینی محاسبه بشه
        const materialsPrice = pricingConfig.packingMaterialsEstimatedCost || 500000;
        breakdown.push({
          label: 'هزینه مواد بسته‌بندی (تخمینی)',
          quantity: 1,
          unitPrice: materialsPrice,
          totalPrice: materialsPrice,
          description: 'کارتن، چسب، پلاستیک و...',
        });
        totalPrice += materialsPrice;
      }
    }

    updateFormState({
      estimatedPrice: totalPrice,
      priceBreakdown: breakdown,
    });
  };

  const value: OrderFormContextType = {
    formState,
    updateFormState,
    resetForm,
    goToStep,
    nextStep,
    prevStep,
    calculatePrice,
  };

  return <OrderFormContext.Provider value={value}>{children}</OrderFormContext.Provider>;
};