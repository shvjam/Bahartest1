using Microsoft.AspNetCore.Mvc;
using BarbariBahar.API.Extensions;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(AppDbContext context, ILogger<OrdersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/orders
        [HttpGet]
        public async Task<IActionResult> GetOrders(
            [FromQuery] string? status = null,
            [FromQuery] Guid? userId = null,
            [FromQuery] Guid? driverId = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var query = _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.Service)
                    .Include(o => o.Driver)
                    .AsQueryable();

                // فیلتر بر اساس وضعیت
                if (!string.IsNullOrEmpty(status) && Enum.TryParse<OrderStatus>(status, out var orderStatus))
                {
                    query = query.Where(o => o.Status == orderStatus);
                }

                // فیلتر بر اساس کاربر
                if (userId.HasValue)
                {
                    query = query.Where(o => o.UserId == userId.Value);
                }

                // فیلتر بر اساس راننده
                if (driverId.HasValue)
                {
                    query = query.Where(o => o.DriverId == driverId.Value);
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
                        driverName = o.Driver != null ? o.Driver.User.FullName : null,
                        o.VehicleType,
                        o.Status,
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
                _logger.LogError(ex, "Error getting orders");
                return StatusCode(500, new { message = "خطا در دریافت لیست سفارش‌ها" });
            }
        }

        // GET: api/orders/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(Guid id)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.Service)
                    .Include(o => o.Driver).ThenInclude(d => d!.User)
                    .Include(o => o.Items).ThenInclude(i => i.CatalogItem)
                    .Include(o => o.Addresses)
                    .Include(o => o.Stops)
                    .Include(o => o.PackingItems).ThenInclude(pi => pi.PackingProduct)
                    .Include(o => o.Ratings)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                {
                    return NotFound(new { message = "سفارش یافت نشد" });
                }

                return Ok(new
                {
                    id = order.Id,
                    orderNumber = order.OrderNumber,
                    customer = new
                    {
                        id = order.User.Id,
                        name = order.User.FullName,
                        phone = order.User.PhoneNumber,
                        email = order.User.Email
                    },
                    service = new
                    {
                        id = order.Service.Id,
                        name = order.Service.Name,
                        slug = order.Service.Slug
                    },
                    driver = order.Driver != null ? new
                    {
                        id = order.Driver.Id,
                        name = order.Driver.User.FullName,
                        phone = order.Driver.User.PhoneNumber,
                        licensePlate = order.Driver.LicensePlate,
                        vehicleType = order.Driver.VehicleType.ToString(),
                        rating = order.Driver.Rating
                    } : null,
                    addresses = order.Addresses.Select(a => new
                    {
                        a.Type,
                        a.AddressLine,
                        a.City,
                        a.District,
                        a.PostalCode,
                        a.Latitude,
                        a.Longitude,
                        a.Floor,
                        a.HasElevator,
                        a.WalkingDistance,
                        a.ContactName,
                        a.ContactPhone,
                        a.Notes
                    }),
                    items = order.Items.Select(i => new
                    {
                        i.Id,
                        itemName = i.CatalogItem.Name,
                        i.Quantity,
                        i.Notes
                    }),
                    stops = order.Stops.Select(s => new
                    {
                        s.Address,
                        s.Latitude,
                        s.Longitude,
                        s.StopOrder,
                        s.Notes
                    }),
                    packingItems = order.PackingItems.Select(pi => new
                    {
                        productName = pi.PackingProduct.Name,
                        pi.Quantity,
                        pi.Price
                    }),
                    vehicleType = order.VehicleType.ToString(),
                    requiresPacking = order.RequiresPacking,
                    requiresWorkers = order.RequiresWorkers,
                    workerCount = order.WorkerCount,
                    estimatedDuration = order.EstimatedDuration,
                    distance = order.Distance,
                    status = order.Status.ToString(),
                    scheduledDate = order.ScheduledDate,
                    scheduledTime = order.ScheduledTime,
                    pricing = new
                    {
                        basePrice = order.BasePrice,
                        vehiclePrice = order.VehiclePrice,
                        workerPrice = order.WorkerPrice,
                        distancePrice = order.DistancePrice,
                        floorPrice = order.FloorPrice,
                        walkingDistancePrice = order.WalkingDistancePrice,
                        stopsPrice = order.StopsPrice,
                        packingPrice = order.PackingPrice,
                        subtotal = order.Subtotal,
                        discount = order.Discount,
                        totalPrice = order.TotalPrice
                    },
                    discountCode = order.DiscountCode,
                    paymentMethod = order.PaymentMethod?.ToString(),
                    isPaid = order.IsPaid,
                    rating = order.Ratings != null && order.Ratings.Any() ? new
                    {
                        overallRating = order.Ratings.First().OverallRating,
                        driverRating = order.Ratings.First().DriverRating ?? 0,
                        serviceRating = order.Ratings.First().ServiceRating ?? 0,
                        comment = order.Ratings.First().Comment,
                        createdAt = order.Ratings.First().CreatedAt
                    } : null,
                    specialInstructions = order.SpecialInstructions,
                    cancellationReason = order.CancellationReason,
                    createdAt = order.CreatedAt,
                    updatedAt = order.UpdatedAt,
                    startedAt = order.StartedAt,
                    completedAt = order.CompletedAt,
                    cancelledAt = order.CancelledAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting order {OrderId}", id);
                return StatusCode(500, new { message = "خطا در دریافت جزئیات سفارش" });
            }
        }

        // POST: api/orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            try
            {
                // بررسی وجود کاربر
                var user = await _context.Users.FindAsync(request.UserId);
                if (user == null)
                {
                    return NotFound(new { message = "کاربر یافت نشد" });
                }

                // بررسی وجود خدمت
                var service = await _context.ServiceCategories.FindAsync(request.ServiceId);
                if (service == null || !service.IsActive)
                {
                    return NotFound(new { message = "خدمت یافت نشد یا غیرفعال است" });
                }

                // تولید شماره سفارش
                var orderNumber = await GenerateOrderNumber();

                // ایجاد سفارش
                var order = new Order
                {
                    Id = Guid.NewGuid(),
                    OrderNumber = orderNumber,
                    UserId = request.UserId,
                    ServiceId = request.ServiceId,
                    VehicleType = request.VehicleType,
                    RequiresPacking = request.RequiresPacking,
                    RequiresWorkers = request.RequiresWorkers,
                    WorkerCount = request.WorkerCount,
                    EstimatedDuration = request.EstimatedDuration ?? 60,
                    Distance = request.Distance ?? 0m,
                    Status = OrderStatus.PENDING,
                    ScheduledDate = request.ScheduledDate,
                    ScheduledTime = !string.IsNullOrEmpty(request.ScheduledTime) && TimeSpan.TryParse(request.ScheduledTime, out var scheduledTime) ? scheduledTime : null,
                    BasePrice = request.BasePrice,
                    VehiclePrice = request.VehiclePrice,
                    WorkerPrice = request.WorkerPrice,
                    DistancePrice = request.DistancePrice,
                    FloorPrice = request.FloorPrice,
                    WalkingDistancePrice = request.WalkingDistancePrice,
                    StopsPrice = request.StopsPrice,
                    PackingPrice = request.PackingPrice,
                    Subtotal = request.Subtotal,
                    Discount = request.Discount,
                    TotalPrice = request.TotalPrice,
                    DiscountCode = request.DiscountCode,
                    PaymentMethod = request.PaymentMethod,
                    IsPaid = false,
                    SpecialInstructions = request.SpecialInstructions,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Orders.AddAsync(order);

                // اضافه کردن آدرس‌ها
                if (request.Addresses != null && request.Addresses.Any())
                {
                    foreach (var addr in request.Addresses)
                    {
                        var address = new OrderAddress
                        {
                            Id = Guid.NewGuid(),
                            OrderId = order.Id,
                            Type = addr.Type,
                            AddressLine = addr.AddressLine,
                            City = addr.City,
                            District = addr.District,
                            PostalCode = addr.PostalCode,
                            Latitude = addr.Latitude.ToDouble(),
                            Longitude = addr.Longitude.ToDouble(),
                            Floor = addr.Floor,
                            HasElevator = addr.HasElevator,
                            WalkingDistance = addr.WalkingDistance,
                            ContactName = addr.ContactName,
                            ContactPhone = addr.ContactPhone,
                            Notes = addr.Notes
                        };
                        await _context.OrderAddresses.AddAsync(address);
                    }
                }

                // اضافه کردن آیتم‌ها
                if (request.Items != null && request.Items.Any())
                {
                    foreach (var item in request.Items)
                    {
                        var orderItem = new OrderItem
                        {
                            Id = Guid.NewGuid(),
                            OrderId = order.Id,
                            CatalogItemId = item.CatalogItemId,
                            Quantity = item.Quantity,
                            Notes = item.Notes
                        };
                        await _context.OrderItems.AddAsync(orderItem);
                    }
                }

                // اضافه کردن توقف‌ها
                if (request.Stops != null && request.Stops.Any())
                {
                    var stopOrder = 1;
                    foreach (var stop in request.Stops)
                    {
                        var orderStop = new OrderStop
                        {
                            Id = Guid.NewGuid(),
                            OrderId = order.Id,
                            Address = stop.Address,
                            Latitude = stop.Latitude.ToDouble(),
                            Longitude = stop.Longitude.ToDouble(),
                            StopOrder = stopOrder++,
                            Notes = stop.Notes
                        };
                        await _context.OrderStops.AddAsync(orderStop);
                    }
                }

                // اضافه کردن محصولات بسته‌بندی
                if (request.PackingProducts != null && request.PackingProducts.Any())
                {
                    foreach (var packing in request.PackingProducts)
                    {
                        var packingItem = new OrderPackingProduct
                        {
                            Id = Guid.NewGuid(),
                            OrderId = order.Id,
                            PackingProductId = packing.PackingProductId,
                            Quantity = packing.Quantity,
                            Price = packing.Price
                        };
                        await _context.OrderPackingProducts.AddAsync(packingItem);
                    }
                }

                // به‌روزرسانی تعداد استفاده از کد تخفیف
                if (!string.IsNullOrEmpty(request.DiscountCode))
                {
                    var discountCode = await _context.DiscountCodes
                        .FirstOrDefaultAsync(dc => dc.Code == request.DiscountCode && dc.IsActive);
                    
                    if (discountCode != null)
                    {
                        discountCode.UsageCount++;
                    }
                }

                await _context.SaveChangesAsync();

                // ارسال نوتیفیکیشن
                await CreateNotification(
                    order.UserId ?? Guid.Empty,
                    NotificationType.ORDER_CREATED,
                    "سفارش ثبت شد",
                    $"سفارش شما با شماره {orderNumber} با موفقیت ثبت شد",
                    order.Id
                );

                return CreatedAtAction(
                    nameof(GetOrder),
                    new { id = order.Id },
                    new
                    {
                        id = order.Id,
                        orderNumber = order.OrderNumber,
                        status = order.Status.ToString(),
                        totalPrice = order.TotalPrice,
                        message = "سفارش با موفقیت ثبت شد"
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order");
                return StatusCode(500, new { message = "خطا در ثبت سفارش" });
            }
        }

        // PUT: api/orders/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusRequest request)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.User)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                {
                    return NotFound(new { message = "سفارش یافت نشد" });
                }

                var oldStatus = order.Status;
                order.Status = request.Status;
                order.UpdatedAt = DateTime.UtcNow;

                // به‌روزرسانی تایم‌ها بر اساس وضعیت
                switch (request.Status)
                {
                    case OrderStatus.CONFIRMED:
                        // نوتیفیکیشن تایید سفارش
                        await CreateNotification(
                            order.UserId ?? Guid.Empty,
                            NotificationType.ORDER_CONFIRMED,
                            "سفارش تایید شد",
                            $"سفارش شما با شماره {order.OrderNumber} تایید شد",
                            order.Id
                        );
                        break;

                    case OrderStatus.DRIVER_ASSIGNED:
                        // نوتیفیکیشن اختصاص راننده
                        await CreateNotification(
                            order.UserId ?? Guid.Empty,
                            NotificationType.DRIVER_ASSIGNED,
                            "راننده اختصاص یافت",
                            $"راننده برای سفارش شما اختصاص یافت",
                            order.Id
                        );
                        break;

                    case OrderStatus.IN_PROGRESS:
                        order.StartedAt = DateTime.UtcNow;
                        await CreateNotification(
                            order.UserId ?? Guid.Empty,
                            NotificationType.ORDER_STARTED,
                            "سفارش شروع شد",
                            $"سفارش شما شروع شد",
                            order.Id
                        );
                        break;

                    case OrderStatus.COMPLETED:
                        order.CompletedAt = DateTime.UtcNow;
                        await CreateNotification(
                            order.UserId ?? Guid.Empty,
                            NotificationType.ORDER_COMPLETED,
                            "سفارش تکمیل شد",
                            $"سفارش شما تکمیل شد. لطفا نظر خود را ثبت کنید",
                            order.Id
                        );

                        // به‌روزرسانی آمار راننده
                        if (order.DriverId.HasValue)
                        {
                            var driver = await _context.Drivers.FindAsync(order.DriverId.Value);
                            if (driver != null)
                            {
                                driver.CompletedRides++;
                                driver.TotalEarnings += order.TotalPrice;
                            }
                        }
                        break;

                    case OrderStatus.CANCELLED:
                        order.CancelledAt = DateTime.UtcNow;
                        order.CancellationReason = request.Reason;
                        await CreateNotification(
                            order.UserId ?? Guid.Empty,
                            NotificationType.ORDER_CANCELLED,
                            "سفارش لغو شد",
                            $"سفارش شما لغو شد. {request.Reason}",
                            order.Id
                        );

                        // به‌روزرسانی آمار راننده
                        if (order.DriverId.HasValue)
                        {
                            var driver = await _context.Drivers.FindAsync(order.DriverId.Value);
                            if (driver != null)
                            {
                                driver.CancelledRides++;
                            }
                        }
                        break;
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    id = order.Id,
                    orderNumber = order.OrderNumber,
                    oldStatus = oldStatus.ToString(),
                    newStatus = order.Status.ToString(),
                    message = "وضعیت سفارش به‌روزرسانی شد"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order status {OrderId}", id);
                return StatusCode(500, new { message = "خطا در به‌روزرسانی وضعیت سفارش" });
            }
        }

        // PUT: api/orders/{id}/assign-driver
        [HttpPut("{id}/assign-driver")]
        public async Task<IActionResult> AssignDriver(Guid id, [FromBody] AssignDriverRequest request)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null)
                {
                    return NotFound(new { message = "سفارش یافت نشد" });
                }

                var driver = await _context.Drivers
                    .Include(d => d.User)
                    .FirstOrDefaultAsync(d => d.Id == request.DriverId && d.IsActive);

                if (driver == null)
                {
                    return NotFound(new { message = "راننده یافت نشد یا غیرفعال است" });
                }

                order.DriverId = driver.Id;
                order.Status = OrderStatus.DRIVER_ASSIGNED;
                order.UpdatedAt = DateTime.UtcNow;

                driver.TotalRides++;
                driver.IsAvailable = false;

                await _context.SaveChangesAsync();

                // نوتیفیکیشن به مشتری
                await CreateNotification(
                    order.UserId ?? Guid.Empty,
                    NotificationType.DRIVER_ASSIGNED,
                    "راننده اختصاص یافت",
                    $"راننده {driver.User.FullName} برای سفارش شما اختصاص یافت",
                    order.Id
                );

                // نوتیفیکیشن به راننده
                await CreateNotification(
                    driver.UserId,
                    NotificationType.NEW_ORDER,
                    "سفارش جدید",
                    $"سفارش جدید با شماره {order.OrderNumber} به شما اختصاص یافت",
                    order.Id
                );

                return Ok(new
                {
                    message = "راننده با موفقیت اختصاص یافت",
                    driver = new
                    {
                        id = driver.Id,
                        name = driver.User.FullName,
                        phone = driver.User.PhoneNumber,
                        licensePlate = driver.LicensePlate
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning driver to order {OrderId}", id);
                return StatusCode(500, new { message = "خطا در اختصاص راننده" });
            }
        }

        // POST: api/orders/{id}/rating
        [HttpPost("{id}/rating")]
        public async Task<IActionResult> RateOrder(Guid id, [FromBody] RateOrderRequest request)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.Ratings)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                {
                    return NotFound(new { message = "سفارش یافت نشد" });
                }

                if (order.Status != OrderStatus.COMPLETED)
                {
                    return BadRequest(new { message = "فقط سفارش‌های تکمیل شده قابل امتیازدهی هستند" });
                }

                if (order.Ratings != null && order.Ratings.Any())
                {
                    return BadRequest(new { message = "این سفارش قبلاً امتیاز دریافت کرده است" });
                }

                var rating = new OrderRating
                {
                    Id = Guid.NewGuid(),
                    OrderId = order.Id,
                    UserId = order.UserId ?? Guid.Empty,
                    OverallRating = (int?)request.OverallRating,
                    DriverRating = (int?)request.DriverRating,
                    ServiceRating = (int?)request.ServiceRating,
                    Comment = request.Comment,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.OrderRatings.AddAsync(rating);

                // به‌روزرسانی امتیاز راننده
                if (order.DriverId.HasValue)
                {
                    var driver = await _context.Drivers.FindAsync(order.DriverId.Value);
                    if (driver != null)
                    {
                        // محاسبه میانگین جدید
                        var allRatings = await _context.OrderRatings
                            .Include(r => r.Order)
                            .Where(r => r.Order.DriverId == driver.Id && r.DriverRating.HasValue)
                            .Select(r => r.DriverRating!.Value)
                            .ToListAsync();

                        if (request.DriverRating.HasValue)
                        {
                            allRatings.Add((int)request.DriverRating.Value);
                        }

                        driver.Rating = allRatings.Any() ? (decimal)allRatings.Average() : 0;
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "امتیاز شما با موفقیت ثبت شد",
                    rating = new
                    {
                        overallRating = rating.OverallRating,
                        driverRating = rating.DriverRating,
                        serviceRating = rating.ServiceRating,
                        comment = rating.Comment
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error rating order {OrderId}", id);
                return StatusCode(500, new { message = "خطا در ثبت امتیاز" });
            }
        }

        // DELETE: api/orders/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelOrder(Guid id, [FromBody] CancelOrderRequest request)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);

                if (order == null)
                {
                    return NotFound(new { message = "سفارش یافت نشد" });
                }

                if (order.Status == OrderStatus.COMPLETED || order.Status == OrderStatus.CANCELLED)
                {
                    return BadRequest(new { message = "این سفارش قابل لغو نیست" });
                }

                order.Status = OrderStatus.CANCELLED;
                order.CancellationReason = request.Reason;
                order.CancelledAt = DateTime.UtcNow;
                order.UpdatedAt = DateTime.UtcNow;

                // آزاد کردن راننده
                if (order.DriverId.HasValue)
                {
                    var driver = await _context.Drivers.FindAsync(order.DriverId.Value);
                    if (driver != null)
                    {
                        driver.IsAvailable = true;
                        driver.CancelledRides++;
                    }
                }

                await _context.SaveChangesAsync();

                await CreateNotification(
                    order.UserId ?? Guid.Empty,
                    NotificationType.ORDER_CANCELLED,
                    "سفارش لغو شد",
                    $"سفارش شما با شماره {order.OrderNumber} لغو شد",
                    order.Id
                );

                return Ok(new { message = "سفارش با موفقیت لغو شد" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling order {OrderId}", id);
                return StatusCode(500, new { message = "خطا در لغو سفارش" });
            }
        }

        // Helper Methods
        private async Task<string> GenerateOrderNumber()
        {
            var date = DateTime.UtcNow;
            var prefix = $"BB{date:yyMMdd}";
            
            var lastOrder = await _context.Orders
                .Where(o => o.OrderNumber.StartsWith(prefix))
                .OrderByDescending(o => o.OrderNumber)
                .FirstOrDefaultAsync();

            int sequence = 1;
            if (lastOrder != null)
            {
                var lastSequence = lastOrder.OrderNumber.Substring(prefix.Length);
                if (int.TryParse(lastSequence, out var num))
                {
                    sequence = num + 1;
                }
            }

            return $"{prefix}{sequence:D4}";
        }

        private async Task CreateNotification(
            Guid userId,
            NotificationType type,
            string title,
            string message,
            Guid? orderId = null)
        {
            var notification = new Notification
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Type = type,
                Title = title,
                Message = message,
                OrderId = orderId,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Notifications.AddAsync(notification);
        }
    }

    // Request DTOs
    public class CreateOrderRequest
    {
        public Guid UserId { get; set; }
        public Guid ServiceId { get; set; }
        public VehicleType VehicleType { get; set; }
        public bool RequiresPacking { get; set; }
        public bool RequiresWorkers { get; set; }
        public int WorkerCount { get; set; }
        public int? EstimatedDuration { get; set; }
        public decimal? Distance { get; set; }
        public DateTime ScheduledDate { get; set; }
        public string? ScheduledTime { get; set; }
        public decimal BasePrice { get; set; }
        public decimal VehiclePrice { get; set; }
        public decimal WorkerPrice { get; set; }
        public decimal DistancePrice { get; set; }
        public decimal FloorPrice { get; set; }
        public decimal WalkingDistancePrice { get; set; }
        public decimal StopsPrice { get; set; }
        public decimal PackingPrice { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Discount { get; set; }
        public decimal TotalPrice { get; set; }
        public string? DiscountCode { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
        public string? SpecialInstructions { get; set; }
        public List<CreateOrderAddressDto>? Addresses { get; set; }
        public List<CreateOrderItemDto>? Items { get; set; }
        public List<CreateOrderStopDto>? Stops { get; set; }
        public List<CreateOrderPackingDto>? PackingProducts { get; set; }
    }

    public class CreateOrderAddressDto
    {
        public OrderAddressType Type { get; set; }
        public string AddressLine { get; set; } = string.Empty;
        public string? City { get; set; }
        public string? District { get; set; }
        public string? PostalCode { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public int? Floor { get; set; }
        public bool HasElevator { get; set; }
        public int? WalkingDistance { get; set; }
        public string? ContactName { get; set; }
        public string? ContactPhone { get; set; }
        public string? Notes { get; set; }
    }

    public class CreateOrderItemDto
    {
        public Guid CatalogItemId { get; set; }
        public int Quantity { get; set; }
        public string? Notes { get; set; }
    }

    public class CreateOrderStopDto
    {
        public string Address { get; set; } = string.Empty;
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? Notes { get; set; }
    }

    public class CreateOrderPackingDto
    {
        public Guid PackingProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }

    public class UpdateOrderStatusRequest
    {
        public OrderStatus Status { get; set; }
        public string? Reason { get; set; }
    }

    public class AssignDriverRequest
    {
        public Guid DriverId { get; set; }
    }

    public class RateOrderRequest
    {
        public decimal OverallRating { get; set; }
        public decimal? DriverRating { get; set; }
        public decimal? ServiceRating { get; set; }
        public string? Comment { get; set; }
    }

    public class CancelOrderRequest
    {
        public string Reason { get; set; } = string.Empty;
    }
}