using BarbariBahar.API.Services.Interfaces;
using BarbariBahar.API.Extensions;

namespace BarbariBahar.API.Services
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<OrderService> _logger;
        private readonly INotificationService _notificationService;

        public OrderService(
            AppDbContext context, 
            ILogger<OrderService> logger,
            INotificationService notificationService)
        {
            _context = context;
            _logger = logger;
            _notificationService = notificationService;
        }

        public async Task<(bool Success, Order? Order, string? Message)> CreateOrderAsync(CreateOrderDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
                // بررسی وجود کاربر
                var user = await _context.Users.FindAsync(dto.UserId);
                if (user == null)
                {
                    return (false, null, "کاربر یافت نشد");
                }

                // بررسی وجود خدمت
                var service = await _context.ServiceCategories.FindAsync(dto.ServiceId);
                if (service == null || !service.IsActive)
                {
                    return (false, null, "خدمت یافت نشد یا غیرفعال است");
                }

                // تولید شماره سفارش
                var orderNumber = await GenerateOrderNumberAsync();

                // ایجاد سفارش
                var order = new Order
                {
                    Id = Guid.NewGuid(),
                    OrderNumber = orderNumber,
                    UserId = dto.UserId,
                    ServiceId = dto.ServiceId,
                    VehicleType = dto.VehicleType,
                    RequiresPacking = dto.RequiresPacking,
                    RequiresWorkers = dto.RequiresWorkers,
                    WorkerCount = dto.WorkerCount,
                    EstimatedDuration = dto.EstimatedDuration ?? 60,
                    Distance = dto.Distance ?? 0,
                    Status = OrderStatus.PENDING,
                    ScheduledDate = dto.ScheduledDate,
                    ScheduledTime = !string.IsNullOrEmpty(dto.ScheduledTime) && TimeSpan.TryParse(dto.ScheduledTime, out var time) ? time : null,
                    BasePrice = dto.BasePrice,
                    VehiclePrice = dto.VehiclePrice,
                    WorkerPrice = dto.WorkerPrice,
                    DistancePrice = dto.DistancePrice,
                    FloorPrice = dto.FloorPrice,
                    WalkingDistancePrice = dto.WalkingDistancePrice,
                    StopsPrice = dto.StopsPrice,
                    PackingPrice = dto.PackingPrice,
                    Subtotal = dto.Subtotal,
                    Discount = dto.Discount,
                    TotalPrice = dto.TotalPrice,
                    DiscountCode = dto.DiscountCode,
                    PaymentMethod = dto.PaymentMethod,
                    IsPaid = false,
                    SpecialInstructions = dto.SpecialInstructions,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Orders.AddAsync(order);

                // اضافه کردن آدرس‌ها
                if (dto.Addresses != null && dto.Addresses.Any())
                {
                    foreach (var addrDto in dto.Addresses)
                    {
                        var address = new OrderAddress
                        {
                            Id = Guid.NewGuid(),
                            OrderId = order.Id,
                            Type = addrDto.Type,
                            AddressLine = addrDto.AddressLine,
                            City = addrDto.City,
                            District = addrDto.District,
                            PostalCode = addrDto.PostalCode,
                            Latitude = addrDto.Latitude.ToDouble(),
                            Longitude = addrDto.Longitude.ToDouble(),
                            Floor = addrDto.Floor,
                            HasElevator = addrDto.HasElevator,
                            WalkingDistance = addrDto.WalkingDistance,
                            ContactName = addrDto.ContactName,
                            ContactPhone = addrDto.ContactPhone,
                            Notes = addrDto.Notes
                        };
                        await _context.OrderAddresses.AddAsync(address);
                    }
                }

                // اضافه کردن آیتم‌ها
                if (dto.Items != null && dto.Items.Any())
                {
                    foreach (var itemDto in dto.Items)
                    {
                        var catalogItem = await _context.CatalogItems.FindAsync(itemDto.CatalogItemId);
                        if (catalogItem == null) continue;

                        var orderItem = new OrderItem
                        {
                            Id = Guid.NewGuid(),
                            OrderId = order.Id,
                            CatalogItemId = itemDto.CatalogItemId,
                            Quantity = itemDto.Quantity,
                            Notes = itemDto.Notes
                        };
                        await _context.OrderItems.AddAsync(orderItem);
                    }
                }

                // اضافه کردن توقف‌ها
                if (dto.Stops != null && dto.Stops.Any())
                {
                    var stopOrder = 1;
                    foreach (var stopDto in dto.Stops)
                    {
                        var orderStop = new OrderStop
                        {
                            Id = Guid.NewGuid(),
                            OrderId = order.Id,
                            Address = stopDto.Address,
                            Latitude = stopDto.Latitude.ToDouble(),
                            Longitude = stopDto.Longitude.ToDouble(),
                            StopOrder = stopOrder++,
                            Notes = stopDto.Notes
                        };
                        await _context.OrderStops.AddAsync(orderStop);
                    }
                }

                // اضافه کردن محصولات بسته‌بندی
                if (dto.PackingProducts != null && dto.PackingProducts.Any())
                {
                    foreach (var packingDto in dto.PackingProducts)
                    {
                        var product = await _context.PackingProducts.FindAsync(packingDto.PackingProductId);
                        if (product == null) continue;

                        var packingItem = new OrderPackingProduct
                        {
                            Id = Guid.NewGuid(),
                            OrderId = order.Id,
                            PackingProductId = packingDto.PackingProductId,
                            Quantity = packingDto.Quantity,
                            Price = packingDto.Price
                        };
                        await _context.OrderPackingProducts.AddAsync(packingItem);

                        // کم کردن موجودی
                        if (product.Stock >= packingDto.Quantity)
                        {
                            product.Stock -= packingDto.Quantity;
                        }
                    }
                }

                // به‌روزرسانی استفاده از کد تخفیف
                if (!string.IsNullOrEmpty(dto.DiscountCode))
                {
                    var discountCode = await _context.DiscountCodes
                        .FirstOrDefaultAsync(dc => dc.Code == dto.DiscountCode && dc.IsActive);
                    
                    if (discountCode != null)
                    {
                        discountCode.UsageCount++;
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // ارسال نوتیفیکیشن
                await _notificationService.CreateNotificationAsync(
                    order.UserId ?? Guid.Empty,
                    NotificationType.ORDER_CREATED,
                    "سفارش ثبت شد",
                    $"سفارش شما با شماره {orderNumber} با موفقیت ثبت شد",
                    order.Id
                );

                _logger.LogInformation("Order {OrderNumber} created successfully by user {UserId}", orderNumber, dto.UserId);

                return (true, order, "سفارش با موفقیت ثبت شد");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error creating order for user {UserId}", dto.UserId);
                return (false, null, "خطا در ثبت سفارش");
            }
        }

        public async Task<(bool Success, string? Message)> UpdateOrderStatusAsync(
            Guid orderId, OrderStatus newStatus, string? reason = null)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.Driver)
                    .FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null)
                {
                    return (false, "سفارش یافت نشد");
                }

                var oldStatus = order.Status;
                order.Status = newStatus;
                order.UpdatedAt = DateTime.UtcNow;

                // به‌روزرسانی تایم‌ها
                switch (newStatus)
                {
                    case OrderStatus.CONFIRMED:
                        await _notificationService.CreateNotificationAsync(
                            order.UserId ?? Guid.Empty,
                            NotificationType.ORDER_CONFIRMED,
                            "سفارش تایید شد",
                            $"سفارش شما با شماره {order.OrderNumber} تایید شد",
                            order.Id
                        );
                        break;

                    case OrderStatus.DRIVER_ASSIGNED:
                        await _notificationService.CreateNotificationAsync(
                            order.UserId ?? Guid.Empty,
                            NotificationType.DRIVER_ASSIGNED,
                            "راننده اختصاص یافت",
                            "راننده برای سفارش شما اختصاص یافت",
                            order.Id
                        );
                        break;

                    case OrderStatus.IN_PROGRESS:
                        order.StartedAt = DateTime.UtcNow;
                        await _notificationService.CreateNotificationAsync(
                            order.UserId ?? Guid.Empty,
                            NotificationType.ORDER_STARTED,
                            "سفارش شروع شد",
                            "سفارش شما شروع شد",
                            order.Id
                        );
                        break;

                    case OrderStatus.COMPLETED:
                        order.CompletedAt = DateTime.UtcNow;
                        await _notificationService.CreateNotificationAsync(
                            order.UserId ?? Guid.Empty,
                            NotificationType.ORDER_COMPLETED,
                            "سفارش تکمیل شد",
                            "سفارش شما تکمیل شد. لطفا نظر خود را ثبت کنید",
                            order.Id
                        );

                        // به‌روزرسانی آمار راننده
                        if (order.DriverId.HasValue && order.Driver != null)
                        {
                            order.Driver.CompletedRides++;
                            order.Driver.TotalEarnings += order.TotalPrice;
                        }
                        break;

                    case OrderStatus.CANCELLED:
                        order.CancelledAt = DateTime.UtcNow;
                        order.CancellationReason = reason;
                        await _notificationService.CreateNotificationAsync(
                            order.UserId ?? Guid.Empty,
                            NotificationType.ORDER_CANCELLED,
                            "سفارش لغو شد",
                            $"سفارش شما لغو شد. {reason}",
                            order.Id
                        );

                        // آزاد کردن راننده
                        if (order.DriverId.HasValue && order.Driver != null)
                        {
                            order.Driver.IsAvailable = true;
                            order.Driver.CancelledRides++;
                        }
                        break;
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation(
                    "Order {OrderNumber} status changed from {OldStatus} to {NewStatus}",
                    order.OrderNumber, oldStatus, newStatus);

                return (true, "وضعیت سفارش به‌روزرسانی شد");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order status for order {OrderId}", orderId);
                return (false, "خطا در به‌روزرسانی وضعیت سفارش");
            }
        }

        public async Task<(bool Success, string? Message)> AssignDriverAsync(Guid orderId, Guid driverId)
        {
            try
            {
                var order = await _context.Orders.FindAsync(orderId);
                if (order == null)
                {
                    return (false, "سفارش یافت نشد");
                }

                var driver = await _context.Drivers
                    .Include(d => d.User)
                    .FirstOrDefaultAsync(d => d.Id == driverId && d.IsActive);

                if (driver == null)
                {
                    return (false, "راننده یافت نشد یا غیرفعال است");
                }

                if (!driver.IsAvailable)
                {
                    return (false, "راننده در دسترس نیست");
                }

                order.DriverId = driver.Id;
                order.Status = OrderStatus.DRIVER_ASSIGNED;
                order.UpdatedAt = DateTime.UtcNow;

                driver.TotalRides++;
                driver.IsAvailable = false;

                await _context.SaveChangesAsync();

                // نوتیفیکیشن به مشتری
                await _notificationService.CreateNotificationAsync(
                    order.UserId ?? Guid.Empty,
                    NotificationType.DRIVER_ASSIGNED,
                    "راننده اختصاص یافت",
                    $"راننده {driver.User.FullName} برای سفارش شما اختصاص یافت",
                    order.Id
                );

                // نوتیفیکیشن به راننده
                await _notificationService.CreateNotificationAsync(
                    driver.UserId,
                    NotificationType.NEW_ORDER,
                    "سفارش جدید",
                    $"سفارش جدید با شماره {order.OrderNumber} به شما اختصاص یافت",
                    order.Id
                );

                _logger.LogInformation(
                    "Driver {DriverId} assigned to order {OrderNumber}",
                    driverId, order.OrderNumber);

                return (true, "رانند با موفقیت اختصاص یافت");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning driver {DriverId} to order {OrderId}", driverId, orderId);
                return (false, "خطا در اختصاص راننده");
            }
        }

        public async Task<(bool Success, string? Message)> CancelOrderAsync(Guid orderId, string reason)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.Driver)
                    .FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null)
                {
                    return (false, "سفارش یافت نشد");
                }

                if (!await CanCancelOrderAsync(orderId))
                {
                    return (false, "این سفارش قابل لغو نیست");
                }

                order.Status = OrderStatus.CANCELLED;
                order.CancellationReason = reason;
                order.CancelledAt = DateTime.UtcNow;
                order.UpdatedAt = DateTime.UtcNow;

                // آزاد کردن راننده
                if (order.DriverId.HasValue && order.Driver != null)
                {
                    order.Driver.IsAvailable = true;
                    order.Driver.CancelledRides++;
                }

                await _context.SaveChangesAsync();

                await _notificationService.CreateNotificationAsync(
                    order.UserId ?? Guid.Empty,
                    NotificationType.ORDER_CANCELLED,
                    "سفارش لغو شد",
                    $"سفارش شما با شماره {order.OrderNumber} لغو شد",
                    order.Id
                );

                _logger.LogInformation("Order {OrderNumber} cancelled. Reason: {Reason}", order.OrderNumber, reason);

                return (true, "سفارش با موفقیت لغو شد");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling order {OrderId}", orderId);
                return (false, "خطا در لغو سفارش");
            }
        }

        public async Task<Order?> GetOrderByIdAsync(Guid orderId)
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Service)
                .Include(o => o.Driver).ThenInclude(d => d!.User)
                .Include(o => o.Items).ThenInclude(i => i.CatalogItem)
                .Include(o => o.Addresses)
                .Include(o => o.Stops)
                .Include(o => o.PackingItems).ThenInclude(pi => pi.PackingProduct)
                .Include(o => o.Rating)
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        public async Task<Order?> GetOrderByNumberAsync(string orderNumber)
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Service)
                .Include(o => o.Driver).ThenInclude(d => d!.User)
                .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
        }

        public async Task<List<Order>> GetUserOrdersAsync(Guid userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Service)
                .Include(o => o.Driver).ThenInclude(d => d!.User)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Order>> GetDriverOrdersAsync(Guid driverId)
        {
            return await _context.Orders
                .Where(o => o.DriverId == driverId)
                .Include(o => o.User)
                .Include(o => o.Service)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Order>> GetPendingOrdersAsync()
        {
            return await _context.Orders
                .Where(o => o.Status == OrderStatus.PENDING || o.Status == OrderStatus.CONFIRMED)
                .Include(o => o.User)
                .Include(o => o.Service)
                .OrderBy(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<string> GenerateOrderNumberAsync()
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

        public async Task<bool> CanCancelOrderAsync(Guid orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            
            if (order == null)
                return false;

            // سفارش‌های تکمیل شده یا قبلاً لغو شده قابل لغو نیستند
            if (order.Status == OrderStatus.COMPLETED || order.Status == OrderStatus.CANCELLED)
                return false;

            // سفارش‌های در حال انجام نیاز به تایید دارند
            if (order.Status == OrderStatus.IN_PROGRESS)
                return false;

            return true;
        }
    }
}