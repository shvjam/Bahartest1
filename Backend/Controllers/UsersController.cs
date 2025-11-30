using Microsoft.AspNetCore.Mvc;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UsersController> _logger;

        public UsersController(AppDbContext context, ILogger<UsersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/users
        [HttpGet]
        public async Task<IActionResult> GetUsers(
            [FromQuery] string? role = null,
            [FromQuery] string? search = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var query = _context.Users.AsQueryable();

                // فیلتر بر اساس نقش
                if (!string.IsNullOrEmpty(role) && Enum.TryParse<UserRole>(role, out var userRole))
                {
                    query = query.Where(u => u.Role == userRole);
                }

                // جستجو
                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(u => 
                        u.PhoneNumber.Contains(search) ||
                        (u.FullName != null && u.FullName.Contains(search)) ||
                        (u.Email != null && u.Email.Contains(search))
                    );
                }

                var totalCount = await query.CountAsync();

                var users = await query
                    .OrderByDescending(u => u.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(u => new
                    {
                        u.Id,
                        u.PhoneNumber,
                        u.FullName,
                        u.Email,
                        u.Role,
                        u.IsActive,
                        u.CreatedAt,
                        u.LastLoginAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    data = users,
                    pagination = new
                    {
                        page,
                        pageSize,
                        totalCount,
                        totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting users");
                return StatusCode(500, new { message = "خطا در دریافت لیست کاربران" });
            }
        }

        // GET: api/users/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Driver)
                    .Include(u => u.Orders)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(new { message = "کاربر یافت نشد" });
                }

                return Ok(new
                {
                    id = user.Id,
                    phoneNumber = user.PhoneNumber,
                    fullName = user.FullName,
                    email = user.Email,
                    role = user.Role.ToString(),
                    isActive = user.IsActive,
                    createdAt = user.CreatedAt,
                    lastLoginAt = user.LastLoginAt,
                    driver = user.Driver != null ? new
                    {
                        id = user.Driver.Id,
                        licensePlate = user.Driver.LicensePlate,
                        vehicleType = user.Driver.VehicleType.ToString(),
                        rating = user.Driver.Rating,
                        totalRides = user.Driver.TotalRides,
                        isAvailable = user.Driver.IsAvailable
                    } : null,
                    stats = new
                    {
                        totalOrders = user.Orders.Count,
                        completedOrders = user.Orders.Count(o => o.Status == OrderStatus.COMPLETED),
                        cancelledOrders = user.Orders.Count(o => o.Status == OrderStatus.CANCELLED)
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user {UserId}", id);
                return StatusCode(500, new { message = "خطا در دریافت اطلاعات کاربر" });
            }
        }

        // POST: api/users
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
        {
            try
            {
                // بررسی تکراری بودن شماره تلفن
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.PhoneNumber == request.PhoneNumber);

                if (existingUser != null)
                {
                    return Conflict(new { message = "کاربری با این شماره تلفن قبلاً ثبت شده است" });
                }

                var user = new User
                {
                    Id = Guid.NewGuid(),
                    PhoneNumber = request.PhoneNumber,
                    FullName = request.FullName,
                    Email = request.Email,
                    Role = request.Role,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetUser),
                    new { id = user.Id },
                    new
                    {
                        id = user.Id,
                        phoneNumber = user.PhoneNumber,
                        fullName = user.FullName,
                        email = user.Email,
                        role = user.Role.ToString(),
                        message = "کاربر با موفقیت ایجاد شد"
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user");
                return StatusCode(500, new { message = "خطا در ایجاد کاربر" });
            }
        }

        // PUT: api/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound(new { message = "کاربر یافت نشد" });
                }

                // به‌روزرسانی فیلدها
                if (!string.IsNullOrWhiteSpace(request.FullName))
                    user.FullName = request.FullName;

                if (!string.IsNullOrWhiteSpace(request.Email))
                    user.Email = request.Email;

                if (request.Role.HasValue)
                    user.Role = request.Role.Value;

                if (request.IsActive.HasValue)
                    user.IsActive = request.IsActive.Value;

                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    id = user.Id,
                    phoneNumber = user.PhoneNumber,
                    fullName = user.FullName,
                    email = user.Email,
                    role = user.Role.ToString(),
                    isActive = user.IsActive,
                    message = "اطلاعات کاربر به‌روزرسانی شد"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {UserId}", id);
                return StatusCode(500, new { message = "خطا در به‌روزرسانی کاربر" });
            }
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound(new { message = "کاربر یافت نشد" });
                }

                // Soft Delete
                user.IsActive = false;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "کاربر با موفقیت غیرفعال شد" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {UserId}", id);
                return StatusCode(500, new { message = "خطا در حذف کاربر" });
            }
        }

        // GET: api/users/{id}/orders
        [HttpGet("{id}/orders")]
        public async Task<IActionResult> GetUserOrders(Guid id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound(new { message = "کاربر یافت نشد" });
                }

                var orders = await _context.Orders
                    .Where(o => o.UserId == id)
                    .Include(o => o.Service)
                    .OrderByDescending(o => o.CreatedAt)
                    .Select(o => new
                    {
                        o.Id,
                        o.OrderNumber,
                        serviceName = o.Service.Name,
                        o.Status,
                        o.TotalPrice,
                        o.ScheduledDate,
                        o.CreatedAt
                    })
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user orders {UserId}", id);
                return StatusCode(500, new { message = "خطا در دریافت سفارش‌های کاربر" });
            }
        }
    }

    // Request DTOs
    public class CreateUserRequest
    {
        public string PhoneNumber { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public UserRole Role { get; set; } = UserRole.CUSTOMER;
    }

    public class UpdateUserRequest
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public UserRole? Role { get; set; }
        public bool? IsActive { get; set; }
    }
}
