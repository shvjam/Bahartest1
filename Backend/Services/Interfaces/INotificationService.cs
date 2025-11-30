namespace BarbariBahar.API.Services.Interfaces
{
    public interface INotificationService
    {
        Task<Notification> CreateNotificationAsync(Guid userId, NotificationType type, string title, string message, Guid? orderId = null);
        Task<List<Notification>> GetUserNotificationsAsync(Guid userId, bool? isRead = null);
        Task<int> GetUnreadCountAsync(Guid userId);
        Task<bool> MarkAsReadAsync(Guid notificationId);
        Task<int> MarkAllAsReadAsync(Guid userId);
        Task<bool> DeleteNotificationAsync(Guid notificationId);
        Task<int> ClearReadNotificationsAsync(Guid userId);
    }
}
