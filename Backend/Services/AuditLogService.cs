namespace BarbariBahar.API.Services
{
    public interface IAuditLogService
    {
        Task LogActionAsync(string action, string userId, string details, string ipAddress);
        Task LogSecurityEventAsync(string eventType, string details, string ipAddress, bool isSuccess);
        Task LogDataAccessAsync(string tableName, string action, string recordId, string userId);
    }

    /// <summary>
    /// سرویس برای ثبت لاگ‌های Audit (امنیتی و عملیاتی)
    /// </summary>
    public class AuditLogService : IAuditLogService
    {
        private readonly ILogger<AuditLogService> _logger;
        private readonly AppDbContext _context;

        public AuditLogService(
            ILogger<AuditLogService> logger,
            AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        /// <summary>
        /// ثبت عملیات کاربر
        /// </summary>
        public async Task LogActionAsync(string action, string userId, string details, string ipAddress)
        {
            try
            {
                _logger.LogInformation(
                    "User Action: {Action} by User {UserId} from {IpAddress}. Details: {Details}",
                    action, userId, ipAddress, details);

                // می‌توانید در دیتابیس نیز ذخیره کنید
                // var auditLog = new AuditLog { ... };
                // await _context.AuditLogs.AddAsync(auditLog);
                // await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging user action");
            }
        }

        /// <summary>
        /// ثبت رویداد امنیتی (Login, Logout, Failed Login, etc.)
        /// </summary>
        public async Task LogSecurityEventAsync(string eventType, string details, string ipAddress, bool isSuccess)
        {
            try
            {
                var logLevel = isSuccess ? LogLevel.Information : LogLevel.Warning;
                var status = isSuccess ? "Success" : "Failed";

                _logger.Log(logLevel,
                    "Security Event: {EventType} - {Status} from {IpAddress}. Details: {Details}",
                    eventType, status, ipAddress, details);

                // ذخیره در دیتابیس برای تحلیل بعدی
                // var securityLog = new SecurityLog { ... };
                // await _context.SecurityLogs.AddAsync(securityLog);
                // await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging security event");
            }
        }

        /// <summary>
        /// ثبت دسترسی به داده‌ها (برای داده‌های حساس)
        /// </summary>
        public async Task LogDataAccessAsync(string tableName, string action, string recordId, string userId)
        {
            try
            {
                _logger.LogInformation(
                    "Data Access: {Action} on {TableName} record {RecordId} by User {UserId}",
                    action, tableName, recordId, userId);

                // می‌توانید فقط برای جداول خاص ذخیره کنید
                var sensitiveTables = new[] { "Users", "Orders", "Payments", "Drivers" };
                
                if (sensitiveTables.Contains(tableName))
                {
                    // ذخیره در دیتابیس
                    // var dataAccessLog = new DataAccessLog { ... };
                    // await _context.DataAccessLogs.AddAsync(dataAccessLog);
                    // await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging data access");
            }
        }
    }
}
