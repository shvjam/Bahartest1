using BarbariBahar.API.Services.Interfaces;

namespace BarbariBahar.API.Services
{
    public class DriverService : IDriverService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DriverService> _logger;
        private readonly INotificationService _notificationService;

        public DriverService(
            AppDbContext context, 
            ILogger<DriverService> logger,
            INotificationService notificationService)
        {
            _context = context;
            _logger = logger;
            _notificationService = notificationService;
        }

        public async Task<(bool Success, Driver? Driver, string? Message)> CreateDriverAsync(CreateDriverDto dto)
        {
            try
            {
                // بررسی وجود کاربر
                var user = await _context.Users.FindAsync(dto.UserId);
                if (user == null)
                {
                    return (false, null, "کاربر یافت نشد");
                }

                // بررسی تکراری بودن
                var existingDriver = await _context.Drivers
                    .FirstOrDefaultAsync(d => d.UserId == dto.UserId);

                if (existingDriver != null)
                {
                    return (false, null, "این کاربر قبلاً به عنوان راننده ثبت شده است");
                }

                // بررسی تکراری بودن پلاک
                var existingPlate = await _context.Drivers
                    .FirstOrDefaultAsync(d => d.LicensePlate == dto.LicensePlate);

                if (existingPlate != null)
                {
                    return (false, null, "این پلاک قبلاً ثبت شده است");
                }

                var driver = new Driver
                {
                    Id = Guid.NewGuid(),
                    UserId = dto.UserId,
                    LicensePlate = dto.LicensePlate,
                    VehicleType = dto.VehicleType,
                    VehicleModel = dto.VehicleModel,
                    VehicleColor = dto.VehicleColor,
                    VehicleYear = dto.VehicleYear,
                    AvailableWorkers = dto.AvailableWorkers,
                    DocumentsVerified = false,
                    Rating = 0,
                    TotalRides = 0,
                    CompletedRides = 0,
                    CancelledRides = 0,
                    TotalEarnings = 0,
                    IsActive = true,
                    IsAvailable = false, // تا زمانی که مدارک تایید نشده، در دسترس نیست
                    CreatedAt = DateTime.UtcNow
                };

                // تغییر نقش کاربر به راننده
                user.Role = UserRole.DRIVER;

                await _context.Drivers.AddAsync(driver);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Driver created for user {UserId} with license plate {LicensePlate}", 
                    dto.UserId, dto.LicensePlate);

                return (true, driver, "راننده با موفقیت ایجاد شد");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating driver for user {UserId}", dto.UserId);
                return (false, null, "خطا در ایجاد راننده");
            }
        }

        public async Task<(bool Success, string? Message)> UpdateDriverAsync(Guid driverId, UpdateDriverDto dto)
        {
            try
            {
                var driver = await _context.Drivers.FindAsync(driverId);

                if (driver == null)
                {
                    return (false, "راننده یافت نشد");
                }

                // به‌روزرسانی فیلدها
                if (!string.IsNullOrWhiteSpace(dto.LicensePlate))
                {
                    // بررسی تکراری نبودن پلاک
                    var existingPlate = await _context.Drivers
                        .FirstOrDefaultAsync(d => d.LicensePlate == dto.LicensePlate && d.Id != driverId);

                    if (existingPlate != null)
                    {
                        return (false, "این پلاک قبلاً ثبت شده است");
                    }

                    driver.LicensePlate = dto.LicensePlate;
                }

                if (dto.VehicleType.HasValue)
                    driver.VehicleType = dto.VehicleType.Value;

                if (!string.IsNullOrWhiteSpace(dto.VehicleModel))
                    driver.VehicleModel = dto.VehicleModel;

                if (!string.IsNullOrWhiteSpace(dto.VehicleColor))
                    driver.VehicleColor = dto.VehicleColor;

                if (dto.VehicleYear.HasValue)
                    driver.VehicleYear = dto.VehicleYear.Value;

                if (dto.AvailableWorkers.HasValue)
                    driver.AvailableWorkers = dto.AvailableWorkers.Value;

                if (dto.IsAvailable.HasValue && driver.DocumentsVerified)
                {
                    driver.IsAvailable = dto.IsAvailable.Value;
                }

                driver.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Driver {DriverId} updated successfully", driverId);

                return (true, "اطلاعات راننده به‌روزرسانی شد");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating driver {DriverId}", driverId);
                return (false, "خطا در به‌روزرسانی راننده");
            }
        }

        public async Task<(bool Success, string? Message)> VerifyDriverAsync(Guid driverId)
        {
            try
            {
                var driver = await _context.Drivers.FindAsync(driverId);

                if (driver == null)
                {
                    return (false, "راننده یافت نشد");
                }

                driver.DocumentsVerified = true;
                driver.VerifiedAt = DateTime.UtcNow;
                driver.IsAvailable = true; // بعد از تایید، راننده در دسترس می‌شود
                driver.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // ارسال نوتیفیکیشن
                await _notificationService.CreateNotificationAsync(
                    driver.UserId,
                    NotificationType.DRIVER_APPROVED,
                    "تایید راننده",
                    "مدارک شما تایید شد و حساب کاربری‌تان فعال است"
                );

                _logger.LogInformation("Driver {DriverId} verified successfully", driverId);

                return (true, "راننده با موفقیت تایید شد");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying driver {DriverId}", driverId);
                return (false, "خطا در تایید راننده");
            }
        }

        public async Task<(bool Success, string? Message)> ToggleAvailabilityAsync(Guid driverId)
        {
            try
            {
                var driver = await _context.Drivers.FindAsync(driverId);

                if (driver == null)
                {
                    return (false, "راننده یافت نشد");
                }

                if (!driver.DocumentsVerified)
                {
                    return (false, "مدارک راننده هنوز تایید نشده است");
                }

                driver.IsAvailable = !driver.IsAvailable;
                driver.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var message = driver.IsAvailable ? "راننده در دسترس شد" : "راننده غیرقابل دسترس شد";
                
                _logger.LogInformation("Driver {DriverId} availability toggled to {IsAvailable}", 
                    driverId, driver.IsAvailable);

                return (true, message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling driver availability {DriverId}", driverId);
                return (false, "خطا در تغییر وضعیت");
            }
        }

        public async Task<Driver?> GetDriverByIdAsync(Guid driverId)
        {
            return await _context.Drivers
                .Include(d => d.User)
                .Include(d => d.Orders)
                .FirstOrDefaultAsync(d => d.Id == driverId);
        }

        public async Task<Driver?> GetDriverByUserIdAsync(Guid userId)
        {
            return await _context.Drivers
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.UserId == userId);
        }

        public async Task<List<Driver>> GetAvailableDriversAsync(VehicleType? vehicleType = null)
        {
            var query = _context.Drivers
                .Include(d => d.User)
                .Where(d => d.IsActive && d.IsAvailable && d.DocumentsVerified);

            if (vehicleType.HasValue)
            {
                query = query.Where(d => d.VehicleType == vehicleType.Value);
            }

            return await query
                .OrderByDescending(d => d.Rating)
                .ThenByDescending(d => d.CompletedRides)
                .ToListAsync();
        }

        public async Task<List<Driver>> GetAllDriversAsync(bool? isActive = null)
        {
            var query = _context.Drivers
                .Include(d => d.User)
                .AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(d => d.IsActive == isActive.Value);
            }

            return await query
                .OrderByDescending(d => d.Rating)
                .ThenByDescending(d => d.CreatedAt)
                .ToListAsync();
        }

        public async Task<DriverStats?> GetDriverStatsAsync(Guid driverId)
        {
            var driver = await _context.Drivers
                .Include(d => d.Orders)
                .FirstOrDefaultAsync(d => d.Id == driverId);

            if (driver == null)
                return null;

            var ratings = await _context.OrderRatings
                .Include(r => r.Order)
                .Where(r => r.Order.DriverId == driverId && r.DriverRating.HasValue)
                .ToListAsync();

            var today = DateTime.UtcNow.Date;
            var thisMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);

            var todayOrders = driver.Orders.Where(o => o.CreatedAt.Date == today).ToList();
            var thisMonthOrders = driver.Orders.Where(o => o.CreatedAt >= thisMonth).ToList();

            return new DriverStats
            {
                TotalRides = driver.TotalRides,
                CompletedRides = driver.CompletedRides,
                CancelledRides = driver.CancelledRides,
                TotalEarnings = driver.TotalEarnings,
                AverageRating = ratings.Any() ? (decimal)ratings.Average(r => (double)r.DriverRating!.Value) : 0,
                TotalReviews = ratings.Count,
                TodayRides = todayOrders.Count,
                TodayEarnings = todayOrders.Where(o => o.Status == OrderStatus.COMPLETED).Sum(o => o.TotalPrice),
                ThisMonthRides = thisMonthOrders.Count,
                ThisMonthEarnings = thisMonthOrders.Where(o => o.Status == OrderStatus.COMPLETED).Sum(o => o.TotalPrice)
            };
        }
    }
}
