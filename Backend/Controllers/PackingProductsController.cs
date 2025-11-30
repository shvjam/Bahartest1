using Microsoft.AspNetCore.Mvc;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackingProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<PackingProductsController> _logger;

        public PackingProductsController(AppDbContext context, ILogger<PackingProductsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/packingproducts
        [HttpGet]
        public async Task<IActionResult> GetPackingProducts(
            [FromQuery] string? category = null,
            [FromQuery] bool? isActive = null)
        {
            try
            {
                var query = _context.PackingProducts.AsQueryable();

                if (!string.IsNullOrEmpty(category))
                {
                    query = query.Where(p => p.Category == category);
                }

                if (isActive.HasValue)
                {
                    query = query.Where(p => p.IsActive == isActive.Value);
                }

                var products = await query
                    .OrderBy(p => p.Category)
                    .ThenBy(p => p.Name)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Description,
                        p.Price,
                        p.Unit,
                        p.Stock,
                        p.Category,
                        p.ImageUrl,
                        p.IsActive
                    })
                    .ToListAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting packing products");
                return StatusCode(500, new { message = "خطا در دریافت محصولات بسته‌بندی" });
            }
        }

        // GET: api/packingproducts/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPackingProduct(Guid id)
        {
            try
            {
                var product = await _context.PackingProducts.FindAsync(id);

                if (product == null)
                {
                    return NotFound(new { message = "محصول یافت نشد" });
                }

                return Ok(new
                {
                    id = product.Id,
                    name = product.Name,
                    description = product.Description,
                    price = product.Price,
                    unit = product.Unit,
                    stock = product.Stock,
                    category = product.Category,
                    imageUrl = product.ImageUrl,
                    isActive = product.IsActive,
                    createdAt = product.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting packing product {ProductId}", id);
                return StatusCode(500, new { message = "خطا در دریافت محصول" });
            }
        }

        // GET: api/packingproducts/categories
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categories = await _context.PackingProducts
                    .Where(p => p.IsActive)
                    .Select(p => p.Category)
                    .Distinct()
                    .OrderBy(c => c)
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting packing product categories");
                return StatusCode(500, new { message = "خطا در دریافت دسته‌بندی‌ها" });
            }
        }

        // POST: api/packingproducts
        [HttpPost]
        public async Task<IActionResult> CreatePackingProduct([FromBody] CreatePackingProductRequest request)
        {
            try
            {
                var product = new PackingProduct
                {
                    Id = Guid.NewGuid(),
                    Name = request.Name,
                    Description = request.Description,
                    Price = request.Price,
                    Unit = request.Unit,
                    Stock = request.Stock ?? 0,
                    Category = request.Category,
                    ImageUrl = request.ImageUrl,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.PackingProducts.AddAsync(product);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetPackingProduct),
                    new { id = product.Id },
                    new
                    {
                        id = product.Id,
                        name = product.Name,
                        message = "محصول با موفقیت ایجاد شد"
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating packing product");
                return StatusCode(500, new { message = "خطا در ایجاد محصول" });
            }
        }

        // PUT: api/packingproducts/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePackingProduct(Guid id, [FromBody] UpdatePackingProductRequest request)
        {
            try
            {
                var product = await _context.PackingProducts.FindAsync(id);

                if (product == null)
                {
                    return NotFound(new { message = "محصول یافت نشد" });
                }

                if (!string.IsNullOrWhiteSpace(request.Name))
                    product.Name = request.Name;

                if (!string.IsNullOrWhiteSpace(request.Description))
                    product.Description = request.Description;

                if (request.Price.HasValue)
                    product.Price = request.Price.Value;

                if (!string.IsNullOrWhiteSpace(request.Unit))
                    product.Unit = request.Unit;

                if (request.Stock.HasValue)
                    product.Stock = request.Stock.Value;

                if (!string.IsNullOrWhiteSpace(request.Category))
                    product.Category = request.Category;

                if (!string.IsNullOrWhiteSpace(request.ImageUrl))
                    product.ImageUrl = request.ImageUrl;

                if (request.IsActive.HasValue)
                    product.IsActive = request.IsActive.Value;

                product.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    id = product.Id,
                    name = product.Name,
                    message = "محصول به‌روزرسانی شد"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating packing product {ProductId}", id);
                return StatusCode(500, new { message = "خطا در به‌روزرسانی محصول" });
            }
        }

        // PUT: api/packingproducts/{id}/stock
        [HttpPut("{id}/stock")]
        public async Task<IActionResult> UpdateStock(Guid id, [FromBody] UpdateStockRequest request)
        {
            try
            {
                var product = await _context.PackingProducts.FindAsync(id);

                if (product == null)
                {
                    return NotFound(new { message = "محصول یافت نشد" });
                }

                product.Stock = request.Stock;
                product.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    id = product.Id,
                    name = product.Name,
                    stock = product.Stock,
                    message = "موجودی به‌روزرسانی شد"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating stock for product {ProductId}", id);
                return StatusCode(500, new { message = "خطا در به‌روزرسانی موجودی" });
            }
        }

        // DELETE: api/packingproducts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePackingProduct(Guid id)
        {
            try
            {
                var product = await _context.PackingProducts.FindAsync(id);

                if (product == null)
                {
                    return NotFound(new { message = "محصول یافت نشد" });
                }

                product.IsActive = false;
                product.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "محصول با موفقیت غیرفعال شد" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting packing product {ProductId}", id);
                return StatusCode(500, new { message = "خطا در حذف محصول" });
            }
        }
    }

    // Request DTOs
    public class CreatePackingProductRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string Unit { get; set; } = "عدد";
        public int? Stock { get; set; }
        public string Category { get; set; } = "متفرقه";
        public string? ImageUrl { get; set; }
    }

    public class UpdatePackingProductRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public string? Unit { get; set; }
        public int? Stock { get; set; }
        public string? Category { get; set; }
        public string? ImageUrl { get; set; }
        public bool? IsActive { get; set; }
    }

    public class UpdateStockRequest
    {
        public int Stock { get; set; }
    }
}
