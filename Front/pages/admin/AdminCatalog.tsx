import { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Package,
  Boxes,
  ShoppingBag,
  GripVertical,
  Eye,
  EyeOff,
  Info,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { toast } from 'sonner';
import {
  CatalogCategory,
  CatalogItem,
  PackingProduct,
} from '../../types';
import {
  mockCatalogCategories,
  mockCatalogItems,
  mockPackingProducts,
} from '../../services/mockData';
import { ImageUpload } from '../../components/common/ImageUpload';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

type DialogMode = 'create' | 'edit' | null;

interface CategoryFormData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  order: number;
}

interface ItemFormData {
  id?: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  unit: string;
  isActive: boolean;
  order: number;
}

interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  image?: string;
  isActive: boolean;
}

export const AdminCatalog = () => {
  // State for data
  const [categories, setCategories] = useState<CatalogCategory[]>(mockCatalogCategories);
  const [items, setItems] = useState<CatalogItem[]>(mockCatalogItems);
  const [products, setProducts] = useState<PackingProduct[]>(mockPackingProducts);

  // State for search and filters
  const [categorySearch, setCategorySearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // State for dialogs
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);

  // State for forms
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    order: 0,
  });

  const [itemForm, setItemForm] = useState<ItemFormData>({
    categoryId: '',
    name: '',
    description: '',
    basePrice: 0,
    unit: 'عدد',
    isActive: true,
    order: 0,
  });

  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    unit: 'عدد',
    stock: 0,
    isActive: true,
  });

  // ============================================
  // CATEGORY FUNCTIONS
  // ============================================

  const openCategoryDialog = (mode: DialogMode, category?: CatalogCategory) => {
    setDialogMode(mode);
    if (mode === 'edit' && category) {
      setCategoryForm({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        order: category.order,
      });
    } else {
      setCategoryForm({
        name: '',
        slug: '',
        description: '',
        order: categories.length,
      });
    }
    setCategoryDialogOpen(true);
  };

  const handleCategorySubmit = () => {
    if (!categoryForm.name || !categoryForm.slug) {
      toast.error('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }

    if (dialogMode === 'create') {
      const newCategory: CatalogCategory = {
        id: `cat-${Date.now()}`,
        name: categoryForm.name,
        slug: categoryForm.slug,
        description: categoryForm.description,
        order: categoryForm.order,
        isActive: true,
      };
      setCategories([...categories, newCategory]);
      toast.success('دسته‌بندی با موفقیت ایجاد شد');
    } else if (dialogMode === 'edit' && categoryForm.id) {
      setCategories(
        categories.map((cat) =>
          cat.id === categoryForm.id
            ? { ...cat, ...categoryForm }
            : cat
        )
      );
      toast.success('دسته‌بندی با موفقیت ویرایش شد');
    }

    setCategoryDialogOpen(false);
  };

  const handleCategoryDelete = (id: string) => {
    // Check if category has items
    const hasItems = items.some((item) => item.categoryId === id);
    if (hasItems) {
      toast.error('این دسته‌بندی دارای آیتم است و قابل حذف نیست');
      return;
    }

    setCategories(categories.filter((cat) => cat.id !== id));
    toast.success('دسته‌بندی با موفقیت حذف شد');
  };

  // ============================================
  // ITEM FUNCTIONS
  // ============================================

  const openItemDialog = (mode: DialogMode, item?: CatalogItem) => {
    setDialogMode(mode);
    if (mode === 'edit' && item) {
      setItemForm({
        id: item.id,
        categoryId: item.categoryId,
        name: item.name,
        description: item.description || '',
        basePrice: item.basePrice,
        unit: item.unit,
        isActive: item.isActive,
        order: item.order,
      });
    } else {
      setItemForm({
        categoryId: categories[0]?.id || '',
        name: '',
        description: '',
        basePrice: 0,
        unit: 'عدد',
        isActive: true,
        order: items.length,
      });
    }
    setItemDialogOpen(true);
  };

  const handleItemSubmit = () => {
    if (!itemForm.name || !itemForm.categoryId || itemForm.basePrice <= 0) {
      toast.error('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }

    if (dialogMode === 'create') {
      const newItem: CatalogItem = {
        id: `item-${Date.now()}`,
        categoryId: itemForm.categoryId,
        name: itemForm.name,
        description: itemForm.description,
        basePrice: itemForm.basePrice,
        unit: itemForm.unit,
        isActive: itemForm.isActive,
        order: itemForm.order,
      };
      setItems([...items, newItem]);
      toast.success('آیتم با موفقیت ایجاد شد');
    } else if (dialogMode === 'edit' && itemForm.id) {
      setItems(
        items.map((item) =>
          item.id === itemForm.id ? { ...item, ...itemForm } : item
        )
      );
      toast.success('آیتم با موفقیت ویرایش شد');
    }

    setItemDialogOpen(false);
  };

  const handleItemDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast.success('آیتم با موفقیت حذف شد');
  };

  const handleItemToggleActive = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
    toast.success('وضعیت آیتم تغییر کرد');
  };

  // ============================================
  // PRODUCT FUNCTIONS
  // ============================================

  const openProductDialog = (mode: DialogMode, product?: PackingProduct) => {
    setDialogMode(mode);
    if (mode === 'edit' && product) {
      setProductForm({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        unit: product.unit,
        stock: product.stock,
        image: product.image,
        isActive: product.isActive,
      });
    } else {
      setProductForm({
        name: '',
        description: '',
        price: 0,
        unit: 'عدد',
        stock: 0,
        image: undefined,
        isActive: true,
      });
    }
    setProductDialogOpen(true);
  };

  const handleProductSubmit = () => {
    if (!productForm.name || productForm.price <= 0) {
      toast.error('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }

    if (dialogMode === 'create') {
      const newProduct: PackingProduct = {
        id: `pack-${Date.now()}`,
        name: productForm.name,
        description: productForm.description,
        price: productForm.price,
        unit: productForm.unit,
        stock: productForm.stock,
        isActive: productForm.isActive,
      };
      setProducts([...products, newProduct]);
      toast.success('محصول با موفقیت ایجاد شد');
    } else if (dialogMode === 'edit' && productForm.id) {
      setProducts(
        products.map((product) =>
          product.id === productForm.id ? { ...product, ...productForm } : product
        )
      );
      toast.success('محصول با موفقیت ویرایش شد');
    }

    setProductDialogOpen(false);
  };

  const handleProductDelete = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
    toast.success('محصول با موفقیت حذف شد');
  };

  const handleProductToggleActive = (id: string) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, isActive: !product.isActive } : product
      )
    );
    toast.success('وضعیت محصول تغییر کرد');
  };

  // ============================================
  // FILTERED DATA
  // ============================================

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(itemSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || 'نامشخص';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">مدیریت کاتالوگ</h1>
        <p className="text-muted-foreground">
          مدیریت دسته‌بندی‌ها، آیتم‌های کاتالوگ و محصولات بسته‌بندی
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">تعداد دسته‌بندی‌ها</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{categories.length}</div>
            <p className="text-xs text-muted-foreground">دسته‌بندی فعال</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">تعداد آیتم‌ها</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{items.filter((i) => i.isActive).length}</div>
            <p className="text-xs text-muted-foreground">
              از {items.length} آیتم کل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">محصولات بسته‌بندی</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{products.filter((p) => p.isActive).length}</div>
            <p className="text-xs text-muted-foreground">
              از {products.length} محصول کل
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">دسته‌بندی‌ها</TabsTrigger>
          <TabsTrigger value="items">آیتم‌های کاتالوگ</TabsTrigger>
          <TabsTrigger value="products">محصولات بسته‌بندی</TabsTrigger>
        </TabsList>

        {/* ============================================ */}
        {/* CATEGORIES TAB */}
        {/* ============================================ */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>دسته‌بندی‌های کاتالوگ</CardTitle>
                  <CardDescription>مدیریت دسته‌بندی‌های اصلی کاتالوگ</CardDescription>
                </div>
                <Button onClick={() => openCategoryDialog('create')}>
                  <Plus className="ml-2 h-4 w-4" />
                  دسته‌بندی جدید
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="جستجو در دسته‌بندی‌ها..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="pr-10"
                />
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>نام دسته‌بندی</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>توضیحات</TableHead>
                      <TableHead>ترتیب</TableHead>
                      <TableHead className="text-left">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          دسته‌بندی یافت نشد
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCategories.map((category, index) => (
                        <TableRow key={category.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              {category.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{category.slug}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {category.description}
                          </TableCell>
                          <TableCell>{category.order}</TableCell>
                          <TableCell className="text-left">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => openCategoryDialog('edit', category)}
                                >
                                  <Edit className="ml-2 h-4 w-4" />
                                  ویرایش
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleCategoryDelete(category.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="ml-2 h-4 w-4" />
                                  حذف
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* ITEMS TAB */}
        {/* ============================================ */}
        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>آیتم‌های کاتالوگ</CardTitle>
                  <CardDescription>
                    مدیریت آیتم‌های سنگین و محصولات قابل انتخاب در فرم سفارش
                  </CardDescription>
                </div>
                <Button onClick={() => openItemDialog('create')}>
                  <Plus className="ml-2 h-4 w-4" />
                  آیتم جدید
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="جستجو در آیتم‌ها..."
                    value={itemSearch}
                    onChange={(e) => setItemSearch(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="همه دسته‌بندی‌ها" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه دسته‌بندی‌ها</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>نام آیتم</TableHead>
                      <TableHead>دسته‌بندی</TableHead>
                      <TableHead>قیمت پایه</TableHead>
                      <TableHead>واحد</TableHead>
                      <TableHead>وضعیت</TableHead>
                      <TableHead className="text-left">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          آیتمی یافت نشد
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div>{item.name}</div>
                                {item.description && (
                                  <div className="text-xs text-muted-foreground">
                                    {item.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {getCategoryName(item.categoryId)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatPrice(item.basePrice)}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={item.isActive}
                                onCheckedChange={() => handleItemToggleActive(item.id)}
                              />
                              <Badge variant={item.isActive ? 'default' : 'secondary'}>
                                {item.isActive ? 'فعال' : 'غیرفعال'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-left">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => openItemDialog('edit', item)}
                                >
                                  <Edit className="ml-2 h-4 w-4" />
                                  ویرایش
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleItemToggleActive(item.id)}
                                >
                                  {item.isActive ? (
                                    <>
                                      <EyeOff className="ml-2 h-4 w-4" />
                                      غیرفعال کردن
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="ml-2 h-4 w-4" />
                                      فعال کردن
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleItemDelete(item.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="ml-2 h-4 w-4" />
                                  حذف
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* PRODUCTS TAB */}
        {/* ============================================ */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>محصولات بسته‌بندی</CardTitle>
                  <CardDescription>
                    مدیریت محصولات بسته‌بندی (کارتن، چسب، پلاستیک و ...)
                  </CardDescription>
                </div>
                <Button onClick={() => openProductDialog('create')}>
                  <Plus className="ml-2 h-4 w-4" />
                  محصول جدید
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="جستجو در محصولات..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pr-10"
                />
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead className="w-[80px]">تصویر</TableHead>
                      <TableHead>نام محصول</TableHead>
                      <TableHead>قیمت</TableHead>
                      <TableHead>واحد</TableHead>
                      <TableHead>موجودی</TableHead>
                      <TableHead>وضعیت</TableHead>
                      <TableHead className="text-left">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          محصولی یافت نشد
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product, index) => (
                        <TableRow key={product.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex items-center justify-center border">
                              {product.image ? (
                                <ImageWithFallback
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Package className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{product.name}</div>
                              {product.description && (
                                <div className="text-xs text-muted-foreground">
                                  {product.description}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{formatPrice(product.price)}</TableCell>
                          <TableCell>{product.unit}</TableCell>
                          <TableCell>
                            <Badge
                              variant={product.stock > 10 ? 'default' : 'destructive'}
                            >
                              {product.stock} {product.unit}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={product.isActive}
                                onCheckedChange={() => handleProductToggleActive(product.id)}
                              />
                              <Badge variant={product.isActive ? 'default' : 'secondary'}>
                                {product.isActive ? 'فعال' : 'غیرفعال'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-left">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => openProductDialog('edit', product)}
                                >
                                  <Edit className="ml-2 h-4 w-4" />
                                  ویرایش
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleProductToggleActive(product.id)}
                                >
                                  {product.isActive ? (
                                    <>
                                      <EyeOff className="ml-2 h-4 w-4" />
                                      غیرفعال کردن
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="ml-2 h-4 w-4" />
                                      فعال کردن
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleProductDelete(product.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="ml-2 h-4 w-4" />
                                  حذف
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ============================================ */}
      {/* CATEGORY DIALOG */}
      {/* ============================================ */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'دسته‌بندی جدید' : 'ویرایش دسته‌بندی'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' 
                ? 'یک دسته‌بندی جدید برای سازماندهی آیتم‌ها ایجاد کنید'
                : 'اطلاعات دسته‌بندی را ویرایش کنید'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">
                نام دسته‌بندی <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cat-name"
                placeholder="مثال: اقلام سنگین و حجیم"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat-slug">
                Slug <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cat-slug"
                placeholder="مثال: heavy-items"
                value={categoryForm.slug}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, slug: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                فقط از حروف انگلیسی، اعداد و خط تیره استفاده کنید
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat-description">توضیحات</Label>
              <Textarea
                id="cat-description"
                placeholder="توضیحات کوتاه در مورد دسته‌بندی"
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat-order">ترتیب نمایش</Label>
              <Input
                id="cat-order"
                type="number"
                value={categoryForm.order}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
              انصراف
            </Button>
            <Button onClick={handleCategorySubmit}>
              {dialogMode === 'create' ? 'ایجاد دسته‌بندی' : 'ذخیره تغییرات'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* ITEM DIALOG */}
      {/* ============================================ */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'آیتم جدید' : 'ویرایش آیتم'}
            </DialogTitle>
            <DialogDescription>
              اطلاعات آیتم کاتالوگ را وارد کنید
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="item-name">
                نام آیتم <span className="text-destructive">*</span>
              </Label>
              <Input
                id="item-name"
                placeholder="مثال: پیانو"
                value={itemForm.name}
                onChange={(e) =>
                  setItemForm({ ...itemForm, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-category">
                دسته‌بندی <span className="text-destructive">*</span>
              </Label>
              <Select
                value={itemForm.categoryId}
                onValueChange={(value) =>
                  setItemForm({ ...itemForm, categoryId: value })
                }
              >
                <SelectTrigger id="item-category">
                  <SelectValue placeholder="انتخاب دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="item-description">توضیحات</Label>
              <Textarea
                id="item-description"
                placeholder="توضیحات تکمیلی در مورد آیتم"
                value={itemForm.description}
                onChange={(e) =>
                  setItemForm({ ...itemForm, description: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-price">
                قیمت پایه (تومان) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="item-price"
                type="number"
                placeholder="0"
                value={itemForm.basePrice || ''}
                onChange={(e) =>
                  setItemForm({
                    ...itemForm,
                    basePrice: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-unit">واحد</Label>
              <Select
                value={itemForm.unit}
                onValueChange={(value) => setItemForm({ ...itemForm, unit: value })}
              >
                <SelectTrigger id="item-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="عدد">عدد</SelectItem>
                  <SelectItem value="کیلوگرم">کیلوگرم</SelectItem>
                  <SelectItem value="متر">متر</SelectItem>
                  <SelectItem value="متر مربع">متر مربع</SelectItem>
                  <SelectItem value="ساعت">ساعت</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-order">ترتیب نمایش</Label>
              <Input
                id="item-order"
                type="number"
                value={itemForm.order}
                onChange={(e) =>
                  setItemForm({ ...itemForm, order: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="item-active"
                checked={itemForm.isActive}
                onCheckedChange={(checked) =>
                  setItemForm({ ...itemForm, isActive: checked })
                }
              />
              <Label htmlFor="item-active">فعال</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDialogOpen(false)}>
              انصراف
            </Button>
            <Button onClick={handleItemSubmit}>
              {dialogMode === 'create' ? 'ایجاد آیتم' : 'ذخیره تغییرات'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* PRODUCT DIALOG */}
      {/* ============================================ */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'محصول جدید' : 'ویرایش محصول'}
            </DialogTitle>
            <DialogDescription>
              اطلاعات محصول بسته‌بندی را وارد کنید
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="product-name">
                نام محصول <span className="text-destructive">*</span>
              </Label>
              <Input
                id="product-name"
                placeholder="مثال: کارتن بزرگ (۵۰×۵۰×۶۰)"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="product-description">توضیحات</Label>
              <Textarea
                id="product-description"
                placeholder="مثال: مناسب برای ملحفه و پتو"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({ ...productForm, description: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <ImageUpload
                value={productForm.image}
                onChange={(value) =>
                  setProductForm({ ...productForm, image: value })
                }
                label="تصویر محصول"
                description="فایل JPG، PNG یا WEBP با حداکثر حجم 2 مگابایت"
                maxSizeMB={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-price">
                قیمت (تومان) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="product-price"
                type="number"
                placeholder="0"
                value={productForm.price || ''}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    price: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-unit">واحد</Label>
              <Select
                value={productForm.unit}
                onValueChange={(value) =>
                  setProductForm({ ...productForm, unit: value })
                }
              >
                <SelectTrigger id="product-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="عدد">عدد</SelectItem>
                  <SelectItem value="رول">رول</SelectItem>
                  <SelectItem value="بسته">بسته</SelectItem>
                  <SelectItem value="کیلوگرم">کیلوگرم</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-stock">موجودی</Label>
              <Input
                id="product-stock"
                type="number"
                placeholder="0"
                value={productForm.stock || ''}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    stock: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="product-active"
                checked={productForm.isActive}
                onCheckedChange={(checked) =>
                  setProductForm({ ...productForm, isActive: checked })
                }
              />
              <Label htmlFor="product-active">فعال</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDialogOpen(false)}>
              انصراف
            </Button>
            <Button onClick={handleProductSubmit}>
              {dialogMode === 'create' ? 'ایجاد محصول' : 'ذخیره تغییرات'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};