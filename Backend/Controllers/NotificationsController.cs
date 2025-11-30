using Microsoft.AspNetCore.Mvc;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<NotificationsController> _logger;

        public NotificationsController(AppDbContext context, ILogger<NotificationsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/notifications
        [HttpGet]
        public async Task<IActionResult> GetNotifications(
            [FromQuery] Guid? userId = null,
            [FromQuery] bool? isRead = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var query = _context.Notifications
                    .Include(n => n.User)
                    .Include(n => n.Order)
                    .AsQueryable();

                if (userId.HasValue)
                {
                    query = query.Where(n => n.UserId == userId.Value);
                }

                if (isRead.HasValue)
                {
                    query = query.Where(n => n.IsRead == isRead.Value);
                }

                var totalCount = await query.CountAsync();
                var unreadCount = await query.CountAsync(n => !n.IsRead);

                var notifications = await query
                    .OrderByDescending(n => n.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(n => new
                    {
                        n.Id,
                        n.UserId,
                        type = n.Type.ToString(),
                        n.Title,
                        n.Message,
                        orderId = n.OrderId,
                        orderNumber = n.Order != null ? n.Order.OrderNumber : null,
                        n.IsRead,
                        n.CreatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    data = notifications,
                    unreadCount = unreadCount,
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
                _logger.LogError(ex, "Error getting notifications");
                return StatusCode(500, new { message = "خطا در دریافت اعلان‌ها" });
            }
        }

        // GET: api/notifications/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNotification(Guid id)
        {
            try
            {
                var notification = await _context.Notifications
                    .Include(n => n.User)
                    .Include(n => n.Order)
                    .FirstOrDefaultAsync(n => n.Id == id);

                if (notification == null)
                {
                    return NotFound(new { message = "اعلان یافت نشد" });
                }

                return Ok(new
                {
                    id = notification.Id,
                    userId = notification.UserId,
                    userName = notification.User.FullName,
                    type = notification.Type.ToString(),
                    title = notification.Title,
                    message = notification.Message,
                    orderId = notification.OrderId,
                    orderNumber = notification.Order?.OrderNumber,
                    isRead = notification.IsRead,
                    createdAt = notification.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting notification {NotificationId}", id);
                return StatusCode(500, new { message = "خطا در دریافت اعلان" });
            }
        }

        // POST: api/notifications
        [HttpPost]
        public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(request.UserId);
                if (user == null)
                {
                    return NotFound(new { message = "کاربر یافت نشد" });
                }

                var notification = new Notification
                {
                    Id = Guid.NewGuid(),
                    UserId = request.UserId,
                    Type = request.Type,
                    Title = request.Title,
                    Message = request.Message,
                    OrderId = request.OrderId,
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Notifications.AddAsync(notification);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetNotification),
                    new { id = notification.Id },
                    new
                    {
                        id = notification.Id,
                        message = "اعلان ارسال شد"
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating notification");
                return StatusCode(500, new { message = "خطا در ارسال اعلان" });
            }
        }

        // PUT: api/notifications/{id}/mark-as-read
        [HttpPut("{id}/mark-as-read")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            try
            {
                var notification = await _context.Notifications.FindAsync(id);

                if (notification == null)
                {
                    return NotFound(new { message = "اعلان یافت نشد" });
                }

                notification.IsRead = true;

                await _context.SaveChangesAsync();

                return Ok(new { message = "اعلان خوانده شد" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking notification as read {NotificationId}", id);
                return StatusCode(500, new { message = "خطا در به‌روزرسانی اعلان" });
            }
        }

        // PUT: api/notifications/mark-all-as-read
        [HttpPut("mark-all-as-read")]
        public async Task<IActionResult> MarkAllAsRead([FromQuery] Guid userId)
        {
            try
            {
                var notifications = await _context.Notifications
                    .Where(n => n.UserId == userId && !n.IsRead)
                    .ToListAsync();

                foreach (var notification in notifications)
                {
                    notification.IsRead = true;
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    count = notifications.Count,
                    message = $"{notifications.Count} اعلان خوانده شد"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking all notifications as read for user {UserId}", userId);
                return StatusCode(500, new { message = "خطا در به‌روزرسانی اعلان‌ها" });
            }
        }

        // DELETE: api/notifications/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(Guid id)
        {
            try
            {
                var notification = await _context.Notifications.FindAsync(id);

                if (notification == null)
                {
                    return NotFound(new { message = "اعلان یافت نشد" });
                }

                _context.Notifications.Remove(notification);
                await _context.SaveChangesAsync();

                return Ok(new { message = "اعلان حذف شد" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting notification {NotificationId}", id);
                return StatusCode(500, new { message = "خطا در حذف اعلان" });
            }
        }

        // DELETE: api/notifications/clear-all
        [HttpDelete("clear-all")]
        public async Task<IActionResult> ClearAllNotifications([FromQuery] Guid userId)
        {
            try
            {
                var notifications = await _context.Notifications
                    .Where(n => n.UserId == userId && n.IsRead)
                    .ToListAsync();

                _context.Notifications.RemoveRange(notifications);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    count = notifications.Count,
                    message = $"{notifications.Count} اعلان حذف شد"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing notifications for user {UserId}", userId);
                return StatusCode(500, new { message = "خطا در حذف اعلان‌ها" });
            }
        }
    }

    // Request DTOs
    public class CreateNotificationRequest
    {
        public Guid UserId { get; set; }
        public NotificationType Type { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public Guid? OrderId { get; set; }
    }
}
