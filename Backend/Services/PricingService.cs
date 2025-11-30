using BarbariBahar.API.Services.Interfaces;
using System.Text.Json;

namespace BarbariBahar.API.Services
{
    public class PricingService : IPricingService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<PricingService> _logger;

        public PricingService(AppDbContext context, ILogger<PricingService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<PriceBreakdown> CalculatePriceAsync(PriceCalculationDto dto)
        {
            try
            {
                var config = await GetActivePricingConfigAsync();
                
                if (config == null)
                {
                    throw new Exception("تنظیمات قیمت‌گذاری یافت نشد");
                }

                // پارس کردن JSON ها
                var baseVehicleRates = JsonSerializer.Deserialize<Dictionary<string, decimal>>(
                    config.BaseVehicleRatesJson ?? "{}"
                ) ?? new Dictionary<string, decimal>();

                var workerRates = JsonSerializer.Deserialize<Dictionary<string, decimal>>(
                    config.WorkerRatesByVehicleJson ?? "{}"
                ) ?? new Dictionary<string, decimal>();

                var walkingDistanceRates = JsonSerializer.Deserialize<Dictionary<string, decimal>>(
                    config.WalkingDistanceRatesJson ?? "{}"
                ) ?? new Dictionary<string, decimal>();

                // 1. قیمت پایه خودرو
                var vehicleTypeKey = dto.VehicleType.ToString();
                var vehiclePrice = baseVehicleRates.ContainsKey(vehicleTypeKey) 
                    ? baseVehicleRates[vehicleTypeKey] 
                    : 0m;

                // 2. قیمت کارگر
                var workerPrice = 0m;
                if (dto.RequiresWorkers && dto.WorkerCount > 0)
                {
                    var workerRate = workerRates.ContainsKey(vehicleTypeKey)
                        ? workerRates[vehicleTypeKey]
                        : config.BaseWorkerRate;
                    workerPrice = workerRate * dto.WorkerCount;
                }

                // 3. قیمت مسافت
                var distancePrice = 0m;
                if (dto.Distance.HasValue && dto.Distance.Value > 0)
                {
                    distancePrice = dto.Distance.Value * config.PerKmRate;
                }

                // 4. قیمت طبقه
                var floorPrice = 0m;
                if (dto.Floors != null && dto.Floors.Any())
                {
                    foreach (var floor in dto.Floors)
                    {
                        if (!floor.HasElevator && floor.FloorNumber > 0)
                        {
                            floorPrice += floor.FloorNumber * config.PerFloorRate;
                        }
                    }
                }

                // 5. قیمت مسافت پیاده‌روی
                var walkingDistancePrice = 0m;
                if (dto.WalkingDistances != null && dto.WalkingDistances.Any())
                {
                    foreach (var distance in dto.WalkingDistances)
                    {
                        var key = distance.ToString();
                        if (walkingDistanceRates.ContainsKey(key))
                        {
                            walkingDistancePrice += walkingDistanceRates[key];
                        }
                        else
                        {
                            // پیدا کردن نزدیک‌ترین مقدار
                            var closest = walkingDistanceRates.Keys
                                .Select(k => int.Parse(k))
                                .Where(k => k <= distance)
                                .OrderByDescending(k => k)
                                .FirstOrDefault();
                            
                            if (closest > 0)
                            {
                                walkingDistancePrice += walkingDistanceRates[closest.ToString()];
                            }
                        }
                    }
                }

                // 6. قیمت توقف‌ها
                var stopsPrice = 0m;
                if (dto.StopsCount.HasValue && dto.StopsCount.Value > 0)
                {
                    stopsPrice = dto.StopsCount.Value * config.StopRate;
                }

                // 7. قیمت بسته‌بندی
                var packingPrice = 0m;
                if (dto.RequiresPacking)
                {
                    if (dto.PackingDuration.HasValue && dto.PackingDuration.Value > 0)
                    {
                        packingPrice += dto.PackingDuration.Value * config.PackingHourlyRate;
                    }

                    if (config.IncludePackingMaterialsInInvoice)
                    {
                        packingPrice += config.PackingMaterialsEstimatedCost ?? 0m;
                    }
                }

                // 8. جمع کل قبل از تخفیف
                var subtotal = vehiclePrice + workerPrice + distancePrice + 
                              floorPrice + walkingDistancePrice + stopsPrice + packingPrice;

                // 9. محاسبه تخفیف
                var discount = 0m;
                DiscountInfo? discountInfo = null;

                if (!string.IsNullOrEmpty(dto.DiscountCode))
                {
                    var (isValid, discountAmount, message) = await ValidateDiscountCodeAsync(dto.DiscountCode, subtotal);
                    
                    if (isValid)
                    {
                        discount = discountAmount;
                        
                        var discountCode = await _context.DiscountCodes
                            .FirstOrDefaultAsync(dc => dc.Code == dto.DiscountCode);

                        if (discountCode != null)
                        {
                            discountInfo = new DiscountInfo
                            {
                                Code = discountCode.Code,
                                Type = discountCode.Type,
                                Value = discountCode.Value,
                                DiscountAmount = discount,
                                IsValid = true,
                                Message = message
                            };
                        }
                    }
                    else
                    {
                        discountInfo = new DiscountInfo
                        {
                            Code = dto.DiscountCode,
                            Type = "",
                            Value = 0,
                            DiscountAmount = 0,
                            IsValid = false,
                            Message = message
                        };
                    }
                }

                // 10. قیمت نهایی
                var totalPrice = Math.Max(0, subtotal - discount);

                // 11. محاسبه زمان تخمینی
                var estimatedDuration = await CalculateEstimatedDurationAsync(dto);

                return new PriceBreakdown
                {
                    BasePrice = 0, // قیمت پایه در خودرو شامل شده
                    VehiclePrice = vehiclePrice,
                    WorkerPrice = workerPrice,
                    DistancePrice = distancePrice,
                    FloorPrice = floorPrice,
                    WalkingDistancePrice = walkingDistancePrice,
                    StopsPrice = stopsPrice,
                    PackingPrice = packingPrice,
                    Subtotal = subtotal,
                    Discount = discount,
                    TotalPrice = totalPrice,
                    EstimatedDuration = estimatedDuration,
                    DiscountInfo = discountInfo
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating price");
                throw;
            }
        }

        public async Task<(bool IsValid, decimal Discount, string? Message)> ValidateDiscountCodeAsync(
            string code, decimal orderAmount)
        {
            try
            {
                var discountCode = await _context.DiscountCodes
                    .FirstOrDefaultAsync(dc => dc.Code == code && dc.IsActive);

                if (discountCode == null)
                {
                    return (false, 0, "کد تخفیف یافت نشد");
                }

                // بررسی تاریخ شروع
                if (discountCode.StartDate > DateTime.UtcNow)
                {
                    return (false, 0, "کد تخفیف هنوز فعال نشده است");
                }

                // بررسی تاریخ پایان
                if (discountCode.EndDate.HasValue && discountCode.EndDate < DateTime.UtcNow)
                {
                    return (false, 0, "کد تخفیف منقضی شده است");
                }

                // بررسی محدودیت استفاده
                if (discountCode.UsageLimit.HasValue && 
                    discountCode.UsageCount >= discountCode.UsageLimit.Value)
                {
                    return (false, 0, "ظرفیت استفاده از این کد تخفیف تکمیل شده است");
                }

                // بررسی حداقل مبلغ سفارش
                if (discountCode.MinOrderAmount.HasValue && 
                    orderAmount < discountCode.MinOrderAmount.Value)
                {
                    return (false, 0, $"حداقل مبلغ سفارش برای استفاده از این کد {discountCode.MinOrderAmount:N0} تومان است");
                }

                // محاسبه مقدار تخفیف
                decimal discount = 0;

                if (discountCode.Type == "PERCENTAGE")
                {
                    discount = orderAmount * (discountCode.Value / 100m);
                    
                    // اعمال حداکثر تخفیف
                    if (discountCode.MaxDiscount.HasValue && discount > discountCode.MaxDiscount.Value)
                    {
                        discount = discountCode.MaxDiscount.Value;
                    }
                }
                else if (discountCode.Type == "FIXED")
                {
                    discount = discountCode.Value;
                }

                return (true, discount, "کد تخفیف معتبر است");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating discount code {Code}", code);
                return (false, 0, "خطا در اعتبارسنجی کد تخفیف");
            }
        }

        public async Task<PricingConfig?> GetActivePricingConfigAsync()
        {
            return await _context.PricingConfigs
                .Where(c => c.IsActive)
                .OrderByDescending(c => c.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public Task<int> CalculateEstimatedDurationAsync(PriceCalculationDto dto)
        {
            var duration = 60; // حداقل 1 ساعت

            // زمان مسافت (2 دقیقه به ازای هر کیلومتر)
            if (dto.Distance.HasValue)
            {
                duration += (int)(dto.Distance.Value * 2);
            }

            // زمان طبقات (5 دقیقه به ازای هر طبقه بدون آسانسور)
            if (dto.Floors != null && dto.Floors.Any())
            {
                var totalFloors = dto.Floors
                    .Where(f => !f.HasElevator)
                    .Sum(f => f.FloorNumber);
                duration += totalFloors * 5;
            }

            // زمان توقف‌ها (15 دقیقه به ازای هر توقف)
            if (dto.StopsCount.HasValue)
            {
                duration += dto.StopsCount.Value * 15;
            }

            // زمان بسته‌بندی
            if (dto.RequiresPacking && dto.PackingDuration.HasValue)
            {
                duration += dto.PackingDuration.Value * 60; // تبدیل ساعت به دقیقه
            }

            // زمان کارگر (اگر نیاز به کارگر باشد، زمان بیشتری می‌بره)
            if (dto.RequiresWorkers && dto.WorkerCount > 0)
            {
                duration += 30; // 30 دقیقه اضافی
            }

            return Task.FromResult(duration);
        }
    }
}