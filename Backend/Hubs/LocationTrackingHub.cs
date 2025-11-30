using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace BarbariBahar.API.Hubs
{
    [Authorize]
    public class LocationTrackingHub : Hub
    {
        private readonly ILogger<LocationTrackingHub> _logger;
        private readonly AppDbContext _context;
        
        // Dictionary برای نگه‌داری اطلاعات کاربران متصل
        private static readonly ConcurrentDictionary<string, UserConnection> _connections = new();

        public LocationTrackingHub(
            ILogger<LocationTrackingHub> logger,
            AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        // ============================================
        // CONNECTION MANAGEMENT
        // ============================================

        public override async Task OnConnectedAsync()
        {
            var userId = GetUserId();
            var connectionId = Context.ConnectionId;

            if (userId.HasValue)
            {
                var user = await _context.Users
                    .Include(u => u.Driver)
                    .FirstOrDefaultAsync(u => u.Id == userId.Value);

                if (user != null)
                {
                    var userConnection = new UserConnection
                    {
                        UserId = user.Id,
                        ConnectionId = connectionId,
                        UserRole = user.Role,
                        ConnectedAt = DateTime.UtcNow,
                        IsDriver = user.Driver != null,
                        DriverId = user.Driver?.Id
                    };

                    _connections.TryAdd(connectionId, userConnection);

                    _logger.LogInformation(
                        "User {UserId} ({Role}) connected with ConnectionId {ConnectionId}",
                        userId, user.Role, connectionId);

                    await Clients.Caller.SendAsync("Connected", new
                    {
                        message = "اتصال برقرار شد",
                        userId = user.Id,
                        role = user.Role.ToString(),
                        timestamp = DateTime.UtcNow
                    });
                }
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var connectionId = Context.ConnectionId;

            if (_connections.TryRemove(connectionId, out var userConnection))
            {
                _logger.LogInformation(
                    "User {UserId} disconnected. ConnectionId: {ConnectionId}",
                    userConnection.UserId, connectionId);

                // اگر راننده بود، به سفارش‌های مربوطه اطلاع بده
                if (userConnection.IsDriver && userConnection.ActiveOrderId.HasValue)
                {
                    await Clients.Group($"Order_{userConnection.ActiveOrderId}")
                        .SendAsync("DriverDisconnected", new
                        {
                            orderId = userConnection.ActiveOrderId,
                            timestamp = DateTime.UtcNow
                        });
                }
            }

            await base.OnDisconnectedAsync(exception);
        }

        // ============================================
        // ORDER TRACKING
        // ============================================

        /// <summary>
        /// مشتری شروع به ردیابی سفارش می‌کند
        /// </summary>
        public async Task StartTrackingOrder(Guid orderId)
        {
            var userId = GetUserId();
            if (!userId.HasValue) return;

            var order = await _context.Orders
                .Include(o => o.Driver).ThenInclude(d => d!.User)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                await Clients.Caller.SendAsync("Error", "سفارش یافت نشد");
                return;
            }

            // بررسی دسترسی
            if (order.UserId != userId.Value && 
                !Context.User!.IsInRole("ADMIN"))
            {
                await Clients.Caller.SendAsync("Error", "شما دسترسی به این سفارش ندارید");
                return;
            }

            // اضافه کردن به گروه سفارش
            var groupName = $"Order_{orderId}";
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            _logger.LogInformation("User {UserId} started tracking order {OrderId}", userId, orderId);

            // ارسال اطلاعات اولیه سفارش
            await Clients.Caller.SendAsync("OrderTrackingStarted", new
            {
                orderId = order.Id,
                orderNumber = order.OrderNumber,
                status = order.Status.ToString(),
                driver = order.Driver != null ? new
                {
                    id = order.Driver.Id,
                    name = order.Driver.User.FullName,
                    phone = order.Driver.User.PhoneNumber,
                    vehicleType = order.Driver.VehicleType.ToString(),
                    licensePlate = order.Driver.LicensePlate,
                    rating = order.Driver.Rating
                } : null,
                timestamp = DateTime.UtcNow
            });

            // اگر راننده آنلاین بود، درخواست موقعیت فعلی
            if (order.DriverId.HasValue)
            {
                var driverConnection = _connections.Values
                    .FirstOrDefault(c => c.DriverId == order.DriverId);

                if (driverConnection != null)
                {
                    await Clients.Client(driverConnection.ConnectionId)
                        .SendAsync("RequestCurrentLocation", orderId);
                }
            }
        }

        /// <summary>
        /// توقف ردیابی سفارش
        /// </summary>
        public async Task StopTrackingOrder(Guid orderId)
        {
            var groupName = $"Order_{orderId}";
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            _logger.LogInformation("User stopped tracking order {OrderId}", orderId);

            await Clients.Caller.SendAsync("OrderTrackingStopped", new
            {
                orderId,
                timestamp = DateTime.UtcNow
            });
        }

        // ============================================
        // LOCATION UPDATES (DRIVER)
        // ============================================

        /// <summary>
        /// راننده موقعیت خود را به‌روز می‌کند
        /// </summary>
        [Authorize(Roles = "DRIVER")]
        public async Task UpdateLocation(Guid orderId, double latitude, double longitude, 
            double? speed = null, double? heading = null, double? accuracy = null)
        {
            var userId = GetUserId();
            if (!userId.HasValue) return;

            var driver = await _context.Drivers
                .FirstOrDefaultAsync(d => d.UserId == userId.Value);

            if (driver == null)
            {
                await Clients.Caller.SendAsync("Error", "راننده یافت نشد");
                return;
            }

            // بررسی سفارش
            var order = await _context.Orders
                .Include(o => o.Addresses)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.DriverId == driver.Id);

            if (order == null)
            {
                await Clients.Caller.SendAsync("Error", "سفارش یافت نشد یا به شما اختصاص نیافته");
                return;
            }

            // ذخیره در دیتابیس
            var locationUpdate = new LocationUpdate
            {
                Id = Guid.NewGuid(),
                OrderId = orderId,
                Latitude = (decimal)latitude,
                Longitude = (decimal)longitude,
                Speed = speed.HasValue ? (decimal)speed.Value : null,
                Heading = heading.HasValue ? (decimal)heading.Value : null,
                Accuracy = accuracy.HasValue ? (decimal)accuracy.Value : null,
                Timestamp = DateTime.UtcNow
            };

            await _context.LocationUpdates.AddAsync(locationUpdate);
            await _context.SaveChangesAsync();

            // محاسبه ETA (تخمین زمان رسیدن)
            var eta = CalculateETA(latitude, longitude, order);

            // ارسال به تمام کسانی که سفارش را ردیابی می‌کنند
            var groupName = $"Order_{orderId}";
            await Clients.Group(groupName).SendAsync("LocationUpdated", new
            {
                orderId,
                driverId = driver.Id,
                location = new
                {
                    latitude,
                    longitude,
                    speed,
                    heading,
                    accuracy
                },
                eta,
                timestamp = DateTime.UtcNow
            });

            // بررسی Geofencing (نزدیک شدن به مقصد)
            await CheckGeofencing(orderId, latitude, longitude, order);

            // به‌روزرسانی اطلاعات کانکشن
            if (_connections.TryGetValue(Context.ConnectionId, out var connection))
            {
                connection.ActiveOrderId = orderId;
                connection.LastLocation = new Location { Latitude = latitude, Longitude = longitude };
                connection.LastLocationUpdate = DateTime.UtcNow;
            }
        }

        /// <summary>
        /// دریافت تاریخچه موقعیت‌های یک سفارش
        /// </summary>
        public async Task GetLocationHistory(Guid orderId)
        {
            var userId = GetUserId();
            if (!userId.HasValue) return;

            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null || (order.UserId != userId.Value && !Context.User!.IsInRole("ADMIN")))
            {
                await Clients.Caller.SendAsync("Error", "دسترسی غیرمجاز");
                return;
            }

            var locations = await _context.LocationUpdates
                .Where(l => l.OrderId == orderId)
                .OrderBy(l => l.Timestamp)
                .Select(l => new
                {
                    latitude = l.Latitude,
                    longitude = l.Longitude,
                    speed = l.Speed,
                    heading = l.Heading,
                    timestamp = l.Timestamp
                })
                .ToListAsync();

            await Clients.Caller.SendAsync("LocationHistory", new
            {
                orderId,
                locations,
                count = locations.Count
            });
        }

        // ============================================
        // ORDER STATUS UPDATES
        // ============================================

        /// <summary>
        /// اطلاع‌رسانی تغییر وضعیت سفارش
        /// </summary>
        public async Task NotifyOrderStatusChange(Guid orderId, string status, string? message = null)
        {
            var groupName = $"Order_{orderId}";
            
            await Clients.Group(groupName).SendAsync("OrderStatusChanged", new
            {
                orderId,
                status,
                message,
                timestamp = DateTime.UtcNow
            });

            _logger.LogInformation("Order {OrderId} status changed to {Status}", orderId, status);
        }

        // ============================================
        // DRIVER STATUS
        // ============================================

        /// <summary>
        /// راننده وضعیت خود را به‌روز می‌کند
        /// </summary>
        [Authorize(Roles = "DRIVER")]
        public async Task UpdateDriverStatus(string status, Guid? orderId = null)
        {
            var userId = GetUserId();
            if (!userId.HasValue) return;

            var driver = await _context.Drivers
                .FirstOrDefaultAsync(d => d.UserId == userId.Value);

            if (driver == null) return;

            if (orderId.HasValue)
            {
                var groupName = $"Order_{orderId}";
                await Clients.Group(groupName).SendAsync("DriverStatusChanged", new
                {
                    orderId,
                    driverId = driver.Id,
                    status,
                    timestamp = DateTime.UtcNow
                });
            }

            _logger.LogInformation("Driver {DriverId} status changed to {Status}", driver.Id, status);
        }

        // ============================================
        // MESSAGING
        // ============================================

        /// <summary>
        /// ارسال پیام بین مشتری و راننده
        /// </summary>
        public async Task SendMessage(Guid orderId, string message)
        {
            var userId = GetUserId();
            if (!userId.HasValue) return;

            var user = await _context.Users
                .Include(u => u.Driver)
                .FirstOrDefaultAsync(u => u.Id == userId.Value);

            if (user == null) return;

            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null) return;

            var groupName = $"Order_{orderId}";
            
            await Clients.Group(groupName).SendAsync("MessageReceived", new
            {
                orderId,
                senderId = user.Id,
                senderName = user.FullName ?? user.PhoneNumber,
                senderRole = user.Role.ToString(),
                message,
                timestamp = DateTime.UtcNow
            });
        }

        // ============================================
        // HELPER METHODS
        // ============================================

        private Guid? GetUserId()
        {
            var userIdClaim = Context.User?.FindFirst("userId")?.Value;
            return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
        }

        private int? CalculateETA(double currentLat, double currentLng, Order order)
        {
            // پیدا کردن آدرس مقصد
            var destination = order.Addresses?.FirstOrDefault(a => a.Type == OrderAddressType.DESTINATION);
            
            if (destination == null || !destination.Latitude.HasValue || !destination.Longitude.HasValue)
                return null;

            // محاسبه فاصله (Haversine formula)
            var distance = CalculateDistance(
                currentLat, 
                currentLng, 
                (double)destination.Latitude.Value, 
                (double)destination.Longitude.Value
            );

            // فرض می‌کنیم سرعت متوسط 30 کیلومتر بر ساعت است
            var averageSpeed = 30.0; // km/h
            var etaHours = distance / averageSpeed;
            var etaMinutes = (int)(etaHours * 60);

            return etaMinutes > 0 ? etaMinutes : 1;
        }

        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            // Haversine formula
            var R = 6371; // شعاع زمین به کیلومتر
            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var distance = R * c;

            return distance;
        }

        private double ToRadians(double degrees)
        {
            return degrees * Math.PI / 180.0;
        }

        private async Task CheckGeofencing(Guid orderId, double lat, double lng, Order order)
        {
            var destination = order.Addresses?.FirstOrDefault(a => a.Type == OrderAddressType.DESTINATION);
            
            if (destination == null || !destination.Latitude.HasValue || !destination.Longitude.HasValue)
                return;

            var distance = CalculateDistance(
                lat, lng,
                (double)destination.Latitude.Value,
                (double)destination.Longitude.Value
            );

            // اگر کمتر از 500 متر به مقصد نزدیک شد
            if (distance < 0.5) // 0.5 کیلومتر = 500 متر
            {
                var groupName = $"Order_{orderId}";
                await Clients.Group(groupName).SendAsync("DriverNearDestination", new
                {
                    orderId,
                    distanceInMeters = (int)(distance * 1000),
                    message = "راننده به مقصد نزدیک شده است",
                    timestamp = DateTime.UtcNow
                });
            }
        }
    }

    // ============================================
    // HELPER CLASSES
    // ============================================

    public class UserConnection
    {
        public Guid UserId { get; set; }
        public string ConnectionId { get; set; } = string.Empty;
        public UserRole UserRole { get; set; }
        public DateTime ConnectedAt { get; set; }
        public bool IsDriver { get; set; }
        public Guid? DriverId { get; set; }
        public Guid? ActiveOrderId { get; set; }
        public Location? LastLocation { get; set; }
        public DateTime? LastLocationUpdate { get; set; }
    }

    public class Location
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}