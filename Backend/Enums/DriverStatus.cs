namespace BarbariBahar.API.Enums;

/// <summary>
/// وضعیت راننده
/// </summary>
public enum DriverStatus
{
    /// <summary>
    /// غیرفعال - راننده آفلاین است
    /// </summary>
    Offline = 0,
    OFFLINE = 0, // UPPER_CASE alias

    /// <summary>
    /// آنلاین - راننده آماده دریافت سفارش
    /// </summary>
    Available = 1,
    AVAILABLE = 1, // UPPER_CASE alias

    /// <summary>
    /// مشغول - راننده در حال انجام سفارش
    /// </summary>
    Busy = 2,
    BUSY = 2, // UPPER_CASE alias

    /// <summary>
    /// در استراحت
    /// </summary>
    OnBreak = 3,
    ON_BREAK = 3, // UPPER_CASE alias

    /// <summary>
    /// تعلیق شده
    /// </summary>
    Suspended = 4,
    SUSPENDED = 4 // UPPER_CASE alias
}