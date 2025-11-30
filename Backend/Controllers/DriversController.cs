using Microsoft.AspNetCore.Mvc;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DriversController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DriversController> _logger;

        public DriversController(AppDbContext context, ILogger<DriversController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/drivers
        [HttpGet]
        public async Task<IActionResult> GetDrivers(
            [FromQuery] bool? isAvailable = null,
            [FromQuery] string? vehicleType = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var query = _context.Drivers
                    .Include(d => d.User)
                    .Where(d => d.IsActive)
                    .AsQueryable();

                // فیلتر در دسترس بودن
                if (isAvailable.HasValue)
                {
                    query = query.Where(d => d.IsAvailable == isAvailable.Value);
                }

                // فیلتر نوع خودرو
                if (!string.IsNullOrEmpty(vehicleType) && Enum.TryParse<VehicleType>(vehicleType, out var vType))
                {
                    query = query.Where(d => d.VehicleType == vType);
                }

                var totalCount = await query.CountAsync();

                var drivers = await query
                    .OrderByDescending(d => d.Rating)
                    .ThenByDescending(d => d.CompletedRides)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(d => new
                    {
                        d.Id,
                        d.UserId,
                        name = d.User.FullName,
                        phone = d.User.PhoneNumber,
                        d.LicensePlate,
                        vehicleType = d.VehicleType.ToString(),
                        d.VehicleModel,
                        d.VehicleColor,
                        d.VehicleYear,
                        d.AvailableWorkers,
                        d.Rating,
                        d.TotalRides,
                        d.CompletedRides,
                        d.CancelledRides,
                        d.IsAvailable,
                        d.DocumentsVerified,
                        d.CreatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    data = drivers,
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
                _logger.LogError(ex, "Error getting drivers");
                return StatusCode(500, new { message = "خطا در دریافت لیست راننده‌ها" });
            }
        }

        // GET: api/drivers/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDriver(Guid id)
        {
            try
            {
                var driver = await _context.Drivers
                    .Include(d => d.User)
                    .Include(d => d.Orders)
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (driver == null)
                {
                    return NotFound(new { message = "راننده یافت نشد" });
                }

                var completedOrders = driver.Orders.Where(o => o.Status == OrderStatus.COMPLETED).ToList();
                var ratings = await _context.OrderRatings
                    .Include(r => r.Order)
                    .Where(r => r.Order.DriverId == driver.Id)
                    .ToListAsync();

                return Ok(new
                {
                    id = driver.Id,
                    userId = driver.UserId,
                    name = driver.User.FullName,
                    phone = driver.User.PhoneNumber,
                    email = driver.User.Email,
                    licensePlate = driver.LicensePlate,
                    vehicleType = driver.VehicleType.ToString(),
                    vehicleModel = driver.VehicleModel,
                    vehicleColor = driver.VehicleColor,
                    vehicleYear = driver.VehicleYear,
                    availableWorkers = driver.AvailableWorkers,
                    documentsVerified = driver.DocumentsVerified,
                    verifiedAt = driver.VerifiedAt,
                    rating = driver.Rating,
                    stats = new
                    {
                        totalRides = driver.TotalRides,
                        completedRides = driver.CompletedRides,
                        cancelledRides = driver.CancelledRides,
                        totalEarnings = driver.TotalEarnings,
                        averageRating = ratings.Any() ? ratings.Average(r => r.DriverRating ?? 0) : 0,
                        totalReviews = ratings.Count
                    },
                    isAvailable = driver.IsAvailable,
                    isActive = driver.IsActive,
                    createdAt = driver.CreatedAt,
                    recentOrders = driver.Orders
                        .OrderByDescending(o => o.CreatedAt)
                        .Take(5)
                        .Select(o => new
                        {
                            o.Id,
                            o.OrderNumber,
                            status = o.Status.ToString(),
                            o.TotalPrice,
                            o.CreatedAt
                        })
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting driver {DriverId}", id);
                return StatusCode(500, new { message = "خطا در دریافت اطلاعات راننده" });
            }
        }

        // POST: api/drivers
        [HttpPost]
        public async Task<IActionResult> CreateDriver([FromBody] CreateDriverRequest request)
        {
            try
            {
                // بررسی وجود کاربر
                var user = await _context.Users.FindAsync(request.UserId);
                if (user == null)
                {
                    return NotFound(new { message = "کاربر یافت نشد" });
                }

                // بررسی تکراری بودن
                var existingDriver = await _context.Drivers
                    .FirstOrDefaultAsync(d => d.UserId == request.UserId);

                if (existingDriver != null)
                {
                    return Conflict(new { message = "این کاربر قبلاً به عنوان راننده ثبت شده است" });
                }

                // بررسی تکراری بودن پلاک
                var existingPlate = await _context.Drivers
                    .FirstOrDefaultAsync(d => d.LicensePlate == request.LicensePlate);

                if (existingPlate != null)
                {
                    return Conflict(new { message = "این پلاک قبلاً ثبت شده است" });
                }

                var driver = new Driver
                {
                    Id = Guid.NewGuid(),
                    UserId = request.UserId,
                    LicensePlate = request.LicensePlate,
                    VehicleType = request.VehicleType,
                    VehicleModel = request.VehicleModel,
                    VehicleColor = request.VehicleColor,
                    VehicleYear = request.VehicleYear,
                    AvailableWorkers = request.AvailableWorkers,
                    DocumentsVerified = false,
                    Rating = 0,
                    TotalRides = 0,
                    CompletedRides = 0,
                    CancelledRides = 0,
                    TotalEarnings = 0,
                    IsActive = true,
                    IsAvailable = true,
                    CreatedAt = DateTime.UtcNow
                };

                // تغییر نقش کاربر به راننده
                user.Role = UserRole.DRIVER;

                await _context.Drivers.AddAsync(driver);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetDriver),
                    new { id = driver.Id },
                    new
                    {
                        id = driver.Id,
                        userId = driver.UserId,
                        licensePlate = driver.LicensePlate,
                        vehicleType = driver.VehicleType.ToString(),
                        message = "راننده با موفقیت ایجاد شد"
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating driver");
                return StatusCode(500, new { message = "خطا در ایجاد راننده" });
            }
        }

        // PUT: api/drivers/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDriver(Guid id, [FromBody] UpdateDriverRequest request)
        {
            try
            {
                var driver = await _context.Drivers.FindAsync(id);

                if (driver == null)
                {
                    return NotFound(new { message = "راننده یافت نشد" });
                }

                // به‌روزرسانی فیلدها
                if (!string.IsNullOrWhiteSpace(request.LicensePlate))
                    driver.LicensePlate = request.LicensePlate;

                if (request.VehicleType.HasValue)
                    driver.VehicleType = request.VehicleType.Value;

                if (!string.IsNullOrWhiteSpace(request.VehicleModel))
                    driver.VehicleModel = request.VehicleModel;

                if (!string.IsNullOrWhiteSpace(request.VehicleColor))
                    driver.VehicleColor = request.VehicleColor;

                if (request.VehicleYear.HasValue)
                    driver.VehicleYear = request.VehicleYear.Value;

                if (request.AvailableWorkers.HasValue)
                    driver.AvailableWorkers = request.AvailableWorkers.Value;

                if (request.IsAvailable.HasValue)
                    driver.IsAvailable = request.IsAvailable.Value;

                driver.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    id = driver.Id,
                    licensePlate = driver.LicensePlate,
                    vehicleType = driver.VehicleType.ToString(),
                    isAvailable = driver.IsAvailable,
                    message = "اطلاعات راننده به‌روزرسانی شد"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating driver {DriverId}", id);
                return StatusCode(500, new { message = "خطا در به‌روزرسانی راننده" });
            }
        }

        // PUT: api/drivers/{id}/verify
        [HttpPut("{id}/verify")]
        public async Task<IActionResult> VerifyDriver(Guid id)
        {
            try
            {
                var driver = await _context.Drivers.FindAsync(id);

                if (driver == null)
                {
                    return NotFound(new { message = "راننده یافت نشد" });
                }

                driver.DocumentsVerified = true;
                driver.VerifiedAt = DateTime.UtcNow;
                driver.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // ارسال نوتیفیکیشن
                var notification = new Notification
                {
                    Id = Guid.NewGuid(),
                    UserId = driver.UserId,
                    Type = NotificationType.DRIVER_APPROVED,
                    Title = "تایید راننده",
                    Message = "مدارک شما تایید شد و حساب کاربری‌تان فعال است",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                };
                await _context.Notifications.AddAsync(notification);
                await _context.SaveChangesAsync();

                return Ok(new { message = "راننده با موفقیت تایید شد" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying driver {DriverId}", id);
                return StatusCode(500, new { message = "خطا در تایید راننده" });
            }
        }

        // PUT: api/drivers/{id}/toggle-availability
        [HttpPut("{id}/toggle-availability")]
        public async Task<IActionResult> ToggleAvailability(Guid id)
        {
            try
            {
                var driver = await _context.Drivers.FindAsync(id);

                if (driver == null)
                {
                    return NotFound(new { message = "راننده یافت نشد" });
                }

                driver.IsAvailable = !driver.IsAvailable;
                driver.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    isAvailable = driver.IsAvailable,
                    message = driver.IsAvailable ? "راننده در دسترس شد" : "راننده غیر قابل دسترس شد"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling driver availability {DriverId}", id);
                return StatusCode(500, new { message = "خطا در تغییر وضعیت در دسترس بودن" });
            }
        }

        // GET: api/drivers/{id}/orders
        [HttpGet("{id}/orders")]
        public async Task<IActionResult> GetDriverOrders(
            Guid id,
            [FromQuery] string? status = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var driver = await _context.Drivers.FindAsync(id);
                if (driver == null)
                {
                    return NotFound(new { message = "راننده یافت نشد" });
                }

                var query = _context.Orders
                    .Where(o => o.DriverId == id)
                    .Include(o => o.User)
                    .Include(o => o.Service)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(status) && Enum.TryParse<OrderStatus>(status, out var orderStatus))
                {
                    query = query.Where(o => o.Status == orderStatus);
                }

                var totalCount = await query.CountAsync();

                var orders = await query
                    .OrderByDescending(o => o.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(o => new
                    {
                        o.Id,
                        o.OrderNumber,
                        customerName = o.User.FullName ?? o.User.PhoneNumber,
                        customerPhone = o.User.PhoneNumber,
                        serviceName = o.Service.Name,
                        status = o.Status.ToString(),
                        o.TotalPrice,
                        o.ScheduledDate,
                        o.CreatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    data = orders,
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
                _logger.LogError(ex, "Error getting driver orders {DriverId}", id);
                return StatusCode(500, new { message = "خطا در دریافت سفارش‌های راننده" });
            }
        }

        // GET: api/drivers/{id}/stats
        [HttpGet("{id}/stats")]
        public async Task<IActionResult> GetDriverStats(Guid id)
        {
            try
            {
                var driver = await _context.Drivers
                    .Include(d => d.Orders)
                    .FirstOrDefaultAsync(d => d.Id == id);

                if (driver == null)
                {
                    return NotFound(new { message = "راننده یافت نشد" });
                }

                var ratings = await _context.OrderRatings
                    .Include(r => r.Order)
                    .Where(r => r.Order.DriverId == driver.Id)
                    .ToListAsync();

                var today = DateTime.UtcNow.Date;
                var thisMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);

                return Ok(new
                {
                    overall = new
                    {
                        totalRides = driver.TotalRides,
                        completedRides = driver.CompletedRides,
                        cancelledRides = driver.CancelledRides,
                        totalEarnings = driver.TotalEarnings,
                        averageRating = driver.Rating,
                        totalReviews = ratings.Count
                    },
                    today = new
                    {
                        rides = driver.Orders.Count(o => o.CreatedAt.Date == today),
                        earnings = driver.Orders.Where(o => o.CreatedAt.Date == today && o.Status == OrderStatus.COMPLETED).Sum(o => o.TotalPrice)
                    },
                    thisMonth = new
                    {
                        rides = driver.Orders.Count(o => o.CreatedAt >= thisMonth),
                        earnings = driver.Orders.Where(o => o.CreatedAt >= thisMonth && o.Status == OrderStatus.COMPLETED).Sum(o => o.TotalPrice)
                    },
                    ratingBreakdown = new
                    {
                        five = ratings.Count(r => r.DriverRating >= 4.5m),
                        four = ratings.Count(r => r.DriverRating >= 3.5m && r.DriverRating < 4.5m),
                        three = ratings.Count(r => r.DriverRating >= 2.5m && r.DriverRating < 3.5m),
                        two = ratings.Count(r => r.DriverRating >= 1.5m && r.DriverRating < 2.5m),
                        one = ratings.Count(r => r.DriverRating < 1.5m)
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting driver stats {DriverId}", id);
                return StatusCode(500, new { message = "خطا در دریافت آمار راننده" });
            }
        }

        // DELETE: api/drivers/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDriver(Guid id)
        {
            try
            {
                var driver = await _context.Drivers.FindAsync(id);

                if (driver == null)
                {
                    return NotFound(new { message = "راننده یافت نشد" });
                }

                // Soft Delete
                driver.IsActive = false;
                driver.IsAvailable = false;
                driver.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "راننده با موفقیت غیرفعال شد" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting driver {DriverId}", id);
                return StatusCode(500, new { message = "خطا در حذف راننده" });
            }
        }
    }

    // Request DTOs
    public class CreateDriverRequest
    {
        public Guid UserId { get; set; }
        public string LicensePlate { get; set; } = string.Empty;
        public VehicleType VehicleType { get; set; }
        public string? VehicleModel { get; set; }
        public string? VehicleColor { get; set; }
        public int? VehicleYear { get; set; }
        public int AvailableWorkers { get; set; }
    }

    public class UpdateDriverRequest
    {
        public string? LicensePlate { get; set; }
        public VehicleType? VehicleType { get; set; }
        public string? VehicleModel { get; set; }
        public string? VehicleColor { get; set; }
        public int? VehicleYear { get; set; }
        public int? AvailableWorkers { get; set; }
        public bool? IsAvailable { get; set; }
    }
}
