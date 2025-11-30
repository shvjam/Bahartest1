using Microsoft.AspNetCore.Mvc;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ServicesController> _logger;

        public ServicesController(AppDbContext context, ILogger<ServicesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/services
        [HttpGet]
        public async Task<IActionResult> GetServices(
            [FromQuery] bool? isActive = null,
            [FromQuery] bool? isFeatured = null)
        {
            try
            {
                var servicesQuery = await _context.ServiceCategories
                    .Where(s => s.IsActive)
                    .OrderBy(s => s.Order)
                    .ToListAsync();

                var services = servicesQuery.Select(s => new
                    {
                        s.Id,
                        s.Name,
                        s.Slug,
                        s.Description,
                        s.ShortDescription,
                        s.Icon,
                        s.BasePrice,
                        s.PricePerKm,
                        s.MinPrice,
                        s.MaxPrice,
                        s.IsActive,
                        s.IsFeatured,
                        s.Order,
                        Features = System.Text.Json.JsonSerializer.Deserialize<string[]>(s.FeaturesJson ?? "[]")
                    })
                    .ToList();

                return Ok(services);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting services");
                return StatusCode(500, new { message = "خطا در دریافت لیست خدمات" });
            }
        }

        // GET: api/services/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetService(Guid id)
        {
            try
            {
                var service = await _context.ServiceCategories
                    .Include(s => s.Orders)
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (service == null)
                {
                    return NotFound(new { message = "خدمت یافت نشد" });
                }

                return Ok(new
                {
                    id = service.Id,
                    name = service.Name,
                    slug = service.Slug,
                    description = service.Description,
                    shortDescription = service.ShortDescription,
                    icon = service.Icon,
                    basePrice = service.BasePrice,
                    pricePerKm = service.PricePerKm,
                    minPrice = service.MinPrice,
                    maxPrice = service.MaxPrice,
                    isActive = service.IsActive,
                    isFeatured = service.IsFeatured,
                    order = service.Order,
                    features = System.Text.Json.JsonSerializer.Deserialize<string[]>(service.FeaturesJson ?? "[]"),
                    stats = new
                    {
                        totalOrders = service.Orders.Count,
                        completedOrders = service.Orders.Count(o => o.Status == OrderStatus.COMPLETED)
                    },
                    createdAt = service.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting service {ServiceId}", id);
                return StatusCode(500, new { message = "خطا در دریافت جزئیات خدمت" });
            }
        }

        // GET: api/services/slug/{slug}
        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetServiceBySlug(string slug)
        {
            try
            {
                var service = await _context.ServiceCategories
                    .FirstOrDefaultAsync(s => s.Slug == slug);

                if (service == null)
                {
                    return NotFound(new { message = "خدمت یافت نشد" });
                }

                return Ok(new
                {
                    id = service.Id,
                    name = service.Name,
                    slug = service.Slug,
                    description = service.Description,
                    shortDescription = service.ShortDescription,
                    icon = service.Icon,
                    basePrice = service.BasePrice,
                    pricePerKm = service.PricePerKm,
                    minPrice = service.MinPrice,
                    maxPrice = service.MaxPrice,
                    features = System.Text.Json.JsonSerializer.Deserialize<string[]>(service.FeaturesJson ?? "[]")
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting service by slug {Slug}", slug);
                return StatusCode(500, new { message = "خطا در دریافت خدمت" });
            }
        }

        // POST: api/services
        [HttpPost]
        public async Task<IActionResult> CreateService([FromBody] CreateServiceRequest request)
        {
            try
            {
                // بررسی تکراری بودن Slug
                var existingService = await _context.ServiceCategories
                    .FirstOrDefaultAsync(s => s.Slug == request.Slug);

                if (existingService != null)
                {
                    return Conflict(new { message = "این Slug قبلاً استفاده شده است" });
                }

                var featuresJson = System.Text.Json.JsonSerializer.Serialize(request.Features ?? new string[0]);

                var service = new ServiceCategory
                {
                    Id = Guid.NewGuid(),
                    Name = request.Name,
                    Slug = request.Slug,
                    Description = request.Description,
                    ShortDescription = request.ShortDescription,
                    Icon = request.Icon,
                    BasePrice = request.BasePrice,
                    PricePerKm = request.PricePerKm,
                    MinPrice = request.MinPrice,
                    MaxPrice = request.MaxPrice,
                    FeaturesJson = featuresJson,
                    IsActive = request.IsActive ?? true,
                    IsFeatured = request.IsFeatured ?? false,
                    Order = request.Order ?? 999,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.ServiceCategories.AddAsync(service);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetService),
                    new { id = service.Id },
                    new
                    {
                        id = service.Id,
                        name = service.Name,
                        slug = service.Slug,
                        message = "خدمت با موفقیت ایجاد شد"
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating service");
                return StatusCode(500, new { message = "خطا در ایجاد خدمت" });
            }
        }

        // PUT: api/services/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(Guid id, [FromBody] UpdateServiceRequest request)
        {
            try
            {
                var service = await _context.ServiceCategories.FindAsync(id);

                if (service == null)
                {
                    return NotFound(new { message = "خدمت یافت نشد" });
                }

                // به‌روزرسانی فیلدها
                if (!string.IsNullOrWhiteSpace(request.Name))
                    service.Name = request.Name;

                if (!string.IsNullOrWhiteSpace(request.Description))
                    service.Description = request.Description;

                if (!string.IsNullOrWhiteSpace(request.ShortDescription))
                    service.ShortDescription = request.ShortDescription;

                if (!string.IsNullOrWhiteSpace(request.Icon))
                    service.Icon = request.Icon;

                if (request.BasePrice.HasValue)
                    service.BasePrice = request.BasePrice.Value;

                if (request.PricePerKm.HasValue)
                    service.PricePerKm = request.PricePerKm;

                if (request.MinPrice.HasValue)
                    service.MinPrice = request.MinPrice;

                if (request.MaxPrice.HasValue)
                    service.MaxPrice = request.MaxPrice;

                if (request.Features != null)
                    service.FeaturesJson = System.Text.Json.JsonSerializer.Serialize(request.Features);

                if (request.IsActive.HasValue)
                    service.IsActive = request.IsActive.Value;

                if (request.IsFeatured.HasValue)
                    service.IsFeatured = request.IsFeatured.Value;

                if (request.Order.HasValue)
                    service.Order = request.Order.Value;

                service.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    id = service.Id,
                    name = service.Name,
                    slug = service.Slug,
                    message = "خدمت به‌روزرسانی شد"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating service {ServiceId}", id);
                return StatusCode(500, new { message = "خطا در به‌روزرسانی خدمت" });
            }
        }

        // DELETE: api/services/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(Guid id)
        {
            try
            {
                var service = await _context.ServiceCategories.FindAsync(id);

                if (service == null)
                {
                    return NotFound(new { message = "خدمت یافت نشد" });
                }

                // Soft Delete
                service.IsActive = false;
                service.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "خدمت با موفقیت غیرفعال شد" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting service {ServiceId}", id);
                return StatusCode(500, new { message = "خطا در حذف خدمت" });
            }
        }
    }

    // Request DTOs
    public class CreateServiceRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ShortDescription { get; set; }
        public string? Icon { get; set; }
        public decimal BasePrice { get; set; }
        public decimal? PricePerKm { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string[]? Features { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsFeatured { get; set; }
        public int? Order { get; set; }
    }

    public class UpdateServiceRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? ShortDescription { get; set; }
        public string? Icon { get; set; }
        public decimal? BasePrice { get; set; }
        public decimal? PricePerKm { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string[]? Features { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsFeatured { get; set; }
        public int? Order { get; set; }
    }
}