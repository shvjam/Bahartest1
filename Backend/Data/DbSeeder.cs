using Microsoft.EntityFrameworkCore;
using BarbariBahar.API.Models;
using BarbariBahar.API.Enums;
using System.Text.Json;

namespace BarbariBahar.API.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // اگر داده وجود داره، seed نکن
            if (await context.Users.AnyAsync())
            {
                return;
            }

            await SeedUsersAsync(context);
            await SeedPricingConfigAsync(context);
            await SeedServiceCategoriesAsync(context);
            await SeedCatalogDataAsync(context);
            await SeedPackingProductsAsync(context);

            await context.SaveChangesAsync();
        }

        private static async Task SeedUsersAsync(AppDbContext context)
        {
            var users = new List<User>
            {
                // Admin User
                new User
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    PhoneNumber = "09123456789",
                    FullName = "مدیر سیستم",
                    Email = "admin@barbaribahar.com",
                    Role = UserRole.ADMIN,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                // Demo Customer
                new User
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    PhoneNumber = "09121234567",
                    FullName = "مشتری نمونه",
                    Email = "customer@example.com",
                    Role = UserRole.CUSTOMER,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                // Demo Driver
                new User
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    PhoneNumber = "09129876543",
                    FullName = "راننده نمونه",
                    Email = "driver@example.com",
                    Role = UserRole.DRIVER,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Users.AddRangeAsync(users);

            // Driver Profile برای راننده نمونه
            var driver = new Driver
            {
                Id = Guid.NewGuid(),
                UserId = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                LicensePlate = "12ب345-67",
                VehicleType = VehicleType.PICKUP,
                VehicleModel = "زامیاد",
                VehicleColor = "سفید",
                VehicleYear = 1402,
                AvailableWorkers = 2,
                DocumentsVerified = true,
                VerifiedAt = DateTime.UtcNow,
                Rating = 4.8m,
                TotalRides = 150,
                CompletedRides = 145,
                CancelledRides = 5,
                TotalEarnings = 45000000m,
                IsActive = true,
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow
            };

            await context.Drivers.AddAsync(driver);
        }

        private static async Task SeedPricingConfigAsync(AppDbContext context)
        {
            // نرخ‌های پایه خودرو
            var baseVehicleRates = new Dictionary<string, decimal>
            {
                { "PICKUP", 1500000m },
                { "NISSAN", 2000000m },
                { "TRUCK", 2500000m },
                { "HEAVY_TRUCK", 2660300m }
            };

            // نرخ کارگر بر اساس خودرو
            var workerRates = new Dictionary<string, decimal>
            {
                { "PICKUP", 900000m },
                { "NISSAN", 900000m },
                { "TRUCK", 900000m },
                { "HEAVY_TRUCK", 900000m }
            };

            // نرخ مسافت پیاده‌روی
            var walkingDistanceRates = new Dictionary<string, decimal>
            {
                { "0", 0m },
                { "10", 100000m },
                { "20", 150000m },
                { "30", 200000m },
                { "50", 250000m },
                { "100", 300000m }
            };

            var pricingConfig = new PricingConfig
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Name = "تنظیمات قیمت‌گذاری پیش‌فرض",
                BaseWorkerRate = 900000m,
                BaseVehicleRatesJson = JsonSerializer.Serialize(baseVehicleRates),
                WorkerRatesByVehicleJson = JsonSerializer.Serialize(workerRates),
                PerKmRate = 15000m,
                PerFloorRate = 75000m,
                WalkingDistanceRatesJson = JsonSerializer.Serialize(walkingDistanceRates),
                StopRate = 250000m,
                PackingHourlyRate = 200000m,
                PackingMaterialsEstimatedCost = 500000m,
                IncludePackingMaterialsInInvoice = true,
                CancellationFee = 250000m,
                ExpertVisitFee = 250000m,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await context.PricingConfigs.AddAsync(pricingConfig);

            // Discount Codes نمونه
            var discountCodes = new List<DiscountCode>
            {
                new DiscountCode
                {
                    Id = Guid.NewGuid(),
                    Code = "WELCOME10",
                    Type = "PERCENTAGE",
                    Value = 10m,
                    MaxDiscount = 500000m,
                    MinOrderAmount = 1000000m,
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddMonths(6),
                    UsageLimit = 1000,
                    UsageCount = 0,
                    PerUserLimit = 1,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new DiscountCode
                {
                    Id = Guid.NewGuid(),
                    Code = "SUMMER2024",
                    Type = "FIXED",
                    Value = 200000m,
                    MinOrderAmount = 2000000m,
                    StartDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddMonths(3),
                    UsageLimit = 500,
                    UsageCount = 0,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.DiscountCodes.AddRangeAsync(discountCodes);
        }

        private static async Task SeedServiceCategoriesAsync(AppDbContext context)
        {
            var services = new List<ServiceCategory>
            {
                new ServiceCategory
                {
                    Id = Guid.Parse("55555555-5555-5555-5555-555555555551"),
                    Name = "اسباب‌کشی سریع، مطمئن و آسان",
                    Slug = "moving-service",
                    Description = "خدمات اسباب‌کشی حرفه‌ای با بهترین کیفیت و قیمت مناسب",
                    ShortDescription = "اسباب‌کشی سریع و مطمئن",
                    Icon = "🚚",
                    BasePrice = 1500000m,
                    PricePerKm = 15000m,
                    IsActive = true,
                    IsFeatured = true,
                    Order = 1,
                    MinPrice = 1000000m,
                    MaxPrice = 10000000m,
                    FeaturesJson = JsonSerializer.Serialize(new[] { "باربری حرفه‌ای", "کارگر ماهر", "بیمه کامل" }),
                    CreatedAt = DateTime.UtcNow
                },
                new ServiceCategory
                {
                    Id = Guid.Parse("55555555-5555-5555-5555-555555555552"),
                    Name = "بسته‌بندی اثاثیه منزل و ادارات",
                    Slug = "packing-service",
                    Description = "بسته‌بندی حرفه‌ای اثاثیه با مواد استاندارد",
                    ShortDescription = "بسته‌بندی حرفه‌ای",
                    Icon = "📦",
                    BasePrice = 500000m,
                    IsActive = true,
                    IsFeatured = true,
                    Order = 2,
                    MinPrice = 500000m,
                    MaxPrice = 5000000m,
                    FeaturesJson = JsonSerializer.Serialize(new[] { "مواد با کیفیت", "کارگر متخصص", "سرعت بالا" }),
                    CreatedAt = DateTime.UtcNow
                },
                new ServiceCategory
                {
                    Id = Guid.Parse("55555555-5555-5555-5555-555555555553"),
                    Name = "اسباب‌کشی یخچال و لوازم سنگین",
                    Slug = "heavy-items-moving",
                    Description = "جابجایی یخچال، فریزر، گاوصندوق و لوازم سنگین",
                    ShortDescription = "جابجایی اقلام سنگین",
                    Icon = "🏋️",
                    BasePrice = 800000m,
                    PricePerKm = 10000m,
                    IsActive = true,
                    IsFeatured = false,
                    Order = 3,
                    MinPrice = 800000m,
                    MaxPrice = 3000000m,
                    FeaturesJson = JsonSerializer.Serialize(new[] { "تجهیزات ویژه", "کارگر قوی", "ایمنی بالا" }),
                    CreatedAt = DateTime.UtcNow
                },
                new ServiceCategory
                {
                    Id = Guid.Parse("55555555-5555-5555-5555-555555555554"),
                    Name = "حمل بار و مواد ساختمانی",
                    Slug = "construction-materials",
                    Description = "حمل مصالح ساختمانی، آجر، سیمان و سایر مواد",
                    ShortDescription = "حمل مواد ساختمانی",
                    Icon = "🧱",
                    BasePrice = 1000000m,
                    PricePerKm = 20000m,
                    IsActive = true,
                    IsFeatured = false,
                    Order = 4,
                    MinPrice = 1000000m,
                    MaxPrice = 8000000m,
                    FeaturesJson = JsonSerializer.Serialize(new[] { "خودرو مناسب", "بارگیری سریع", "قیمت مناسب" }),
                    CreatedAt = DateTime.UtcNow
                },
                new ServiceCategory
                {
                    Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                    Name = "باربری‌های درون و برون شهری",
                    Slug = "intercity-moving",
                    Description = "خدمات باربری در سطح شهر و بین شهری",
                    ShortDescription = "باربری شهری و بین‌شهری",
                    Icon = "🛣️",
                    BasePrice = 2000000m,
                    PricePerKm = 25000m,
                    IsActive = true,
                    IsFeatured = true,
                    Order = 5,
                    MinPrice = 2000000m,
                    MaxPrice = 20000000m,
                    FeaturesJson = JsonSerializer.Serialize(new[] { "مسیرهای دور", "بیمه کامل", "پیگیری آنلاین" }),
                    CreatedAt = DateTime.UtcNow
                },
                new ServiceCategory
                {
                    Id = Guid.Parse("55555555-5555-5555-5555-555555555556"),
                    Name = "کارشناسی و تخمین هزینه",
                    Slug = "expert-consultation",
                    Description = "بازدید کارشناس و برآورد دقیق هزینه",
                    ShortDescription = "کارشناسی و برآورد",
                    Icon = "👨‍💼",
                    BasePrice = 250000m,
                    IsActive = true,
                    IsFeatured = false,
                    Order = 6,
                    MinPrice = 250000m,
                    MaxPrice = 250000m,
                    FeaturesJson = JsonSerializer.Serialize(new[] { "بازدید رایگان", "برآورد دقیق", "مشاوره تخصصی" }),
                    CreatedAt = DateTime.UtcNow
                },
                new ServiceCategory
                {
                    Id = Guid.Parse("55555555-5555-5555-5555-555555555557"),
                    Name = "انبارداری و نگهداری اثاثیه",
                    Slug = "storage-service",
                    Description = "نگهداری اثاثیه در انبار استاندارد",
                    ShortDescription = "انبارداری اثاثیه",
                    Icon = "🏢",
                    BasePrice = 500000m,
                    IsActive = true,
                    IsFeatured = false,
                    Order = 7,
                    MinPrice = 500000m,
                    MaxPrice = 5000000m,
                    FeaturesJson = JsonSerializer.Serialize(new[] { "انبار استاندارد", "امنیت بالا", "دسترسی آسان" }),
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.ServiceCategories.AddRangeAsync(services);
        }

        private static async Task SeedCatalogDataAsync(AppDbContext context)
        {
            var categories = new List<CatalogCategory>
            {
                new CatalogCategory
                {
                    Id = Guid.Parse("66666666-6666-6666-6666-666666666661"),
                    Name = "اثاثیه منزل",
                    Slug = "home-furniture",
                    Description = "لوازم و اثاثیه خانه",
                    Icon = "🛋️",
                    Order = 1,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CatalogCategory
                {
                    Id = Guid.Parse("66666666-6666-6666-6666-666666666662"),
                    Name = "لوازم آشپزخانه",
                    Slug = "kitchen-items",
                    Description = "لوازم و تجهیزات آشپزخانه",
                    Icon = "🍽️",
                    Order = 2,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CatalogCategory
                {
                    Id = Guid.Parse("66666666-6666-6666-6666-666666666663"),
                    Name = "لوازم الکتریکی",
                    Slug = "electrical-items",
                    Description = "وسایل برقی و الکترونیکی",
                    Icon = "⚡",
                    Order = 3,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CatalogCategory
                {
                    Id = Guid.Parse("66666666-6666-6666-6666-666666666664"),
                    Name = "لوازم اداری",
                    Slug = "office-items",
                    Description = "تجهیزات و اثاثیه اداری",
                    Icon = "💼",
                    Order = 4,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.CatalogCategories.AddRangeAsync(categories);

            // CatalogItems نمونه
            var items = new List<CatalogItem>
            {
                // اثاثیه منزل
                new CatalogItem
                {
                    Id = Guid.NewGuid(),
                    CategoryId = Guid.Parse("66666666-6666-6666-6666-666666666661"),
                    Name = "کاناپه ۳ نفره",
                    Description = "کاناپه راحتی سه نفره",
                    BasePrice = 0m,
                    Unit = "عدد",
                    IsHeavy = true,
                    Order = 1,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CatalogItem
                {
                    Id = Guid.NewGuid(),
                    CategoryId = Guid.Parse("66666666-6666-6666-6666-666666666661"),
                    Name = "تخت خواب دو نفره",
                    Description = "تخت خواب کامل با تشک",
                    BasePrice = 0m,
                    Unit = "عدد",
                    IsHeavy = true,
                    Order = 2,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CatalogItem
                {
                    Id = Guid.NewGuid(),
                    CategoryId = Guid.Parse("66666666-6666-6666-6666-666666666661"),
                    Name = "کمد لباس",
                    Description = "کمد دیواری یا ایستاده",
                    BasePrice = 0m,
                    Unit = "عدد",
                    IsHeavy = true,
                    Order = 3,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CatalogItem
                {
                    Id = Guid.NewGuid(),
                    CategoryId = Guid.Parse("66666666-6666-6666-6666-666666666661"),
                    Name = "میز ناهارخوری",
                    Description = "میز ناهارخوری با صندلی",
                    BasePrice = 0m,
                    Unit = "عدد",
                    Order = 4,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                // لوازم آشپزخانه
                new CatalogItem
                {
                    Id = Guid.NewGuid(),
                    CategoryId = Guid.Parse("66666666-6666-6666-6666-666666666662"),
                    Name = "یخچال فریزر",
                    Description = "یخچال فریزر دو درب",
                    BasePrice = 0m,
                    Unit = "عدد",
                    IsHeavy = true,
                    RequiresSpecialHandling = true,
                    Order = 1,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CatalogItem
                {
                    Id = Guid.NewGuid(),
                    CategoryId = Guid.Parse("66666666-6666-6666-6666-666666666662"),
                    Name = "ماشین لباسشویی",
                    Description = "لباسشویی تمام اتوماتیک",
                    BasePrice = 0m,
                    Unit = "عدد",
                    IsHeavy = true,
                    RequiresSpecialHandling = true,
                    Order = 2,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CatalogItem
                {
                    Id = Guid.NewGuid(),
                    CategoryId = Guid.Parse("66666666-6666-6666-6666-666666666662"),
                    Name = "اجاق گاز",
                    Description = "اجاق گاز فردار",
                    BasePrice = 0m,
                    Unit = "عدد",
                    Order = 3,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                // لوازم الکتریکی
                new CatalogItem
                {
                    Id = Guid.NewGuid(),
                    CategoryId = Guid.Parse("66666666-6666-6666-6666-666666666663"),
                    Name = "تلویزیون LED",
                    Description = "تلویزیون ال ای دی",
                    BasePrice = 0m,
                    Unit = "عدد",
                    RequiresSpecialHandling = true,
                    Order = 1,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CatalogItem
                {
                    Id = Guid.NewGuid(),
                    CategoryId = Guid.Parse("66666666-6666-6666-6666-666666666663"),
                    Name = "کولر گازی",
                    Description = "کولر گازی اسپلیت",
                    BasePrice = 0m,
                    Unit = "عدد",
                    IsHeavy = true,
                    Order = 2,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                // لوازم اداری
                new CatalogItem
                {
                    Id = Guid.NewGuid(),
                    CategoryId = Guid.Parse("66666666-6666-6666-6666-666666666664"),
                    Name = "میز کامپیوتر",
                    Description = "میز کار اداری",
                    BasePrice = 0m,
                    Unit = "عدد",
                    Order = 1,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CatalogItem
                {
                    Id = Guid.NewGuid(),
                    CategoryId = Guid.Parse("66666666-6666-6666-6666-666666666664"),
                    Name = "صندلی اداری",
                    Description = "صندلی چرخدار",
                    BasePrice = 0m,
                    Unit = "عدد",
                    Order = 2,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new CatalogItem
                {
                    Id = Guid.NewGuid(),
                    CategoryId = Guid.Parse("66666666-6666-6666-6666-666666666664"),
                    Name = "کمد بایگانی",
                    Description = "فایل کابینت فلزی",
                    BasePrice = 0m,
                    Unit = "عدد",
                    IsHeavy = true,
                    Order = 3,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.CatalogItems.AddRangeAsync(items);
        }

        private static async Task SeedPackingProductsAsync(AppDbContext context)
        {
            var products = new List<PackingProduct>
            {
                new PackingProduct
                {
                    Id = Guid.NewGuid(),
                    Name = "کارتن بزرگ",
                    Description = "کارتن استاندارد بسته‌بندی سایز بزرگ",
                    Price = 50000m,
                    Unit = "عدد",
                    Stock = 1000,
                    Category = "کارتن",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PackingProduct
                {
                    Id = Guid.NewGuid(),
                    Name = "کارتن متوسط",
                    Description = "کارتن استاندارد بسته‌بندی سایز متوسط",
                    Price = 35000m,
                    Unit = "عدد",
                    Stock = 1000,
                    Category = "کارتن",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PackingProduct
                {
                    Id = Guid.NewGuid(),
                    Name = "کارتن کوچک",
                    Description = "کارتن استاندارد بسته‌بندی سایز کوچک",
                    Price = 25000m,
                    Unit = "عدد",
                    Stock = 1000,
                    Category = "کارتن",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PackingProduct
                {
                    Id = Guid.NewGuid(),
                    Name = "نایلون حباب‌دار",
                    Description = "نایلون حباب‌دار برای حفاظت از اشیاء شکستنی",
                    Price = 80000m,
                    Unit = "رول",
                    Stock = 500,
                    Category = "نایلون",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PackingProduct
                {
                    Id = Guid.NewGuid(),
                    Name = "نایلون استرچ",
                    Description = "نایلون استرچ صنعتی",
                    Price = 120000m,
                    Unit = "رول",
                    Stock = 500,
                    Category = "نایلون",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PackingProduct
                {
                    Id = Guid.NewGuid(),
                    Name = "چسب نواری قهوه‌ای",
                    Description = "چسب نواری استاندارد قهوه‌ای",
                    Price = 30000m,
                    Unit = "عدد",
                    Stock = 800,
                    Category = "چسب",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PackingProduct
                {
                    Id = Guid.NewGuid(),
                    Name = "چسب نواری شفاف",
                    Description = "چسب نواری شفاف عریض",
                    Price = 35000m,
                    Unit = "عدد",
                    Stock = 800,
                    Category = "چسب",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PackingProduct
                {
                    Id = Guid.NewGuid(),
                    Name = "فوم محافظ",
                    Description = "فوم محافظ برای اشیاء حساس",
                    Price = 150000m,
                    Unit = "بسته",
                    Stock = 300,
                    Category = "محافظ",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PackingProduct
                {
                    Id = Guid.NewGuid(),
                    Name = "کاغذ مقوایی",
                    Description = "کاغذ مقوایی ضخیم برای پوشش سطوح",
                    Price = 60000m,
                    Unit = "ورق",
                    Stock = 600,
                    Category = "محافظ",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PackingProduct
                {
                    Id = Guid.NewGuid(),
                    Name = "پتو محافظ",
                    Description = "پتو ضخیم برای حفاظت از مبلمان",
                    Price = 200000m,
                    Unit = "عدد",
                    Stock = 200,
                    Category = "پارچه",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PackingProduct
                {
                    Id = Guid.NewGuid(),
                    Name = "طناب بسته‌بندی",
                    Description = "طناب محکم برای بستن کارتن‌ها",
                    Price = 40000m,
                    Unit = "رول",
                    Stock = 400,
                    Category = "متفرقه",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new PackingProduct
                {
                    Id = Guid.NewGuid(),
                    Name = "برچسب شناسایی",
                    Description = "برچسب‌های رنگی برای شناسایی کارتن‌ها",
                    Price = 20000m,
                    Unit = "بسته",
                    Stock = 500,
                    Category = "متفرقه",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.PackingProducts.AddRangeAsync(products);
        }
    }
}
