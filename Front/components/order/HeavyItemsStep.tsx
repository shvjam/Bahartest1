import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { HEAVY_ITEMS } from '../../constants';
import { OrderItem } from '../../types';
import { Plus, Minus, ArrowRight } from 'lucide-react';

interface HeavyItemsStepProps {
  heavyItems: OrderItem[];
  onUpdate: (items: OrderItem[]) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const HeavyItemsStep = ({ heavyItems, onUpdate, onBack, showBackButton = false }: HeavyItemsStepProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    const existingItem = heavyItems.find((item) => item.catalogItemId === itemId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + change;

      if (newQuantity <= 0) {
        // Remove item
        onUpdate(heavyItems.filter((item) => item.catalogItemId !== itemId));
      } else {
        // Update quantity
        onUpdate(
          heavyItems.map((item) =>
            item.catalogItemId === itemId
              ? {
                  ...item,
                  quantity: newQuantity,
                  totalPrice: newQuantity * item.unitPrice,
                }
              : item
          )
        );
      }
    } else {
      // Add new item
      const heavyItem = HEAVY_ITEMS.find((item) => item.id === itemId);
      if (heavyItem) {
        onUpdate([
          ...heavyItems,
          {
            id: Math.random().toString(),
            orderId: '',
            catalogItemId: itemId,
            catalogItem: {
              id: heavyItem.id,
              categoryId: 'cat-1', // Default category for heavy items
              name: heavyItem.name,
              description: heavyItem.category,
              basePrice: heavyItem.basePrice,
              unit: 'عدد',
              isActive: true,
              order: 0,
            },
            quantity: 1,
            unitPrice: heavyItem.basePrice,
            totalPrice: heavyItem.basePrice,
          },
        ]);
      }
    }
  };

  const getItemQuantity = (itemId: string) => {
    return heavyItems.find((item) => item.catalogItemId === itemId)?.quantity || 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="mb-2">آیا وسایل سنگین دارید؟</h2>
          <p className="text-muted-foreground">
            لطفاً وسایل سنگین و حجیم خود را مشخص کنید تا هزینه دقیق‌تری محاسبه شود
          </p>
        </div>
        {showBackButton && onBack && (
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowRight className="w-4 h-4 ml-2" />
            بازگشت
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {HEAVY_ITEMS.map((item) => {
          const quantity = getItemQuantity(item.id);
          const isSelected = quantity > 0;

          return (
            <Card
              key={item.id}
              className={`transition-all ${
                isSelected ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <Label className="text-base">{item.name}</Label>
                    <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
                    <p className="text-sm text-primary mt-1">
                      {formatPrice(item.basePrice)} تومان
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{quantity}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        افزودن
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="p-4 bg-accent rounded-lg">
        <p className="text-sm">
          💡 اگر وسایل سنگین دیگری دارید که در لیست نیست، در مرحله نهایی می‌توانید آن را
          در توضیحات اضافه کنید.
        </p>
      </div>
    </div>
  );
};