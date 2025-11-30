import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Truck, Shield, Clock, Award, ArrowLeft } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../constants';

export const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: 'خدمات مطمئن',
      description: 'بیمه کامل و ضمانت تحویل سالم اثاثیه',
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: 'سرویس سریع',
      description: 'آماده ارائه خدمات در کمترین زمان ممکن',
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: 'تیم حرفه‌ای',
      description: 'کارگران ماهر و راننده‌های با تجربه',
    },
    {
      icon: <Truck className="w-8 h-8 text-primary" />,
      title: 'ناوگان متنوع',
      description: 'انواع خودرو از وانت تا کامیون و خاور',
    },
  ];

  const steps = [
    {
      number: '۱',
      title: 'انتخاب خدمت',
      description: 'نوع خدمت مورد نظر خود را انتخاب کنید',
    },
    {
      number: '۲',
      title: 'ثبت مشخصات',
      description: 'جزئیات بار و آدرس‌ها را وارد کنید',
    },
    {
      number: '۳',
      title: 'تایید و پرداخت',
      description: 'قیمت را مشاهده و پرداخت انجام دهید',
    },
    {
      number: '۴',
      title: 'تحویل بار',
      description: 'راننده بار شما را به مقصد می‌رساند',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-accent/20 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl mb-6">
              اسباب‌کشی و باربری با
              <span className="text-primary"> باربری بهار</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              سریع، مطمئن و آسان - خدمات اسباب‌کشی حرفه‌ای در سراسر کشور
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/services')} className="gap-2">
                ثبت سفارش
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/services')}>
                مشاهده خدمات
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">چرا باربری بهار؟</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ما با ارائه بهترین خدمات، رضایت شما را تضمین می‌کنیم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">خدمات ما</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              انواع خدمات باربری و اسباب‌کشی متناسب با نیاز شما
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_CATEGORIES.map((service) => (
              <Card
                key={service.id}
                className="p-6 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
                onClick={() => navigate(`/order/${service.slug}`)}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="mb-2">{service.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                <Button variant="ghost" className="gap-2 p-0 h-auto">
                  ثبت سفارش
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">نحوه کار</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              با چند مرحله ساده سفارش خود را ثبت کنید
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl">
                  {step.number}
                </div>
                <h3 className="mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                
                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 transform translate-x-1/2 text-primary">
                    <ArrowLeft className="w-6 h-6 rotate-180" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={() => navigate('/services')} className="gap-2">
              شروع کنید
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">آماده اسباب‌کشی هستید؟</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            با باربری بهار، اسباب‌کشی راحت‌تر از همیشه!
            همین حالا سفارش خود را ثبت کنید
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/services')}
              className="gap-2"
            >
              ثبت سفارش
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10"
              onClick={() => window.location.href = 'tel:02191005100'}
            >
              تماس با ما
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
