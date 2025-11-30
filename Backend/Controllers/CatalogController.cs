using Microsoft.AspNetCore.Mvc;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CatalogController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CatalogController> _logger;

        public CatalogController(AppDbContext context, ILogger<CatalogController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/catalog/categories
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories([FromQuery] bool? isActive = null)
        {
            try
            {
                var query = _context.CatalogCategories
                    .Include(c => c.Items.Where(i => i.IsActive))
                    .AsQueryable();

                if (isActive.HasValue)
                {
                    query = query.Where(c => c.IsActive == isActive.Value);
                }

                var categories = await query
                    .OrderBy(c => c.Order)
                    .Select(c => new
                    {
                        c.Id,
                        c.Name,
                        c.Slug,
                        c.Description,
                        c.Icon,
                        c.Order,
                        c.IsActive,
                        itemsCount = c.Items.Count
                    })
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting catalog categories");
                return StatusCode(500, new { message = "خطا در دریافت دسته‌بندی‌ها" });
            }
        }

        // GET: api/catalog/categories/{id}
        [HttpGet("categories/{id}")]
        public async Task<IActionResult> GetCategory(Guid id)
        {
            try
            {
                var category = await _context.CatalogCategories
                    .Include(c => c.Items.Where(i => i.IsActive))
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (category == null)
                {
                    return NotFound(new { message = "دسته‌بندی یافت نشد" });
                }

                return Ok(new
                {
                    id = category.Id,
                    name = category.Name,
                    slug = category.Slug,
                    description = category.Description,
                    icon = category.Icon,
                    order = category.Order,
                    isActive = category.IsActive,
                    items = category.Items.Select(i => new
                    {
                        i.Id,
                        i.Name,
                        i.Description,
                        i.BasePrice,
                        i.Unit,
                        i.IsHeavy,
                        i.RequiresSpecialHandling,
                        i.Order
                    })
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting catalog category {CategoryId}", id);
                return StatusCode(500, new { message = "خطا در دریافت دسته‌بندی" });
            }
        }

        // GET: api/catalog/items
        [HttpGet("items")]
        public async Task<IActionResult> GetItems(
            [FromQuery] Guid? categoryId = null,
            [FromQuery] bool? isHeavy = null,
            [FromQuery] string? search = null)
        {
            try
            {
                var query = _context.CatalogItems
                    .Include(i => i.Category)
                    .Where(i => i.IsActive)
                    .AsQueryable();

                if (categoryId.HasValue)
                {
                    query = query.Where(i => i.CategoryId == categoryId.Value);
                }

                if (isHeavy.HasValue)
                {
                    query = query.Where(i => i.IsHeavy == isHeavy.Value);
                }

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(i => 
                        i.Name.Contains(search) || 
                        (i.Description != null && i.Description.Contains(search))
                    );
                }

                var items = await query
                    .OrderBy(i => i.Order)
                    .Select(i => new
                    {
                        i.Id,
                        i.CategoryId,
                        categoryName = i.Category.Name,
                        i.Name,
                        i.Description,
                        i.BasePrice,
                        i.Unit,
                        i.IsHeavy,
                        i.RequiresSpecialHandling,
                        i.Order
                    })
                    .ToListAsync();

                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting catalog items");
                return StatusCode(500, new { message = "خطا در دریافت آیتم‌ها" });
            }
        }

        // GET: api/catalog/items/{id}
        [HttpGet("items/{id}")]
        public async Task<IActionResult> GetItem(Guid id)
        {
            try
            {
                var item = await _context.CatalogItems
                    .Include(i => i.Category)
                    .FirstOrDefaultAsync(i => i.Id == id);

                if (item == null)
                {
                    return NotFound(new { message = "آیتم یافت نشد" });
                }

                return Ok(new
                {
                    id = item.Id,
                    categoryId = item.CategoryId,
                    categoryName = item.Category.Name,
                    name = item.Name,
                    description = item.Description,
                    basePrice = item.BasePrice,
                    unit = item.Unit,
                    isHeavy = item.IsHeavy,
                    requiresSpecialHandling = item.RequiresSpecialHandling,
                    order = item.Order,
                    isActive = item.IsActive
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting catalog item {ItemId}", id);
                return StatusCode(500, new { message = "خطا در دریافت آیتم" });
            }
        }

        // POST: api/catalog/categories
        [HttpPost("categories")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request)
        {
            try
            {
                var existingCategory = await _context.CatalogCategories
                    .FirstOrDefaultAsync(c => c.Slug == request.Slug);

                if (existingCategory != null)
                {
                    return Conflict(new { message = "این Slug قبلاً استفاده شده است" });
                }

                var category = new CatalogCategory
                {
                    Id = Guid.NewGuid(),
                    Name = request.Name,
                    Slug = request.Slug,
                    Description = request.Description,
                    Icon = request.Icon,
                    Order = request.Order ?? 999,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.CatalogCategories.AddAsync(category);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetCategory),
                    new { id = category.Id },
                    new
                    {
                        id = category.Id,
                        name = category.Name,
                        slug = category.Slug,
                        message = "دسته‌بندی با موفقیت ایجاد شد"
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating catalog category");
                return StatusCode(500, new { message = "خطا در ایجاد دسته‌بندی" });
            }
        }

        // POST: api/catalog/items
        [HttpPost("items")]
        public async Task<IActionResult> CreateItem([FromBody] CreateCatalogItemRequest request)
        {
            try
            {
                var category = await _context.CatalogCategories.FindAsync(request.CategoryId);
                if (category == null)
                {
                    return NotFound(new { message = "دسته‌بندی یافت نشد" });
                }

                var item = new CatalogItem
                {
                    Id = Guid.NewGuid(),
                    CategoryId = request.CategoryId,
                    Name = request.Name,
                    Description = request.Description,
                    BasePrice = request.BasePrice,
                    Unit = request.Unit,
                    IsHeavy = request.IsHeavy,
                    RequiresSpecialHandling = request.RequiresSpecialHandling,
                    Order = request.Order ?? 999,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.CatalogItems.AddAsync(item);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetItem),
                    new { id = item.Id },
                    new
                    {
                        id = item.Id,
                        name = item.Name,
                        message = "آیتم با موفقیت ایجاد شد"
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating catalog item");
                return StatusCode(500, new { message = "خطا در ایجاد آیتم" });
            }
        }

        // PUT: api/catalog/categories/{id}
        [HttpPut("categories/{id}")]
        public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] UpdateCategoryRequest request)
        {
            try
            {
                var category = await _context.CatalogCategories.FindAsync(id);

                if (category == null)
                {
                    return NotFound(new { message = "دسته‌بندی یافت نشد" });
                }

                if (!string.IsNullOrWhiteSpace(request.Name))
                    category.Name = request.Name;

                if (!string.IsNullOrWhiteSpace(request.Description))
                    category.Description = request.Description;

                if (!string.IsNullOrWhiteSpace(request.Icon))
                    category.Icon = request.Icon;

                if (request.Order.HasValue)
                    category.Order = request.Order.Value;

                if (request.IsActive.HasValue)
                    category.IsActive = request.IsActive.Value;

                category.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    id = category.Id,
                    name = category.Name,
                    message = "دسته‌بندی به‌روزرسانی شد"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating catalog category {CategoryId}", id);
                return StatusCode(500, new { message = "خطا در به‌روزرسانی دسته‌بندی" });
            }
        }

        // PUT: api/catalog/items/{id}
        [HttpPut("items/{id}")]
        public async Task<IActionResult> UpdateItem(Guid id, [FromBody] UpdateCatalogItemRequest request)
        {
            try
            {
                var item = await _context.CatalogItems.FindAsync(id);

                if (item == null)
                {
                    return NotFound(new { message = "آیتم یافت نشد" });
                }

                if (!string.IsNullOrWhiteSpace(request.Name))
                    item.Name = request.Name;

                if (!string.IsNullOrWhiteSpace(request.Description))
                    item.Description = request.Description;

                if (request.BasePrice.HasValue)
                    item.BasePrice = request.BasePrice.Value;

                if (!string.IsNullOrWhiteSpace(request.Unit))
                    item.Unit = request.Unit;

                if (request.IsHeavy.HasValue)
                    item.IsHeavy = request.IsHeavy.Value;

                if (request.RequiresSpecialHandling.HasValue)
                    item.RequiresSpecialHandling = request.RequiresSpecialHandling.Value;

                if (request.Order.HasValue)
                    item.Order = request.Order.Value;

                if (request.IsActive.HasValue)
                    item.IsActive = request.IsActive.Value;

                item.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    id = item.Id,
                    name = item.Name,
                    message = "آیتم به‌روزرسانی شد"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating catalog item {ItemId}", id);
                return StatusCode(500, new { message = "خطا در به‌روزرسانی آیتم" });
            }
        }

        // DELETE: api/catalog/categories/{id}
        [HttpDelete("categories/{id}")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            try
            {
                var category = await _context.CatalogCategories.FindAsync(id);

                if (category == null)
                {
                    return NotFound(new { message = "دسته‌بندی یافت نشد" });
                }

                category.IsActive = false;
                category.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "دسته‌بندی با موفقیت غیرفعال شد" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting catalog category {CategoryId}", id);
                return StatusCode(500, new { message = "خطا در حذف دسته‌بندی" });
            }
        }

        // DELETE: api/catalog/items/{id}
        [HttpDelete("items/{id}")]
        public async Task<IActionResult> DeleteItem(Guid id)
        {
            try
            {
                var item = await _context.CatalogItems.FindAsync(id);

                if (item == null)
                {
                    return NotFound(new { message = "آیتم یافت نشد" });
                }

                item.IsActive = false;
                item.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "آیتم با موفقیت غیرفعال شد" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting catalog item {ItemId}", id);
                return StatusCode(500, new { message = "خطا در حذف آیتم" });
            }
        }
    }

    // Request DTOs
    public class CreateCategoryRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Icon { get; set; }
        public int? Order { get; set; }
    }

    public class UpdateCategoryRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Icon { get; set; }
        public int? Order { get; set; }
        public bool? IsActive { get; set; }
    }

    public class CreateCatalogItemRequest
    {
        public Guid CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal BasePrice { get; set; }
        public string Unit { get; set; } = "عدد";
        public bool IsHeavy { get; set; }
        public bool RequiresSpecialHandling { get; set; }
        public int? Order { get; set; }
    }

    public class UpdateCatalogItemRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? BasePrice { get; set; }
        public string? Unit { get; set; }
        public bool? IsHeavy { get; set; }
        public bool? RequiresSpecialHandling { get; set; }
        public int? Order { get; set; }
        public bool? IsActive { get; set; }
    }
}
