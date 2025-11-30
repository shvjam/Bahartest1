using System.ComponentModel.DataAnnotations;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.DTOs.Driver
{
    // ============================================
    // REQUEST DTOs
    // ============================================

    /// <summary>
    /// درخواست ثبت‌نام راننده
    /// </summary>
    public class RegisterDriverRequest
    {
        [Required(ErrorMessage = "شماره موبایل الزامی است")]
        [Phone(ErrorMessage = "فرمت شماره موبایل نامعتبر است")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "نام و نام خانوادگی الزامی است")]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "شماره ملی الزامی است")]
        [StringLength(10, MinimumLength = 10, ErrorMessage = "شماره ملی باید 10 رقم باشد")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "شماره ملی نامعتبر است")]
        public string NationalCode { get; set; } = string.Empty;

        [Required(ErrorMessage = "نوع وسیله نقلیه الزامی است")]
        public VehicleType VehicleType { get; set; }

        [Required(ErrorMessage = "پلاک الزامی است")]
        [StringLength(20)]
        public string LicensePlate { get; set; } = string.Empty;

        [Required(ErrorMessage = "شماره گواهینامه الزامی است")]
        [StringLength(20)]
        public string DriverLicenseNumber { get; set; } = string.Empty;

        public string? VehicleModel { get; set; }
        public string? VehicleColor { get; set; }
        public int? VehicleYear { get; set; }

        // مدارک
        public string? NationalCardImageUrl { get; set; }
        public string? DriverLicenseImageUrl { get; set; }
        public string? VehicleLicenseImageUrl { get; set; }
        public string? VehicleImageUrl { get; set; }
    }

    /// <summary>
    /// درخواست به‌روزرسانی پروفایل راننده
    /// </summary>
    public class UpdateDriverProfileRequest
    {
        [StringLength(100)]
        public string? FullName { get; set; }

        public string? VehicleModel { get; set; }
        public string? VehicleColor { get; set; }
        public int? VehicleYear { get; set; }
        public string? AvatarUrl { get; set; }
        public string? VehicleImageUrl { get; set; }
    }

    /// <summary>
    /// درخواست به‌روزرسانی وضعیت راننده
    /// </summary>
    public class UpdateDriverStatusRequest
    {
        [Required(ErrorMessage = "وضعیت جدید الزامی است")]
        public DriverStatus NewStatus { get; set; }

        public decimal? CurrentLatitude { get; set; }
        public decimal? CurrentLongitude { get; set; }
    }

    /// <summary>
    /// درخواست پذیرش سفارش
    /// </summary>
    public class AcceptOrderRequest
    {
        [Required(ErrorMessage = "شناسه سفارش الزامی است")]
        public Guid OrderId { get; set; }

        [StringLength(500)]
        public string? Note { get; set; }
    }

    /// <summary>
    /// درخواست رد سفارش
    /// </summary>
    public class RejectOrderRequest
    {
        [Required(ErrorMessage = "شناسه سفارش الزامی است")]
        public Guid OrderId { get; set; }

        [Required(ErrorMessage = "دلیل رد سفارش الزامی است")]
        [StringLength(500)]
        public string Reason { get; set; } = string.Empty;
    }

    // ============================================
    // RESPONSE DTOs
    // ============================================

    /// <summary>
    /// اطلاعات کامل راننده
    /// </summary>
    public class DriverResponse
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        
        // اطلاعات شخصی
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string NationalCode { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }

        // اطلاعات وسیله نقلیه
        public string VehicleType { get; set; } = string.Empty;
        public string LicensePlate { get; set; } = string.Empty;
        public string DriverLicenseNumber { get; set; } = string.Empty;
        public string? VehicleModel { get; set; }
        public string? VehicleColor { get; set; }
        public int? VehicleYear { get; set; }

        // وضعیت
        public string Status { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool IsVerified { get; set; }

        // امتیاز و آمار
        public decimal Rating { get; set; }
        public int TotalTrips { get; set; }
        public int CompletedTrips { get; set; }
        public int CancelledTrips { get; set; }

        // مدارک
        public string? NationalCardImageUrl { get; set; }
        public string? DriverLicenseImageUrl { get; set; }
        public string? VehicleLicenseImageUrl { get; set; }
        public string? VehicleImageUrl { get; set; }

        // تاریخ‌ها
        public DateTime CreatedAt { get; set; }
        public DateTime? VerifiedAt { get; set; }
        public DateTime? LastActiveAt { get; set; }
    }

    /// <summary>
    /// لیست ساده راننده‌ها
    /// </summary>
    public class DriverListItemResponse
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string VehicleType { get; set; } = string.Empty;
        public string LicensePlate { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool IsVerified { get; set; }
        public decimal Rating { get; set; }
        public int TotalTrips { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// راننده‌های در دسترس
    /// </summary>
    public class AvailableDriverResponse
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string VehicleType { get; set; } = string.Empty;
        public string LicensePlate { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public int TotalTrips { get; set; }
        public decimal? DistanceFromOrigin { get; set; } // فاصله از مبدا (کیلومتر)
        public string? AvatarUrl { get; set; }
        public string? VehicleImageUrl { get; set; }
    }

    /// <summary>
    /// آمار راننده
    /// </summary>
    public class DriverStatsResponse
    {
        public Guid DriverId { get; set; }
        public int TotalTrips { get; set; }
        public int CompletedTrips { get; set; }
        public int CancelledTrips { get; set; }
        public int ActiveTrips { get; set; }
        public decimal TotalEarnings { get; set; }
        public decimal Rating { get; set; }
        public int TotalRatings { get; set; }
        public DateTime? LastTripDate { get; set; }
    }

    /// <summary>
    /// سفارش‌های راننده
    /// </summary>
    public class DriverOrderResponse
    {
        public Guid Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string ServiceType { get; set; } = string.Empty;
        public DateTime PreferredDateTime { get; set; }
        public decimal FinalPrice { get; set; }
        
        public string OriginAddress { get; set; } = string.Empty;
        public string DestinationAddress { get; set; } = string.Empty;
        
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        
        public DateTime? AcceptedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
