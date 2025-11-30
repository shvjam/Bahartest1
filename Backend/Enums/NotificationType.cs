namespace BarbariBahar.API.Enums;

/// <summary>
/// نوع اعلان
/// </summary>
public enum NotificationType
{
    /// <summary>
    /// اطلاعات عمومی
    /// </summary>
    INFO = 0,
    Info = 0,

    /// <summary>
    /// موفقیت
    /// </summary>
    SUCCESS = 1,
    Success = 1,

    /// <summary>
    /// هشدار
    /// </summary>
    WARNING = 2,
    Warning = 2,

    /// <summary>
    /// خطا
    /// </summary>
    ERROR = 3,
    Error = 3,

    /// <summary>
    /// سفارش جدید ثبت شد
    /// </summary>
    ORDER_CREATED = 10,

    /// <summary>
    /// سفارش تایید شد
    /// </summary>
    ORDER_CONFIRMED = 11,

    /// <summary>
    /// سفارش پذیرفته شد
    /// </summary>
    ORDER_ACCEPTED = 12,

    /// <summary>
    /// سفارش شروع شد
    /// </summary>
    ORDER_STARTED = 13,

    /// <summary>
    /// سفارش تکمیل شد
    /// </summary>
    ORDER_COMPLETED = 14,

    /// <summary>
    /// سفارش لغو شد
    /// </summary>
    ORDER_CANCELLED = 15,

    /// <summary>
    /// سفارش جدید برای راننده
    /// </summary>
    NEW_ORDER = 20,

    /// <summary>
    /// راننده تخصیص داده شد
    /// </summary>
    DRIVER_ASSIGNED = 21,

    /// <summary>
    /// راننده تایید شد
    /// </summary>
    DRIVER_APPROVED = 22,

    /// <summary>
    /// پرداخت موفق
    /// </summary>
    PAYMENT_SUCCESS = 30,

    /// <summary>
    /// پرداخت ناموفق
    /// </summary>
    PAYMENT_FAILED = 31,

    /// <summary>
    /// پیام سیستمی
    /// </summary>
    SYSTEM_MESSAGE = 40,

    /// <summary>
    /// یادآوری
    /// </summary>
    REMINDER = 41
}