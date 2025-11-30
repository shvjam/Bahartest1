import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { OrderFormState, PriceBreakdown } from '../../types';
import { MapPin, Calendar, Truck, Users, Package, CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge';

interface SummaryStepProps {
  formState: OrderFormState;
  priceBreakdown: PriceBreakdown[];
  totalPrice: number;
  onSubmit: (customerNote: string, discountCode?: string) => void;
  isSubmitting?: boolean;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const SummaryStep = ({
  formState,
  priceBreakdown,
  totalPrice,
  onSubmit,
  isSubmitting = false,
  onBack,
  showBackButton = false,
}: SummaryStepProps) => {
  const [customerNote, setCustomerNote] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('fa-IR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleApplyDiscount = () => {
    // Mock discount application
    if (discountCode.trim()) {
      setDiscountApplied(true);
      // در production، این کد به API ارسال می‌شود
    }
  };

  const handleSubmit = () => {
    onSubmit(customerNote, discountCode);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="mb-2">خلاصه سفارش</h2>
          <p className="text-muted-foreground">
            لطفاً اطلاعات سفارش خود را بررسی کنید و در صورت نیاز، توضیحات اضافی وارد کنید
          </p>
        </div>
        {showBackButton && onBack && (
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowRight className="w-4 h-4 ml-2" />
            بازگشت
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Service Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                خدمت انتخاب شده
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{formState.serviceCategory?.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {formState.serviceCategory?.description}
              </p>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                آدرس‌ها
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    مبدا
                  </Badge>
                </div>
                <p className="text-sm">{formState.originAddress?.fullAddress}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  طبقه {formState.originFloor}
                  {formState.originHasElevator ? ' - آسانسور دارد' : ' - بدون آسانسور'}
                </p>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-destructive/10 text-destructive">
                    مقصد
                  </Badge>
                </div>
                <p className="text-sm">{formState.destinationAddress?.fullAddress}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  طبقه {formState.destinationFloor}
                  {formState.destinationHasElevator ? ' - آسانسور دارد' : ' - بدون آسانسور'}
                </p>
              </div>

              {formState.walkDistance !== undefined && formState.walkDistance > 0 && (
                <>
                  <Separator />
                  <p className="text-sm text-muted-foreground">
                    مسافت پیاده‌روی: {formState.walkDistance} متر
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Workers & Vehicle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                نیروی کار و خودرو
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">تعداد کارگر</span>
                <span>{formState.workerCount} نفر</span>
              </div>
              {formState.needsPacking && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">کارگر بسته‌بندی</span>
                    <span>
                      {formState.packingWorkerGender?.male || 0} مرد +{' '}
                      {formState.packingWorkerGender?.female || 0} زن
                    </span>
                  </div>
                  {formState.packingDuration && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">مدت بسته‌بندی</span>
                      <span>{formState.packingDuration} ساعت</span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Packing Info */}
          {formState.needsPacking && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  جزئیات بسته‌بندی
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">نوع بسته‌بندی</span>
                  <Badge>{formState.packingType}</Badge>
                </div>
                {formState.packingItems && formState.packingItems.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      آیتم‌های انتخاب شده:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formState.packingItems.map((item, idx) => (
                        <Badge key={idx} variant="secondary">
                          {item.itemName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {formState.needsPackingMaterials && (
                  <div>
                    <p className="text-sm text-primary mb-2">✓ نیاز به مواد بسته‌بندی</p>
                    {formState.selectedPackingProducts && formState.selectedPackingProducts.length > 0 && (
                      <div className="bg-accent/50 rounded-lg p-3 space-y-2">
                        <p className="text-sm font-medium text-right">محصولات بسته‌بندی:</p>
                        {formState.selectedPackingProducts.map((product, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              {product.totalPrice.toLocaleString('fa-IR')} تومان
                            </span>
                            <span>
                              {product.name} × {product.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Heavy Items */}
          {formState.heavyItems && formState.heavyItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>وسایل سنگین</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {formState.heavyItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span>{item.catalogItemId}</span>
                      <span>
                        {item.quantity} عدد × {formatPrice(item.unitPrice)} تومان
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Date Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                زمان
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{formatDate(formState.preferredDateTime)}</p>
            </CardContent>
          </Card>

          {/* Customer Note */}
          <Card>
            <CardHeader>
              <CardTitle>توضیحات و درخواست‌های خاص</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="اگر توضیحات یا درخواست خاصی دارید اینجا بنویسید..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Price Summary */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>جزئیات قیمت</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price Breakdown */}
              <div className="space-y-3">
                {priceBreakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-start text-sm">
                    <div className="flex-1">
                      <p>{item.label}</p>
                      {item.quantity && item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.unitPrice)} × {item.quantity}
                        </p>
                      )}
                    </div>
                    <p className="mr-4">{formatPrice(item.totalPrice)} تومان</p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Discount Code */}
              <div className="space-y-2">
                <Label htmlFor="discount-code">کد تخفیف</Label>
                <div className="flex gap-2">
                  <Input
                    id="discount-code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="کد تخفیف"
                    disabled={discountApplied}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleApplyDiscount}
                    disabled={discountApplied || !discountCode.trim()}
                  >
                    {discountApplied ? '✓' : 'اعمال'}
                  </Button>
                </div>
                {discountApplied && (
                  <p className="text-sm text-success">✓ کد تخفیف اعمال شد</p>
                )}
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center">
                <p className="font-medium">جمع کل (تخمینی)</p>
                <p className="font-medium text-primary">{formatPrice(totalPrice)} تومان</p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'در حال ثبت...' : 'تایید و ثبت سفارش'}
              </Button>

              <div className="p-3 bg-accent rounded-lg">
                <p className="text-xs text-muted-foreground">
                  💡 قیمت نهایی پس از بررسی کارشناس تعیین می‌شود
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
