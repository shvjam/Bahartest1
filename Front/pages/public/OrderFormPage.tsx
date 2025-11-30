import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderForm } from '../../contexts/OrderFormContext';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../constants';
import { ServiceCategory, Address, PackingType, PackingItem, OrderItem, VehicleType, SelectedPackingProduct } from '../../types';

// Import Step Components
import { StepIndicator } from '../../components/order/StepIndicator';
import { PriceBreakdownCard } from '../../components/order/PriceBreakdownCard';
import { ServiceSelectionStep } from '../../components/order/ServiceSelectionStep';
import { PackingStep } from '../../components/order/PackingStep';
import { HeavyItemsStep } from '../../components/order/HeavyItemsStep';
import { FloorDetailsStep } from '../../components/order/FloorDetailsStep';
import { WorkerVehicleStep } from '../../components/order/WorkerVehicleStep';
import { AddressStep } from '../../components/order/AddressStep';
import { DateTimeStep } from '../../components/order/DateTimeStep';
import { SummaryStep } from '../../components/order/SummaryStep';

export const OrderFormPage = () => {
  const { serviceSlug } = useParams();
  const navigate = useNavigate();
  const { formState, updateFormState, nextStep, prevStep, calculatePrice, resetForm } = useOrderForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formContentRef = useRef<HTMLDivElement>(null);

  // Initialize service from URL
  useEffect(() => {
    if (serviceSlug && !formState.serviceCategory) {
      const service = SERVICE_CATEGORIES.find((s) => s.slug === serviceSlug);
      if (service) {
        updateFormState({ serviceCategory: service as ServiceCategory, step: 2 });
      }
    }
  }, [serviceSlug, formState.serviceCategory, updateFormState]);

  // Scroll to form content when step changes
  useEffect(() => {
    if (formContentRef.current) {
      formContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [formState.step]);

  // Recalculate price when form state changes
  useEffect(() => {
    if (formState.step >= 3) {
      calculatePrice();
    }
  }, [
    formState.workerCount,
    formState.originFloor,
    formState.destinationFloor,
    formState.originHasElevator,
    formState.destinationHasElevator,
    formState.walkDistance,
    formState.needsPacking,
    formState.packingDuration,
    formState.packingWorkerGender,
    formState.heavyItems,
    formState.needsPackingMaterials,
    formState.packingMaterialsMode,
    formState.selectedPackingProducts,
    formState.distanceKm,
  ]);

  // Determine steps based on service
  const getSteps = () => {
    const baseSteps = [
      { number: 1, title: 'انتخاب خدمت' },
      { number: 2, title: 'بسته‌بندی' },
      { number: 3, title: 'وسایل سنگین' },
      { number: 4, title: 'جزئیات' },
      { number: 5, title: 'نیروی کار' },
      { number: 6, title: 'آدرس‌ها' },
      { number: 7, title: 'زمان' },
      { number: 8, title: 'خلاصه' },
    ];

    // Customize based on service type
    if (formState.serviceCategory?.slug === 'packing-products') {
      return [
        { number: 1, title: 'انتخاب خدمت' },
        { number: 2, title: 'محصولات' },
        { number: 3, title: 'آدرس' },
        { number: 4, title: 'خلاصه' },
      ];
    }

    return baseSteps;
  };

  const steps = getSteps();
  const maxSteps = steps.length;

  const canProceed = () => {
    switch (formState.step) {
      case 1:
        return !!formState.serviceCategory;
      case 2:
        return formState.needsPacking !== undefined;
      case 3:
        return true; // Heavy items are optional
      case 4:
        return (
          formState.originFloor !== undefined &&
          formState.destinationFloor !== undefined &&
          formState.walkDistance !== undefined
        );
      case 5:
        return formState.workerCount !== undefined && formState.vehicleType !== undefined;
      case 6:
        return !!formState.originAddress && !!formState.destinationAddress;
      case 7:
        return !!formState.preferredDateTime;
      case 8:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast.error('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }

    if (formState.step < maxSteps) {
      nextStep();
    }
  };

  const handlePrev = () => {
    if (formState.step > 1) {
      prevStep();
    }
  };

  const handleSubmit = async (customerNote: string, discountCode?: string) => {
    setIsSubmitting(true);

    try {
      // Mock API call - در production به Backend ارسال می‌شود
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success('سفارش شما با موفقیت ثبت شد!');
      toast.info('کارشناس ما به زودی با شما تماس خواهد گرفت');

      // Reset form and navigate
      resetForm();
      navigate('/');
    } catch (error) {
      toast.error('خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (formState.step) {
      case 1:
        return (
          <ServiceSelectionStep
            
selectedService={formState.serviceCategory as any}
onSelectService={(service) => updateFormState({ serviceCategory: service as any })}
            onBack={handlePrev}
            showBackButton={formState.step > 1}
          />
        );

      case 2:
        return (
          <PackingStep
            needsPacking={formState.needsPacking}
            packingType={formState.packingType}
            packingItems={formState.packingItems}
            packingWorkerGender={formState.packingWorkerGender}
            packingDuration={formState.packingDuration}
            needsPackingMaterials={formState.needsPackingMaterials}
            packingMaterialsMode={formState.packingMaterialsMode}
            selectedPackingProducts={formState.selectedPackingProducts}
            onUpdate={(data) => updateFormState(data)}
            onBack={handlePrev}
            showBackButton={formState.step > 1}
          />
        );

      case 3:
        return (
          <HeavyItemsStep
            heavyItems={formState.heavyItems || []}
            onUpdate={(items) => updateFormState({ heavyItems: items })}
            onBack={handlePrev}
            showBackButton={formState.step > 1}
          />
        );

      case 4:
        return (
          <FloorDetailsStep
            originFloor={formState.originFloor}
            originHasElevator={formState.originHasElevator}
            destinationFloor={formState.destinationFloor}
            destinationHasElevator={formState.destinationHasElevator}
            walkDistance={formState.walkDistance}
            onUpdate={(data) => updateFormState(data)}
            onBack={handlePrev}
            showBackButton={formState.step > 1}
          />
        );

      case 5:
        return (
          <WorkerVehicleStep
            workerCount={formState.workerCount}
            vehicleType={formState.vehicleType}
            onUpdate={(data) => updateFormState(data)}
            onBack={handlePrev}
            showBackButton={formState.step > 1}
          />
        );

      case 6:
        return (
          <AddressStep
            originAddress={formState.originAddress}
            destinationAddress={formState.destinationAddress}
            onUpdate={(data) => updateFormState(data)}
            onBack={handlePrev}
            showBackButton={formState.step > 1}
          />
        );

      case 7:
        return (
          <DateTimeStep
            preferredDateTime={formState.preferredDateTime}
            onUpdate={(dateTime) => {
              updateFormState({ preferredDateTime: dateTime });
              // Mock distance calculation
              updateFormState({ distanceKm: 15 });
            }}
            onBack={handlePrev}
            showBackButton={formState.step > 1}
          />
        );

      case 8:
        return (
          <SummaryStep
            formState={formState}
            priceBreakdown={formState.priceBreakdown || []}
            totalPrice={formState.estimatedPrice || 0}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onBack={handlePrev}
            showBackButton={formState.step > 1}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 bg-muted/30" dir="rtl">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header - Sticky */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 mb-4 border-b text-right">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            بازگشت به صفحه اصلی
          </Button>
          <h1 className="mb-2">ثبت سفارش جدید</h1>
          <p className="text-muted-foreground">
            لطفاً مراحل زیر را با دقت تکمیل کنید تا بهترین قیمت را دریافت نمایید
          </p>
        </div>

        {/* Step Indicator - Sticky */}
        <div className="sticky top-[140px] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 mb-4">
          <StepIndicator steps={steps} currentStep={formState.step} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 mt-8 pb-8">
          {/* Form Steps */}
          <div className="lg:col-span-8 space-y-4 lg:space-y-6">
            {/* Form Card with Enhanced Styling */}
            <div 
              ref={formContentRef} 
              className="relative bg-gradient-to-br from-background via-background to-muted/20 rounded-2xl shadow-lg border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
              
              <div className="p-6 sm:p-8 lg:p-10 text-right">
                <div className="animate-in fade-in duration-500">
                  {renderStep()}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            {formState.step !== 8 && (
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 px-1">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={formState.step === 1}
                  size="lg"
                  className="w-full sm:w-auto min-w-[140px] h-12 sm:h-11 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-md disabled:hover:scale-100"
                >
                  <ArrowRight className="w-5 h-5 ml-2" />
                  مرحله قبل
                </Button>

                <Button 
                  onClick={handleNext} 
                  disabled={!canProceed()}
                  size="lg"
                  className="w-full sm:w-auto min-w-[140px] h-12 sm:h-11 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:hover:scale-100 bg-gradient-to-r from-primary to-primary/90"
                >
                  {formState.step === maxSteps ? 'ثبت سفارش' : 'مرحله بعد'}
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Price Sidebar - Sticky on Desktop */}
          {formState.step >= 3 && formState.step !== 8 && (
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-[220px] space-y-4">
                <div className="animate-in slide-in-from-left duration-500">
                  <PriceBreakdownCard
                    breakdown={formState.priceBreakdown || []}
                    total={formState.estimatedPrice || 0}
                    packingProducts={formState.selectedPackingProducts}
                  />
                </div>
                
                {/* Additional Info Card - Mobile Only */}
                <div className="lg:hidden bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20 text-right">
                  <p className="text-sm text-center text-muted-foreground">
                    💡 قیمت نهایی پس از تکمیل تمام مراحل محاسبه می‌شود
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderFormPage;