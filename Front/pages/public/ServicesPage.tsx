import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { serviceService } from '../../services/api';
import { ServiceCategory } from '../../types';
import { toast } from 'sonner';

export const ServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await serviceService.getActiveServiceCategories();
      // مرتب‌سازی بر اساس order
      const sorted = data.sort((a, b) => a.order - b.order);
      setServices(sorted);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('خطا در بارگذاری خدمات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">در حال بارگذاری خدمات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl mb-4">خدمات باربری بهار</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            خدمات متنوع اسباب‌کشی و باربری متناسب با نیاز شما
          </p>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">در حال حاضر خدمتی موجود نیست</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service) => (
              <Card
                key={service.id}
                className="p-8 hover:shadow-xl transition-all cursor-pointer hover:-translate-y-2 flex flex-col"
              >
                <div className="text-5xl mb-6">{service.icon}</div>
                
                <h2 className="text-xl mb-3">{service.name}</h2>
                
                <p className="text-sm text-muted-foreground mb-6 flex-1">
                  {service.shortDescription || service.description}
                </p>

                {service.discountPercentage && service.discountPercentage > 0 && (
                  <div className="mb-4">
                    <span className="inline-block bg-destructive text-destructive-foreground text-sm px-3 py-1 rounded">
                      {service.discountPercentage}% تخفیف
                    </span>
                  </div>
                )}

                <Button
                  onClick={() => navigate(`/order/${service.slug}`)}
                  className="w-full gap-2"
                >
                  ثبت سفارش
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* Features */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-muted/50 rounded-lg p-8">
            <h2 className="text-2xl mb-6 text-center">مزایای استفاده از خدمات ما</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'قیمت‌گذاری شفاف و عادلانه',
                'بیمه کامل اثاثیه',
                'پشتیبانی 24 ساعته',
                'تحویل به موقع',
                'کارگران ماهر و با تجربه',
                'ناوگان مدرن و مجهز',
                'پیگیری آنلاین سفارش',
                'ضمانت کیفیت خدمات',
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            برای مشاوره رایگان و دریافت قیمت با ما تماس بگیرید
          </p>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.location.href = 'tel:02191005100'}
          >
            021-91005100
          </Button>
        </div>
      </div>
    </div>
  );
};