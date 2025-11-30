import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { PACKING_TYPES, PACKING_ITEMS, PACKING_DURATION_OPTIONS } from '../../constants';
import { PackingType, PackingItem, SelectedPackingProduct, PackingProduct } from '../../types';
import { useState, useEffect } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Plus, Minus, ShoppingCart, UserRound, ArrowRight } from 'lucide-react';
import { packingService } from '../../services/api';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner';

interface PackingStepProps {
  needsPacking?: boolean;
  packingType?: PackingType;
  packingItems?: PackingItem[];
  packingWorkerGender?: { male: number; female: number };
  packingDuration?: number;
  needsPackingMaterials?: boolean;
  packingMaterialsMode?: 'auto' | 'manual';
  selectedPackingProducts?: SelectedPackingProduct[];
  onUpdate: (data: {
    needsPacking: boolean;
    packingType?: PackingType;
    packingItems?: PackingItem[];
    packingWorkerGender?: { male: number; female: number };
    packingDuration?: number;
    needsPackingMaterials?: boolean;
    packingMaterialsMode?: 'auto' | 'manual';
    selectedPackingProducts?: SelectedPackingProduct[];
  }) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const PackingStep = ({
  needsPacking,
  packingType,
  packingItems = [],
  packingWorkerGender = { male: 0, female: 0 },
  packingDuration,
  needsPackingMaterials,
  packingMaterialsMode,
  selectedPackingProducts = [],
  onUpdate,
  onBack,
  showBackButton = false,
}: PackingStepProps) => {
  const [selectedItems, setSelectedItems] = useState<PackingItem[]>(packingItems);
  const [packingProducts, setPackingProducts] = useState<PackingProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Load packing products from API
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const products = await packingService.getPackingProducts();
        setPackingProducts(products);
      } catch (error: unknown) {
        toast.error('خطا در دریافت محصولات بسته‌بندی');
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const handleNeedsPackingChange = (needs: boolean) => {
    onUpdate({
      needsPacking: needs,
      packingType: needs ? packingType : undefined,
      packingItems: needs ? selectedItems : undefined,
      packingWorkerGender: needs ? packingWorkerGender : { male: 0, female: 0 },
      packingDuration: needs ? packingDuration : undefined,
      needsPackingMaterials: needs ? needsPackingMaterials : undefined,
      packingMaterialsMode: needs ? packingMaterialsMode : undefined,
      selectedPackingProducts: needs ? selectedPackingProducts : undefined,
    });
  };

  const handlePackingTypeChange = (type: PackingType) => {
    onUpdate({
      needsPacking: true,
      packingType: type,
      packingItems: [],
      packingWorkerGender,
      packingDuration,
      needsPackingMaterials,
      packingMaterialsMode,
      selectedPackingProducts,
    });
    setSelectedItems([]);
  };

  const handleItemToggle = (itemId: string, itemName: string) => {
    const existingItem = selectedItems.find((i) => i.itemName === itemName);
    let newItems: PackingItem[];

    if (existingItem) {
      newItems = selectedItems.filter((i) => i.itemName !== itemName);
    } else {
      newItems = [...selectedItems, { itemName, quantity: 1 }];
    }

    setSelectedItems(newItems);
    onUpdate({
      needsPacking: true,
      packingType,
      packingItems: newItems,
      packingWorkerGender,
      packingDuration,
      needsPackingMaterials,
      packingMaterialsMode,
      selectedPackingProducts,
    });
  };

  const handleWorkerGenderChange = (gender: 'male' | 'female', change: number) => {
    const newGender = {
      ...packingWorkerGender,
      [gender]: Math.max(0, packingWorkerGender[gender] + change),
    };

    onUpdate({
      needsPacking: true,
      packingType,
      packingItems: selectedItems,
      packingWorkerGender: newGender,
      packingDuration,
      needsPackingMaterials,
      packingMaterialsMode,
      selectedPackingProducts,
    });
  };

  const handleMaterialsModeChange = (mode: 'auto' | 'manual') => {
    onUpdate({
      needsPacking: true,
      packingType,
      packingItems: selectedItems,
      packingWorkerGender,
      packingDuration,
      needsPackingMaterials: true,
      packingMaterialsMode: mode,
      selectedPackingProducts: mode === 'auto' ? [] : selectedPackingProducts,
    });
  };

  const handleProductQuantityChange = (productId: string, change: number) => {
    const product = packingProducts.find((p) => p.id === productId);
    if (!product) return;

    const existingProduct = selectedPackingProducts.find((p) => p.productId === productId);
    let newProducts: SelectedPackingProduct[];

    if (existingProduct) {
      const newQuantity = Math.max(0, existingProduct.quantity + change);
      if (newQuantity === 0) {
        newProducts = selectedPackingProducts.filter((p) => p.productId !== productId);
      } else {
        newProducts = selectedPackingProducts.map((p) =>
          p.productId === productId
            ? {
                ...p,
                quantity: newQuantity,
                totalPrice: newQuantity * product.price,
              }
            : p
        );
      }
    } else {
      if (change > 0) {
        newProducts = [
          ...selectedPackingProducts,
          {
            productId: product.id,
            name: product.name,
            quantity: 1,
            unitPrice: product.price,
            totalPrice: product.price,
          },
        ];
      } else {
        newProducts = selectedPackingProducts;
      }
    }

    onUpdate({
      needsPacking: true,
      packingType,
      packingItems: selectedItems,
      packingWorkerGender,
      packingDuration,
      needsPackingMaterials: true,
      packingMaterialsMode: 'manual',
      selectedPackingProducts: newProducts,
    });
  };

  const getProductQuantity = (productId: string): number => {
    return selectedPackingProducts.find((p) => p.productId === productId)?.quantity || 0;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 text-right">
          <h2 className="mb-2">آیا نیاز به بسته‌بندی دارید؟</h2>
          <p className="text-muted-foreground">
            اگر می‌خواهید کارشناسان ما وسایل شما را بسته‌بندی کنند، گزینه بله را انتخاب کنید
          </p>
        </div>
        {showBackButton && onBack && (
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowRight className="w-4 h-4 ml-2" />
            بازگشت
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            needsPacking === true ? 'border-primary ring-2 ring-primary/20' : ''
          }`}
          onClick={() => handleNeedsPackingChange(true)}
        >
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3">📦</div>
            <h3>بله، نیاز دارم</h3>
            <p className="text-sm text-muted-foreground mt-2">
              کارشناسان ما وسایل را بسته‌بندی می‌کنند
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            needsPacking === false ? 'border-primary ring-2 ring-primary/20' : ''
          }`}
          onClick={() => handleNeedsPackingChange(false)}
        >
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3">✋</div>
            <h3>خیر، خودم بسته‌بندی می‌کنم</h3>
            <p className="text-sm text-muted-foreground mt-2">
              وسایل من آماده حمل است
            </p>
          </CardContent>
        </Card>
      </div>

      {needsPacking && (
        <>
          {/* Packing Type */}
          <div className="space-y-4">
            <h3 className="text-right">نوع بسته‌بندی را انتخاب کنید:</h3>
            <div className="grid grid-cols-1 gap-3">
              {PACKING_TYPES.map((type) => (
                <Card
                  key={type.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    packingType === type.value
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handlePackingTypeChange(type.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 flex-row-reverse">
                      <div className="flex items-center justify-center mt-0.5">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            packingType === type.value
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground/30'
                          }`}
                        >
                          {packingType === type.value && (
                            <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 text-right">
                        <p className="font-medium mb-1">{type.label}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Packing Items Selection */}
          {packingType && PACKING_ITEMS[packingType] && (
            <div className="space-y-4">
              <h3 className="text-right">لطفاً وسایلی که نیاز به بسته‌بندی دارند را انتخاب کنید:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PACKING_ITEMS[packingType].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 flex-row-reverse p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => handleItemToggle(item.id, item.name)}
                  >
                    <Checkbox
                      id={item.id}
                      checked={selectedItems.some((i) => i.itemName === item.name)}
                      onCheckedChange={(checked) => {
                        // Checkbox is controlled by parent onClick
                      }}
                    />
                    <div className="flex-1 text-right">
                      <p className="text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Worker Gender */}
          <div className="space-y-4">
            <h3 className="text-right">تعداد کارگران بسته‌بندی:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <Label className="mb-3 flex items-center justify-end gap-2">
                    <span>کارگر مرد</span>
                    <span className="text-2xl">👨</span>
                  </Label>
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleWorkerGenderChange('male', -1)}
                      disabled={packingWorkerGender.male === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-xl">{packingWorkerGender.male}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleWorkerGenderChange('male', 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <Label className="mb-3 flex items-center justify-end gap-2">
                    <span>کارگر زن</span>
                    <span className="text-2xl">👩</span>
                  </Label>
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleWorkerGenderChange('female', -1)}
                      disabled={packingWorkerGender.female === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-xl">{packingWorkerGender.female}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleWorkerGenderChange('female', 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-4">
            <h3 className="text-right">چند ساعت زمان نیاز است؟</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PACKING_DURATION_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={packingDuration === option.value ? 'default' : 'outline'}
                  onClick={() =>
                    onUpdate({
                      needsPacking: true,
                      packingType,
                      packingItems: selectedItems,
                      packingWorkerGender,
                      packingDuration: option.value,
                      needsPackingMaterials,
                      packingMaterialsMode,
                      selectedPackingProducts,
                    })
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Packing Materials Mode Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-row-reverse p-4 rounded-lg border">
              <Checkbox
                id="packing-materials"
                checked={needsPackingMaterials}
                onCheckedChange={(checked) =>
                  onUpdate({
                    needsPacking: true,
                    packingType,
                    packingItems: selectedItems,
                    packingWorkerGender,
                    packingDuration,
                    needsPackingMaterials: checked as boolean,
                    packingMaterialsMode: checked ? packingMaterialsMode : undefined,
                    selectedPackingProducts: checked ? selectedPackingProducts : [],
                  })
                }
              />
              <div className="flex-1 text-right cursor-pointer" onClick={() => {
                onUpdate({
                  needsPacking: true,
                  packingType,
                  packingItems: selectedItems,
                  packingWorkerGender,
                  packingDuration,
                  needsPackingMaterials: !needsPackingMaterials,
                  packingMaterialsMode: !needsPackingMaterials ? packingMaterialsMode : undefined,
                  selectedPackingProducts: !needsPackingMaterials ? selectedPackingProducts : [],
                });
              }}>
                <p>نیاز ه خرید مواد بسته‌بندی دارم (کارتن، چسب، پلاستیک و ...)</p>
                <p className="text-sm text-muted-foreground">
                  انتخاب کنید چگونه مواد بسته‌بندی تهیه شوند
                </p>
              </div>
            </div>

            {/* Materials Mode Options */}
            {needsPackingMaterials && (
              <div className="space-y-4 pr-8">
                <RadioGroup
                  value={packingMaterialsMode || 'auto'}
                  onValueChange={(value) => handleMaterialsModeChange(value as 'auto' | 'manual')}
                  className="space-y-3"
                >
                  <div
                    className={`flex items-center gap-3 flex-row-reverse p-4 rounded-lg border cursor-pointer transition-all ${
                      packingMaterialsMode === 'auto' || !packingMaterialsMode
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => handleMaterialsModeChange('auto')}
                  >
                    <RadioGroupItem value="auto" id="materials-auto" />
                    <Label htmlFor="materials-auto" className="flex-1 cursor-pointer text-right">
                      <p className="text-right">ما موارد مورد نیاز را برای شما تهیه کنیم</p>
                      <p className="text-sm text-muted-foreground text-right">
                        کارشناسان ما مواد مورد نیاز را تخمین زده و تهیه می‌کنند
                      </p>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center gap-3 flex-row-reverse p-4 rounded-lg border cursor-pointer transition-all ${
                      packingMaterialsMode === 'manual'
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => handleMaterialsModeChange('manual')}
                  >
                    <RadioGroupItem value="manual" id="materials-manual" />
                    <Label htmlFor="materials-manual" className="flex-1 cursor-pointer text-right">
                      <p className="flex items-center justify-end gap-2">
                        <span>انتخاب مواد بسته‌بندی</span>
                        <ShoppingCart className="w-4 h-4" />
                      </p>
                      <p className="text-sm text-muted-foreground">
                        خودتان محصولات مورد نیاز را انتخاب و خریداری کنید
                      </p>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Products List */}
                {packingMaterialsMode === 'manual' && (
                  <div className="space-y-4 mt-6">
                    <h4 className="text-right">انتخاب محصولات بسته‌بندی:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {packingProducts.map((product) => {
                        const quantity = getProductQuantity(product.id);
                        return (
                          <Card
                            key={product.id}
                            className={`transition-all ${
                              quantity > 0 ? 'border-primary ring-2 ring-primary/20' : ''
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex gap-4 flex-row-reverse">
                                {/* Product Image */}
                                {product.image && (
                                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-accent flex-shrink-0">
                                    <ImageWithFallback
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}

                                {/* Product Info */}
                                <div className="flex-1 text-right">
                                  <p className="font-medium mb-1">{product.name}</p>
                                  {product.description && (
                                    <p className="text-xs text-muted-foreground mb-2">
                                      {product.description}
                                    </p>
                                  )}
                                  <p className="text-sm text-primary">
                                    {formatPrice(product.price)} تومان / {product.unit}
                                  </p>

                                  {/* Quantity Controls */}
                                  <div className="flex items-center gap-3 mt-3 flex-row-reverse justify-end">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleProductQuantityChange(product.id, 1)}
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                    <span className="min-w-[2rem] text-center">{quantity}</span>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleProductQuantityChange(product.id, -1)}
                                      disabled={quantity === 0}
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {/* Summary */}
                    {selectedPackingProducts.length > 0 && (
                      <Card className="bg-primary/5">
                        <CardContent className="p-4">
                          <div className="space-y-2 text-right">
                            <p className="font-medium">محصولات انتخاب شده:</p>
                            {selectedPackingProducts.map((item) => (
                              <div
                                key={item.productId}
                                className="flex justify-between items-center text-sm flex-row-reverse"
                              >
                                <span>
                                  {item.name} × {item.quantity}
                                </span>
                                <span>
                                  {formatPrice(item.totalPrice)} تومان
                                </span>
                              </div>
                            ))}
                            <div className="pt-2 border-t flex justify-between items-center flex-row-reverse">
                              <span className="font-medium">جمع کل:</span>
                              <span className="font-medium text-primary">
                                {formatPrice(
                                  selectedPackingProducts.reduce((sum, item) => sum + item.totalPrice, 0)
                                )}{' '}
                                تومان
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};