using BarbariBahar.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BarbariBahar.API.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<NotificationService> _logger;
        private readonly ISmsService _smsService;

        public NotificationService(
            AppDbContext context, 
            ILogger<NotificationService> logger,
            ISmsService smsService)
        {
            _context = context;
            _logger = logger;
            _smsService = smsService;
        }

        public async Task<Notification> CreateNotificationAsync(
            Guid userId, 
            NotificationType type, 
            string title, 
            string message, 
            Guid? orderId = null)
        {
            try
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
                await _context.SaveChangesAsync();

                _logger.LogInformation(
                    "Notification created for user {UserId}: {Title}", 
                    userId, title);

                // ارسال SMS برای اطلاع‌رسانی‌های مهم
                if (type == NotificationType.ORDER_CREATED || 
                    type == NotificationType.ORDER_ACCEPTED ||
                    type == NotificationType.ORDER_COMPLETED)
                {
                    var user = await _context.Users.FindAsync(userId);
                    if (user != null)
                    {
                        await _smsService.SendCustomMessageAsync(user.PhoneNumber, message);
                    }
                }

                return notification;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating notification for user {UserId}", userId);
                throw;
            }
        }

        public async Task<List<Notification>> GetUserNotificationsAsync(Guid userId, bool? isRead = null)
        {
            var query = _context.Notifications
                .Include(n => n.Order)
                .Where(n => n.UserId == userId);

            if (isRead.HasValue)
            {
                query = query.Where(n => n.IsRead == isRead.Value);
            }

            return await query
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        public async Task<int> GetUnreadCountAsync(Guid userId)
        {
            return await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead);
        }

        public async Task<bool> MarkAsReadAsync(Guid notificationId)
        {
            try
            {
                var notification = await _context.Notifications.FindAsync(notificationId);
                
                if (notification == null)
                    return false;

                notification.IsRead = true;
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking notification {NotificationId} as read", notificationId);
                return false;
            }
        }

        public async Task<int> MarkAllAsReadAsync(Guid userId)
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

                return notifications.Count;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking all notifications as read for user {UserId}", userId);
                return 0;
            }
        }

        public async Task<bool> DeleteNotificationAsync(Guid notificationId)
        {
            try
            {
                var notification = await _context.Notifications.FindAsync(notificationId);
                
                if (notification == null)
                    return false;

                _context.Notifications.Remove(notification);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting notification {NotificationId}", notificationId);
                return false;
            }
        }

        public async Task<int> ClearReadNotificationsAsync(Guid userId)
        {
            try
            {
                var notifications = await _context.Notifications
                    .Where(n => n.UserId == userId && n.IsRead)
                    .ToListAsync();

                _context.Notifications.RemoveRange(notifications);
                await _context.SaveChangesAsync();

                return notifications.Count;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing read notifications for user {UserId}", userId);
                return 0;
            }
        }
    }
}