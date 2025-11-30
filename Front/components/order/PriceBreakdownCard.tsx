import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PriceBreakdown, SelectedPackingProduct } from '../../types';
import { Separator } from '../ui/separator';
import { Package } from 'lucide-react';

interface PriceBreakdownCardProps {
  breakdown: PriceBreakdown[];
  total: number;
  packingProducts?: SelectedPackingProduct[];
}

export const PriceBreakdownCard = ({ breakdown, total, packingProducts = [] }: PriceBreakdownCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  // جدا کردن آیتم‌های مواد بسته‌بندی از breakdown
  const packingMaterialsFromBreakdown = breakdown.filter(item => 
    item.description === 'مواد بسته‌بندی' || item.label.includes('مواد بسته‌بندی')
  );
  
  // فیلتر کردن breakdown برای نمایش بقیه آیتم‌ها (بدون مواد بسته‌بندی)
  const filteredBreakdown = breakdown.filter(item => 
    item.description !== 'مواد بسته‌بندی' && !item.label.includes('مواد بسته‌بندی')
  );

  // اگر محصولات انتخابی (packingProducts) وجود داره، از اون‌ها استفاده کن
  // وگرنه از هزینه تخمینی که در breakdown هست استفاده کن
  const hasSelectedProducts = packingProducts.length > 0;
  const packingMaterialsItems = hasSelectedProducts ? packingProducts : packingMaterialsFromBreakdown;

  const packingProductsTotal = packingMaterialsItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const grandTotal = total;

  if (breakdown.length === 0 && packingProducts.length === 0) {
    return null;
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>جزئیات قیمت</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-right">
          {filteredBreakdown.map((item, index) => (
            <div key={index} className="flex justify-between items-start flex-row-reverse">
              <div className="flex-1">
                <p className="text-sm">{item.label}</p>
                {item.description && (
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                )}
                {item.quantity && item.quantity > 1 && (
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(item.unitPrice)} × {item.quantity}
                  </p>
                )}
              </div>
              <p className="text-sm ml-4">{formatPrice(item.totalPrice)} تومان</p>
            </div>
          ))}

          {/* Packing Products Section */}
          {packingMaterialsItems.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="space-y-3">
                <div className="flex items-center gap-2 justify-end">
                  <p className="font-medium text-sm">محصولات بسته‌بندی</p>
                  <Package className="w-4 h-4" />
                </div>
                {packingMaterialsItems.map((product, index) => (
                  <div key={index} className="flex justify-between items-start flex-row-reverse pr-6">
                    <div className="flex-1">
                      <p className="text-sm">{'name' in product ? product.name : product.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(product.unitPrice)} × {product.quantity}
                      </p>
                    </div>
                    <p className="text-sm ml-4">{formatPrice(product.totalPrice)} تومان</p>
                  </div>
                ))}
                <div className="flex justify-between items-center flex-row-reverse pr-6 pt-2 border-t">
                  <p className="text-sm">جمع محصولات</p>
                  <p className="text-sm text-primary">{formatPrice(packingProductsTotal)} تومان</p>
                </div>
              </div>
            </>
          )}

          <Separator className="my-4" />

          <div className="flex justify-between items-center flex-row-reverse">
            <p className="font-medium">جمع کل (تخمینی)</p>
            <p className="font-medium text-primary">{formatPrice(grandTotal)} تومان</p>
          </div>

          <div className="mt-4 p-3 bg-accent rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 قیمت نهایی ممکن است پس از بررسی دقیق کارشناس تغییر کند
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};