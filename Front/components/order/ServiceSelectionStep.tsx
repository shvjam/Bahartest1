import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Check, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { serviceCategoryService } from '../../services/api/service-category.service.real';
import type { ServiceCategoryResponse } from '../../types/backend.types';
import { useApiCall } from '../../lib/hooks/useApiCall';

interface ServiceSelectionStepProps {
  selectedService?: ServiceCategoryResponse;
  onSelectService: (service: ServiceCategoryResponse) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const ServiceSelectionStep = ({
  selectedService,
  onSelectService,
  onBack,
  showBackButton = false,
}: ServiceSelectionStepProps) => {
  // استفاده از Custom Hook برای جلوگیری از infinite loop
  const { data: services, isLoading, error, refetch } = useApiCall(
    () => serviceCategoryService.getActiveServices(),
    {
      autoFetch: true,
      showErrorToast: true,
    }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="mb-2">چه خدمتی نیاز دارید؟</h2>
          <p className="text-muted-foreground">لطفاً نوع خدمت مورد نظر خود را انتخاب کنید</p>
        </div>
        {showBackButton && onBack && (
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowRight className="w-4 h-4 ml-2" />
            بازگشت
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error.message}</p>
          <Button onClick={refetch} variant="outline">
            تلاش مجدد
          </Button>
        </div>
      )}

      {/* Services Grid */}
      {!isLoading && !error && services && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedService?.id === service.id
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border'
              }`}
              onClick={() => onSelectService(service)}
            >
              <CardContent className="p-6 relative">
                {selectedService?.id === service.id && (
                  <div className="absolute left-4 top-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center space-y-3">
                  {service.iconUrl && (
                    <img src={service.iconUrl} alt={service.name} className="w-16 h-16" />
                  )}
                  {!service.iconUrl && <div className="text-4xl">📦</div>}
                  <h3 className="text-lg">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && services && services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">در حال حاضر خدمتی فعال نیست</p>
        </div>
      )}
    </div>
  );
};