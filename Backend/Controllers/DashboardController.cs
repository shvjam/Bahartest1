using Microsoft.AspNetCore.Mvc;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(AppDbContext context, ILogger<DashboardController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/dashboard/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                var today = DateTime.UtcNow.Date;
                var thisMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
                var lastMonth = thisMonth.AddMonths(-1);

                // آمار کلی
                var totalUsers = await _context.Users.CountAsync();
                var totalDrivers = await _context.Drivers.CountAsync(d => d.IsActive);
                var totalOrders = await _context.Orders.CountAsync();
                var totalRevenue = await _context.Orders
                    .Where(o => o.Status == OrderStatus.COMPLETED && o.IsPaid)
                    .SumAsync(o => o.TotalPrice);

                // آمار امروز
                var todayOrders = await _context.Orders
                    .CountAsync(o => o.CreatedAt.Date == today);
                var todayRevenue = await _context.Orders
                    .Where(o => o.CreatedAt.Date == today && o.Status == OrderStatus.COMPLETED && o.IsPaid)
                    .SumAsync(o => o.TotalPrice);

                // آمار ماه جاری
                var thisMonthOrders = await _context.Orders
                    .CountAsync(o => o.CreatedAt >= thisMonth);
                var thisMonthRevenue = await _context.Orders
                    .Where(o => o.CreatedAt >= thisMonth && o.Status == OrderStatus.COMPLETED && o.IsPaid)
                    .SumAsync(o => o.TotalPrice);

                // آمار ماه قبل
                var lastMonthOrders = await _context.Orders
                    .CountAsync(o => o.CreatedAt >= lastMonth && o.CreatedAt < thisMonth);
                var lastMonthRevenue = await _context.Orders
                    .Where(o => o.CreatedAt >= lastMonth && o.CreatedAt < thisMonth && o.Status == OrderStatus.COMPLETED && o.IsPaid)
                    .SumAsync(o => o.TotalPrice);

                // محاسبه رشد
                var ordersGrowth = lastMonthOrders > 0 
                    ? ((thisMonthOrders - lastMonthOrders) / (double)lastMonthOrders * 100) 
                    : 0;

                var revenueGrowth = lastMonthRevenue > 0 
                    ? ((double)(thisMonthRevenue - lastMonthRevenue) / (double)lastMonthRevenue * 100) 
                    : 0;

                // وضعیت سفارش‌ها
                var ordersByStatus = await _context.Orders
                    .GroupBy(o => o.Status)
                    .Select(g => new
                    {
                        status = g.Key.ToString(),
                        count = g.Count()
                    })
                    .ToListAsync();

                // راننده‌های فعال
                var availableDrivers = await _context.Drivers
                    .CountAsync(d => d.IsAvailable && d.IsActive);

                return Ok(new
                {
                    overview = new
                    {
                        totalUsers,
                        totalDrivers,
                        totalOrders,
                        totalRevenue,
                        availableDrivers
                    },
                    today = new
                    {
                        orders = todayOrders,
                        revenue = todayRevenue
                    },
                    thisMonth = new
                    {
                        orders = thisMonthOrders,
                        revenue = thisMonthRevenue,
                        ordersGrowth = Math.Round(ordersGrowth, 2),
                        revenueGrowth = Math.Round(revenueGrowth, 2)
                    },
                    ordersByStatus
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dashboard stats");
                return StatusCode(500, new { message = "خطا در دریافت آمار" });
            }
        }

        // GET: api/dashboard/recent-orders
        [HttpGet("recent-orders")]
        public async Task<IActionResult> GetRecentOrders([FromQuery] int count = 10)
        {
            try
            {
                var orders = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.Service)
                    .Include(o => o.Driver).ThenInclude(d => d!.User)
                    .OrderByDescending(o => o.CreatedAt)
                    .Take(count)
                    .Select(o => new
                    {
                        o.Id,
                        o.OrderNumber,
                        customerName = o.User.FullName ?? o.User.PhoneNumber,
                        serviceName = o.Service.Name,
                        driverName = o.Driver != null ? o.Driver.User.FullName : null,
                        status = o.Status.ToString(),
                        o.TotalPrice,
                        o.CreatedAt
                    })
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting recent orders");
                return StatusCode(500, new { message = "خطا در دریافت سفارش‌های اخیر" });
            }
        }

        // GET: api/dashboard/top-drivers
        [HttpGet("top-drivers")]
        public async Task<IActionResult> GetTopDrivers([FromQuery] int count = 10)
        {
            try
            {
                var drivers = await _context.Drivers
                    .Include(d => d.User)
                    .Where(d => d.IsActive)
                    .OrderByDescending(d => d.Rating)
                    .ThenByDescending(d => d.CompletedRides)
                    .Take(count)
                    .Select(d => new
                    {
                        d.Id,
                        name = d.User.FullName,
                        phone = d.User.PhoneNumber,
                        d.LicensePlate,
                        vehicleType = d.VehicleType.ToString(),
                        d.Rating,
                        d.CompletedRides,
                        d.TotalEarnings,
                        d.IsAvailable
                    })
                    .ToListAsync();

                return Ok(drivers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting top drivers");
                return StatusCode(500, new { message = "خطا در دریافت برترین راننده‌ها" });
            }
        }

        // GET: api/dashboard/revenue-chart
        [HttpGet("revenue-chart")]
        public async Task<IActionResult> GetRevenueChart([FromQuery] int days = 30)
        {
            try
            {
                var startDate = DateTime.UtcNow.Date.AddDays(-days);

                var revenueData = await _context.Orders
                    .Where(o => o.CreatedAt >= startDate && o.Status == OrderStatus.COMPLETED && o.IsPaid)
                    .GroupBy(o => o.CreatedAt.Date)
                    .Select(g => new
                    {
                        date = g.Key,
                        revenue = g.Sum(o => o.TotalPrice),
                        orders = g.Count()
                    })
                    .OrderBy(x => x.date)
                    .ToListAsync();

                return Ok(revenueData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting revenue chart data");
                return StatusCode(500, new { message = "خطا در دریافت نمودار درآمد" });
            }
        }

        // GET: api/dashboard/services-stats
        [HttpGet("services-stats")]
        public async Task<IActionResult> GetServicesStats()
        {
            try
            {
                var servicesStats = await _context.Orders
                    .Include(o => o.Service)
                    .GroupBy(o => new { o.ServiceId, o.Service.Name })
                    .Select(g => new
                    {
                        serviceId = g.Key.ServiceId,
                        serviceName = g.Key.Name,
                        totalOrders = g.Count(),
                        completedOrders = g.Count(o => o.Status == OrderStatus.COMPLETED),
                        totalRevenue = g.Where(o => o.Status == OrderStatus.COMPLETED).Sum(o => o.TotalPrice),
                        averagePrice = g.Where(o => o.Status == OrderStatus.COMPLETED).Average(o => (decimal?)o.TotalPrice) ?? 0
                    })
                    .OrderByDescending(x => x.totalOrders)
                    .ToListAsync();

                return Ok(servicesStats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting services stats");
                return StatusCode(500, new { message = "خطا در دریافت آمار خدمات" });
            }
        }

        // GET: api/dashboard/users-growth
        [HttpGet("users-growth")]
        public async Task<IActionResult> GetUsersGrowth([FromQuery] int days = 30)
        {
            try
            {
                var startDate = DateTime.UtcNow.Date.AddDays(-days);

                var usersGrowth = await _context.Users
                    .Where(u => u.CreatedAt >= startDate)
                    .GroupBy(u => u.CreatedAt.Date)
                    .Select(g => new
                    {
                        date = g.Key,
                        newUsers = g.Count(),
                        customers = g.Count(u => u.Role == UserRole.CUSTOMER),
                        drivers = g.Count(u => u.Role == UserRole.DRIVER)
                    })
                    .OrderBy(x => x.date)
                    .ToListAsync();

                return Ok(usersGrowth);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting users growth data");
                return StatusCode(500, new { message = "خطا در دریافت نمودار رشد کاربران" });
            }
        }

        // GET: api/dashboard/active-orders
        [HttpGet("active-orders")]
        public async Task<IActionResult> GetActiveOrders()
        {
            try
            {
                var activeStatuses = new[]
                {
                    OrderStatus.PENDING,
                    OrderStatus.CONFIRMED,
                    OrderStatus.DRIVER_ASSIGNED,
                    OrderStatus.DRIVER_ARRIVED,
                    OrderStatus.IN_PROGRESS
                };

                var activeOrders = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.Service)
                    .Include(o => o.Driver).ThenInclude(d => d!.User)
                    .Where(o => activeStatuses.Contains(o.Status))
                    .OrderByDescending(o => o.CreatedAt)
                    .Select(o => new
                    {
                        o.Id,
                        o.OrderNumber,
                        customerName = o.User.FullName ?? o.User.PhoneNumber,
                        customerPhone = o.User.PhoneNumber,
                        serviceName = o.Service.Name,
                        driverName = o.Driver != null ? o.Driver.User.FullName : "در انتظار اختصاص",
                        driverPhone = o.Driver != null ? o.Driver.User.PhoneNumber : null,
                        status = o.Status.ToString(),
                        o.TotalPrice,
                        o.ScheduledDate,
                        o.CreatedAt
                    })
                    .ToListAsync();

                return Ok(activeOrders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting active orders");
                return StatusCode(500, new { message = "خطا در دریافت سفارش‌های فعال" });
            }
        }

        // GET: api/dashboard/low-stock-products
        [HttpGet("low-stock-products")]
        public async Task<IActionResult> GetLowStockProducts([FromQuery] int threshold = 50)
        {
            try
            {
                var products = await _context.PackingProducts
                    .Where(p => p.IsActive && p.Stock <= threshold)
                    .OrderBy(p => p.Stock)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Stock,
                        p.Unit,
                        p.Category,
                        p.Price
                    })
                    .ToListAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting low stock products");
                return StatusCode(500, new { message = "خطا در دریافت محصولات کم موجودی" });
            }
        }
    }
}
