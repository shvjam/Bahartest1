using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AdminController> _logger;

        public AdminController(AppDbContext context, ILogger<AdminController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/admin/pricing-configs
        [HttpGet("pricing-configs")]
        public async Task<IActionResult> GetPricingConfigs()
        {
            try
            {
                var configs = await _context.PricingConfigs
                    .OrderByDescending(c => c.CreatedAt)
                    .Select(c => new
                    {
                        c.Id,
                        c.Name,
                        c.BaseWorkerRate,
                        c.PerKmRate,
                        c.PerFloorRate,
                        c.StopRate,
                        c.PackingHourlyRate,
                        c.IsActive,
                        c.CreatedAt
                    })
                    .ToListAsync();

                return Ok(configs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting pricing configs");
                return StatusCode(500, new { message = "خطا در دریافت تنظیمات قیمت‌گذاری" });
            }
        }

        // GET: api/admin/pricing-configs/{id}
        [HttpGet("pricing-configs/{id}")]
        public async Task<IActionResult> GetPricingConfig(Guid id)
        {
            try
            {
                var config = await _context.PricingConfigs.FindAsync(id);

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
                    expertVisitFee = config.ExpertVisitFee,
                    isActive = config.IsActive,
                    createdAt = config.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting pricing config {ConfigId}", id);
                return StatusCode(500, new { message = "خطا در دریافت تنظیمات" });
            }
        }

        // POST: api/admin/pricing-configs
        [HttpPost("pricing-configs")]
        public async Task<IActionResult> CreatePricingConfig([FromBody] CreatePricingConfigRequest request)
        {
            try
            {
                // غیرفعال کردن تنظیمات قبلی
                var activeConfigs = await _context.PricingConfigs
                    .Where(c => c.IsActive)
                    .ToListAsync();

                foreach (var config in activeConfigs)
                {
                    config.IsActive = false;
                }

                var newConfig = new PricingConfig
                {
                    Id = Guid.NewGuid(),
                    Name = request.Name,
                    BaseWorkerRate = request.BaseWorkerRate,
                    BaseVehicleRatesJson = JsonSerializer.Serialize(request.BaseVehicleRates),
                    WorkerRatesByVehicleJson = JsonSerializer.Serialize(request.WorkerRatesByVehicle),
                    PerKmRate = request.PerKmRate,
                    PerFloorRate = request.PerFloorRate,
                    WalkingDistanceRatesJson = JsonSerializer.Serialize(request.WalkingDistanceRates),
                    StopRate = request.StopRate,
                    PackingHourlyRate = request.PackingHourlyRate,
                    PackingMaterialsEstimatedCost = request.PackingMaterialsEstimatedCost,
                    IncludePackingMaterialsInInvoice = request.IncludePackingMaterialsInInvoice,
                    CancellationFee = request.CancellationFee,
                    ExpertVisitFee = request.ExpertVisitFee,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.PricingConfigs.AddAsync(newConfig);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetPricingConfig),
                    new { id = newConfig.Id },
                    new
                    {
                        id = newConfig.Id,
                        name = newConfig.Name,
                        message = "تنظیمات قیمت‌گذاری ایجاد شد"
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating pricing config");
                return StatusCode(500, new { message = "خطا در ایجاد تنظیمات" });
            }
        }

        // PUT: api/admin/pricing-configs/{id}
        [HttpPut("pricing-configs/{id}")]
        public async Task<IActionResult> UpdatePricingConfig(Guid id, [FromBody] UpdatePricingConfigRequest request)
        {
            try
            {
                var config = await _context.PricingConfigs.FindAsync(id);

                if (config == null)
                {
                    return NotFound(new { message = "تنظیمات قیمت‌گذاری یافت نشد" });
                }

                if (!string.IsNullOrWhiteSpace(request.Name))
                    config.Name = request.Name;

                if (request.BaseWorkerRate.HasValue)
                    config.BaseWorkerRate = request.BaseWorkerRate.Value;

                if (request.BaseVehicleRates != null)
                    config.BaseVehicleRatesJson = JsonSerializer.Serialize(request.BaseVehicleRates);

                if (request.WorkerRatesByVehicle != null)
                    config.WorkerRatesByVehicleJson = JsonSerializer.Serialize(request.WorkerRatesByVehicle);

                if (request.PerKmRate.HasValue)
                    config.PerKmRate = request.PerKmRate.Value;

                if (request.PerFloorRate.HasValue)
                    config.PerFloorRate = request.PerFloorRate.Value;

                if (request.WalkingDistanceRates != null)
                    config.WalkingDistanceRatesJson = JsonSerializer.Serialize(request.WalkingDistanceRates);

                if (request.StopRate.HasValue)
                    config.StopRate = request.StopRate.Value;

                if (request.PackingHourlyRate.HasValue)
                    config.PackingHourlyRate = request.PackingHourlyRate.Value;

                if (request.PackingMaterialsEstimatedCost.HasValue)
                    config.PackingMaterialsEstimatedCost = request.PackingMaterialsEstimatedCost.Value;

                if (request.IncludePackingMaterialsInInvoice.HasValue)
                    config.IncludePackingMaterialsInInvoice = request.IncludePackingMaterialsInInvoice.Value;

                if (request.CancellationFee.HasValue)
                    config.CancellationFee = request.CancellationFee.Value;

                if (request.ExpertVisitFee.HasValue)
                    config.ExpertVisitFee = request.ExpertVisitFee.Value;

                config.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    id = config.Id,
                    name = config.Name,
                    message = "تنظیمات به‌روزرسانی شد"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating pricing config {ConfigId}", id);
                return StatusCode(500, new { message = "خطا در به‌روزرسانی تنظیمات" });
            }
        }

        // PUT: api/admin/pricing-configs/{id}/activate
        [HttpPut("pricing-configs/{id}/activate")]
        public async Task<IActionResult> ActivatePricingConfig(Guid id)
        {
            try
            {
                // غیرفعال کردن همه تنظیمات
                var allConfigs = await _context.PricingConfigs.ToListAsync();
                foreach (var config in allConfigs)
                {
                    config.IsActive = false;
                }

                // فعال کردن تنظیمات مورد نظر
                var targetConfig = await _context.PricingConfigs.FindAsync(id);
                if (targetConfig == null)
                {
                    return NotFound(new { message = "تنظیمات قیمت‌گذاری یافت نشد" });
                }

                targetConfig.IsActive = true;
                targetConfig.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "تنظیمات فعال شد" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error activating pricing config {ConfigId}", id);
                return StatusCode(500, new { message = "خطا در فعال‌سازی تنظیمات" });
            }
        }

        // GET: api/admin/discount-codes
        [HttpGet("discount-codes")]
        public async Task<IActionResult> GetDiscountCodes([FromQuery] bool? isActive = null)
        {
            try
            {
                var query = _context.DiscountCodes.AsQueryable();

                if (isActive.HasValue)
                {
                    query = query.Where(dc => dc.IsActive == isActive.Value);
                }

                var codes = await query
                    .OrderByDescending(dc => dc.CreatedAt)
                    .Select(dc => new
                    {
                        dc.Id,
                        dc.Code,
                        dc.Type,
                        dc.Value,
                        dc.MaxDiscount,
                        dc.MinOrderAmount,
                        dc.StartDate,
                        dc.EndDate,
                        dc.UsageLimit,
                        dc.UsageCount,
                        dc.PerUserLimit,
                        dc.IsActive,
                        dc.Description,
                        dc.CreatedAt
                    })
                    .ToListAsync();

                return Ok(codes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting discount codes");
                return StatusCode(500, new { message = "خطا در دریافت کدهای تخفیف" });
            }
        }

        // POST: api/admin/discount-codes
        [HttpPost("discount-codes")]
        public async Task<IActionResult> CreateDiscountCode([FromBody] CreateDiscountCodeRequest request)
        {
            try
            {
                var existingCode = await _context.DiscountCodes
                    .FirstOrDefaultAsync(dc => dc.Code == request.Code);

                if (existingCode != null)
                {
                    return Conflict(new { message = "این کد تخفیف قبلاً ثبت شده است" });
                }

                var discountCode = new DiscountCode
                {
                    Id = Guid.NewGuid(),
                    Code = request.Code.ToUpper(),
                    Type = request.Type,
                    Value = request.Value,
                    MaxDiscount = request.MaxDiscount,
                    MinOrderAmount = request.MinOrderAmount,
                    StartDate = request.StartDate,
                    EndDate = request.EndDate,
                    UsageLimit = request.UsageLimit,
                    UsageCount = 0,
                    PerUserLimit = request.PerUserLimit,
                    Description = request.Description,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.DiscountCodes.AddAsync(discountCode);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetDiscountCodes),
                    new
                    {
                        id = discountCode.Id,
                        code = discountCode.Code,
                        message = "کد تخفیف ایجاد شد"
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating discount code");
                return StatusCode(500, new { message = "خطا در ایجاد کد تخفیف" });
            }
        }

        // PUT: api/admin/discount-codes/{id}
        [HttpPut("discount-codes/{id}")]
        public async Task<IActionResult> UpdateDiscountCode(Guid id, [FromBody] UpdateDiscountCodeRequest request)
        {
            try
            {
                var discountCode = await _context.DiscountCodes.FindAsync(id);

                if (discountCode == null)
                {
                    return NotFound(new { message = "کد تخفیف یافت نشد" });
                }

                if (request.Value.HasValue)
                    discountCode.Value = request.Value.Value;

                if (request.MaxDiscount.HasValue)
                    discountCode.MaxDiscount = request.MaxDiscount;

                if (request.MinOrderAmount.HasValue)
                    discountCode.MinOrderAmount = request.MinOrderAmount;

                if (request.StartDate.HasValue)
                    discountCode.StartDate = request.StartDate.Value;

                if (request.EndDate.HasValue)
                    discountCode.EndDate = request.EndDate;

                if (request.UsageLimit.HasValue)
                    discountCode.UsageLimit = request.UsageLimit;

                if (request.PerUserLimit.HasValue)
                    discountCode.PerUserLimit = request.PerUserLimit;

                if (!string.IsNullOrWhiteSpace(request.Description))
                    discountCode.Description = request.Description;

                if (request.IsActive.HasValue)
                    discountCode.IsActive = request.IsActive.Value;

                discountCode.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    id = discountCode.Id,
                    code = discountCode.Code,
                    message = "کد تخفیف به‌روزرسانی شد"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating discount code {DiscountCodeId}", id);
                return StatusCode(500, new { message = "خطا در به‌روزرسانی کد تخفیف" });
            }
        }

        // DELETE: api/admin/discount-codes/{id}
        [HttpDelete("discount-codes/{id}")]
        public async Task<IActionResult> DeleteDiscountCode(Guid id)
        {
            try
            {
                var discountCode = await _context.DiscountCodes.FindAsync(id);

                if (discountCode == null)
                {
                    return NotFound(new { message = "کد تخفیف یافت نشد" });
                }

                discountCode.IsActive = false;
                discountCode.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "کد تخفیف غیرفعال شد" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting discount code {DiscountCodeId}", id);
                return StatusCode(500, new { message = "خطا در حذف کد تخفیف" });
            }
        }

        // GET: api/admin/system-info
        [HttpGet("system-info")]
        public async Task<IActionResult> GetSystemInfo()
        {
            try
            {
                var databaseInfo = new
                {
                    canConnect = await _context.Database.CanConnectAsync(),
                    providerName = _context.Database.ProviderName,
                    connectionString = _context.Database.GetConnectionString()?.Replace("Password=", "Password=***")
                };

                var counts = new
                {
                    users = await _context.Users.CountAsync(),
                    drivers = await _context.Drivers.CountAsync(),
                    orders = await _context.Orders.CountAsync(),
                    services = await _context.ServiceCategories.CountAsync(),
                    catalogItems = await _context.CatalogItems.CountAsync(),
                    packingProducts = await _context.PackingProducts.CountAsync(),
                    notifications = await _context.Notifications.CountAsync()
                };

                return Ok(new
                {
                    database = databaseInfo,
                    counts,
                    version = "1.0.0",
                    environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system info");
                return StatusCode(500, new { message = "خطا در دریافت اطلاعات سیستم" });
            }
        }
    }

    // Request DTOs
    public class CreatePricingConfigRequest
    {
        public string Name { get; set; } = string.Empty;
        public decimal BaseWorkerRate { get; set; }
        public Dictionary<string, decimal> BaseVehicleRates { get; set; } = new();
        public Dictionary<string, decimal> WorkerRatesByVehicle { get; set; } = new();
        public decimal PerKmRate { get; set; }
        public decimal PerFloorRate { get; set; }
        public Dictionary<string, decimal> WalkingDistanceRates { get; set; } = new();
        public decimal StopRate { get; set; }
        public decimal PackingHourlyRate { get; set; }
        public decimal PackingMaterialsEstimatedCost { get; set; }
        public bool IncludePackingMaterialsInInvoice { get; set; }
        public decimal CancellationFee { get; set; }
        public decimal ExpertVisitFee { get; set; }
    }

    public class UpdatePricingConfigRequest
    {
        public string? Name { get; set; }
        public decimal? BaseWorkerRate { get; set; }
        public Dictionary<string, decimal>? BaseVehicleRates { get; set; }
        public Dictionary<string, decimal>? WorkerRatesByVehicle { get; set; }
        public decimal? PerKmRate { get; set; }
        public decimal? PerFloorRate { get; set; }
        public Dictionary<string, decimal>? WalkingDistanceRates { get; set; }
        public decimal? StopRate { get; set; }
        public decimal? PackingHourlyRate { get; set; }
        public decimal? PackingMaterialsEstimatedCost { get; set; }
        public bool? IncludePackingMaterialsInInvoice { get; set; }
        public decimal? CancellationFee { get; set; }
        public decimal? ExpertVisitFee { get; set; }
    }

    public class CreateDiscountCodeRequest
    {
        public string Code { get; set; } = string.Empty;
        public string Type { get; set; } = "PERCENTAGE"; // PERCENTAGE or FIXED
        public decimal Value { get; set; }
        public decimal? MaxDiscount { get; set; }
        public decimal? MinOrderAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? UsageLimit { get; set; }
        public int? PerUserLimit { get; set; }
        public string? Description { get; set; }
    }

    public class UpdateDiscountCodeRequest
    {
        public decimal? Value { get; set; }
        public decimal? MaxDiscount { get; set; }
        public decimal? MinOrderAmount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? UsageLimit { get; set; }
        public int? PerUserLimit { get; set; }
        public string? Description { get; set; }
        public bool? IsActive { get; set; }
    }
}
