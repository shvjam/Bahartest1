using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PricingController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<PricingController> _logger;

        public PricingController(AppDbContext context, ILogger<PricingController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST: api/pricing/calculate
        [HttpPost("calculate")]
        public async Task<IActionResult> CalculatePrice([FromBody] PriceCalculationRequest request)
        {
            try
            {
                // دریافت تنظیمات فعال
                var config = await _context.PricingConfigs
                    .Where(c => c.IsActive)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync();

                if (config == null)
                {
                    return NotFound(new { message = "تنظیمات قیمت‌گذاری یافت نشد" });
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

                // محاسبه قیمت پایه خودرو
                var vehicleTypeKey = request.VehicleType.ToString();
                var vehiclePrice = baseVehicleRates.ContainsKey(vehicleTypeKey) 
                    ? baseVehicleRates[vehicleTypeKey] 
                    : 0m;

                // محاسبه قیمت کارگر
                var workerPrice = 0m;
                if (request.RequiresWorkers && request.WorkerCount > 0)
                {
                    var workerRate = workerRates.ContainsKey(vehicleTypeKey)
                        ? workerRates[vehicleTypeKey]
                        : config.BaseWorkerRate;
                    workerPrice = workerRate * request.WorkerCount;
                }

                // محاسبه قیمت مسافت
                var distancePrice = 0m;
                if (request.Distance.HasValue && request.Distance.Value > 0)
                {
                    distancePrice = request.Distance.Value * config.PerKmRate;
                }

                // محاسبه قیمت طبقه
                var floorPrice = 0m;
                if (request.Floors != null && request.Floors.Any())
                {
                    foreach (var floor in request.Floors)
                    {
                        if (!floor.HasElevator && floor.FloorNumber > 0)
                        {
                            floorPrice += floor.FloorNumber * config.PerFloorRate;
                        }
                    }
                }

                // محاسبه قیمت مسافت پیاده‌روی
                var walkingDistancePrice = 0m;
                if (request.WalkingDistances != null && request.WalkingDistances.Any())
                {
                    foreach (var distance in request.WalkingDistances)
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

                // محاسبه قیمت توقف‌ها
                var stopsPrice = 0m;
                if (request.StopsCount.HasValue && request.StopsCount.Value > 0)
                {
                    stopsPrice = request.StopsCount.Value * config.StopRate;
                }

                // محاسبه قیمت بسته‌بندی
                var packingPrice = 0m;
                if (request.RequiresPacking)
                {
                    if (request.PackingDuration.HasValue && request.PackingDuration.Value > 0)
                    {
                        packingPrice += request.PackingDuration.Value * config.PackingHourlyRate;
                    }

                    if (config.IncludePackingMaterialsInInvoice)
                    {
                        packingPrice += config.PackingMaterialsEstimatedCost ?? 0m;
                    }
                }

                // جمع کل قبل از تخفیف
                var subtotal = vehiclePrice + workerPrice + distancePrice + 
                              floorPrice + walkingDistancePrice + stopsPrice + packingPrice;

                // محاسبه تخفیف
                var discount = 0m;
                var discountDetails = new Dictionary<string, object>();

                if (!string.IsNullOrEmpty(request.DiscountCode))
                {
                    var discountCode = await _context.DiscountCodes
                        .FirstOrDefaultAsync(dc => 
                            dc.Code == request.DiscountCode && 
                            dc.IsActive &&
                            dc.StartDate <= DateTime.UtcNow &&
                            (dc.EndDate == null || dc.EndDate >= DateTime.UtcNow) &&
                            (dc.UsageLimit == null || dc.UsageCount < dc.UsageLimit)
                        );

                    if (discountCode != null)
                    {
                        // بررسی حداقل مبلغ سفارش
                        if (discountCode.MinOrderAmount == null || subtotal >= discountCode.MinOrderAmount)
                        {
                            if (discountCode.Type == "PERCENTAGE")
                            {
                                discount = subtotal * (discountCode.Value / 100m);
                                
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

                            discountDetails = new Dictionary<string, object>
                            {
                                { "code", discountCode.Code },
                                { "type", discountCode.Type },
                                { "value", discountCode.Value },
                                { "discount", discount },
                                { "isValid", true }
                            };
                        }
                        else
                        {
                            discountDetails = new Dictionary<string, object>
                            {
                                { "code", request.DiscountCode },
                                { "isValid", false },
                                { "reason", $"حداقل مبلغ سفارش {discountCode.MinOrderAmount:N0} تومان است" }
                            };
                        }
                    }
                    else
                    {
                        discountDetails = new Dictionary<string, object>
                        {
                            { "code", request.DiscountCode },
                            { "isValid", false },
                            { "reason", "کد تخفیف نامعتبر یا منقضی شده است" }
                        };
                    }
                }

                // قیمت نهایی
                var totalPrice = Math.Max(0, subtotal - discount);

                return Ok(new
                {
                    breakdown = new
                    {
                        vehiclePrice = vehiclePrice,
                        workerPrice = workerPrice,
                        distancePrice = distancePrice,
                        floorPrice = floorPrice,
                        walkingDistancePrice = walkingDistancePrice,
                        stopsPrice = stopsPrice,
                        packingPrice = packingPrice
                    },
                    subtotal = subtotal,
                    discount = discount,
                    discountDetails = discountDetails.Count > 0 ? discountDetails : null,
                    totalPrice = totalPrice,
                    priceFormatted = $"{totalPrice:N0} تومان",
                    estimatedDuration = CalculateEstimatedDuration(request)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating price");
                return StatusCode(500, new { message = "خطا در محاسبه قیمت" });
            }
        }

        // GET: api/pricing/config
        [HttpGet("config")]
        public async Task<IActionResult> GetPricingConfig()
        {
            try
            {
                var config = await _context.PricingConfigs
                    .Where(c => c.IsActive)
                    .OrderByDescending(c => c.CreatedAt)
                    .FirstOrDefaultAsync();

                if (config == null)
                {
                    return NotFound(new { message = "تنظیمات قیمت‌گذاری یافت نشد" });
                }

                return Ok(new
                {
                    id = config.Id,
                    name = config.Name,
                    baseWorkerRate = config.BaseWorkerRate,
                    baseVehicleRates = JsonSerializer.Deserialize<Dictionary<string, decimal>>(config.BaseVehicleRatesJson ?? "{}"),
                    workerRatesByVehicle = JsonSerializer.Deserialize<Dictionary<string, decimal>>(config.WorkerRatesByVehicleJson ?? "{}"),
                    perKmRate = config.PerKmRate,
                    perFloorRate = config.PerFloorRate,
                    walkingDistanceRates = JsonSerializer.Deserialize<Dictionary<string, decimal>>(config.WalkingDistanceRatesJson ?? "{}"),
                    stopRate = config.StopRate,
                    packingHourlyRate = config.PackingHourlyRate,
                    packingMaterialsEstimatedCost = config.PackingMaterialsEstimatedCost,
                    includePackingMaterialsInInvoice = config.IncludePackingMaterialsInInvoice,
                    cancellationFee = config.CancellationFee,
                    expertVisitFee = config.ExpertVisitFee
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting pricing config");
                return StatusCode(500, new { message = "خطا در دریافت تنظیمات قیمت‌گذاری" });
            }
        }

        // POST: api/pricing/validate-discount
        [HttpPost("validate-discount")]
        public async Task<IActionResult> ValidateDiscountCode([FromBody] ValidateDiscountRequest request)
        {
            try
            {
                var discountCode = await _context.DiscountCodes
                    .FirstOrDefaultAsync(dc => dc.Code == request.Code && dc.IsActive);

                if (discountCode == null)
                {
                    return Ok(new
                    {
                        isValid = false,
                        message = "کد تخفیف یافت نشد"
                    });
                }

                // بررسی تاریخ
                if (discountCode.StartDate > DateTime.UtcNow)
                {
                    return Ok(new
                    {
                        isValid = false,
                        message = "کد تخفیف هنوز فعال نشده است"
                    });
                }

                if (discountCode.EndDate.HasValue && discountCode.EndDate < DateTime.UtcNow)
                {
                    return Ok(new
                    {
                        isValid = false,
                        message = "کد تخفیف منقضی شده است"
                    });
                }

                // بررسی محدودیت استفاده
                if (discountCode.UsageLimit.HasValue && discountCode.UsageCount >= discountCode.UsageLimit.Value)
                {
                    return Ok(new
                    {
                        isValid = false,
                        message = "ظرفیت استفاده از این کد تخفیف تکمیل شده است"
                    });
                }

                // بررسی حداقل مبلغ سفارش
                if (discountCode.MinOrderAmount.HasValue && 
                    request.OrderAmount.HasValue && 
                    request.OrderAmount.Value < discountCode.MinOrderAmount.Value)
                {
                    return Ok(new
                    {
                        isValid = false,
                        message = $"حداقل مبلغ سفارش برای استفاده از این کد {discountCode.MinOrderAmount:N0} تومان است"
                    });
                }

                return Ok(new
                {
                    isValid = true,
                    message = "کد تخفیف معتبر است",
                    discount = new
                    {
                        code = discountCode.Code,
                        type = discountCode.Type,
                        value = discountCode.Value,
                        maxDiscount = discountCode.MaxDiscount,
                        description = discountCode.Description
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating discount code");
                return StatusCode(500, new { message = "خطا در اعتبارسنجی کد تخفیف" });
            }
        }

        // Helper Methods
        private int CalculateEstimatedDuration(PriceCalculationRequest request)
        {
            var duration = 60; // حداقل 1 ساعت

            // اضافه کردن زمان بر اساس مسافت
            if (request.Distance.HasValue)
            {
                duration += (int)(request.Distance.Value * 2); // 2 دقیقه به ازای هر کیلومتر
            }

            // اضافه کردن زمان بر اساس طبقه
            if (request.Floors != null && request.Floors.Any())
            {
                var totalFloors = request.Floors.Sum(f => f.HasElevator ? 0 : f.FloorNumber);
                duration += totalFloors * 5; // 5 دقیقه به ازای هر طبقه بدون آسانسور
            }

            // اضافه کردن زمان بر اساس توقف‌ها
            if (request.StopsCount.HasValue)
            {
                duration += request.StopsCount.Value * 15; // 15 دقیقه به ازای هر توقف
            }

            // اضافه کردن زمان بسته‌بندی
            if (request.RequiresPacking && request.PackingDuration.HasValue)
            {
                duration += request.PackingDuration.Value * 60; // تبدیل ساعت به دقیقه
            }

            return duration;
        }
    }

    // Request DTOs
    public class PriceCalculationRequest
    {
        public VehicleType VehicleType { get; set; }
        public bool RequiresWorkers { get; set; }
        public int WorkerCount { get; set; }
        public decimal? Distance { get; set; }
        public List<FloorInfo>? Floors { get; set; }
        public List<int>? WalkingDistances { get; set; }
        public int? StopsCount { get; set; }
        public bool RequiresPacking { get; set; }
        public int? PackingDuration { get; set; }
        public string? DiscountCode { get; set; }
    }

    public class FloorInfo
    {
        public int FloorNumber { get; set; }
        public bool HasElevator { get; set; }
    }

    public class ValidateDiscountRequest
    {
        public string Code { get; set; } = string.Empty;
        public decimal? OrderAmount { get; set; }
    }
}