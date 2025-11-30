using System.ComponentModel.DataAnnotations;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.DTOs.Order
{
    // ============================================
    // REQUEST DTOs
    // ============================================

    /// <summary>
    /// درخواست ایجاد سفارش جدید
    /// </summary>
    public class CreateOrderRequest
    {
        [Required(ErrorMessage = "نوع خدمت الزامی است")]
        public Guid ServiceCategoryId { get; set; }

        [Required(ErrorMessage = "تاریخ و زمان ترجیحی الزامی است")]
        public DateTime PreferredDateTime { get; set; }

        [Required(ErrorMessage = "آدرس مبدا الزامی است")]
        public OrderAddressDto OriginAddress { get; set; } = null!;

        [Required(ErrorMessage = "آدرس مقصد الزامی است")]
        public OrderAddressDto DestinationAddress { get; set; } = null!;

        [Required(ErrorMessage = "جزئیات موقعیت الزامی است")]
        public LocationDetailsDto LocationDetails { get; set; } = null!;

        public List<OrderItemDto> Items { get; set; } = new();

        public PackingServiceDto? PackingService { get; set; }

        public string? DiscountCode { get; set; }

        [StringLength(1000, ErrorMessage = "توضیحات نباید بیشتر از 1000 کاراکتر باشد")]
        public string? CustomerNote { get; set; }
    }

    /// <summary>
    /// آدرس سفارش
    /// </summary>
    public class OrderAddressDto
    {
        public Guid? SavedAddressId { get; set; }

        [Required(ErrorMessage = "آدرس کامل الزامی است")]
        public string FullAddress { get; set; } = string.Empty;

        [Required]
        [Range(-90, 90)]
        public decimal Latitude { get; set; }

        [Required]
        [Range(-180, 180)]
        public decimal Longitude { get; set; }

        public string? BuildingNo { get; set; }
        public string? Unit { get; set; }
        public string? ContactName { get; set; }
        public string? ContactPhone { get; set; }
    }

    /// <summary>
    /// آیتم سفارش (اثاثیه)
    /// </summary>
    public class OrderItemDto
    {
        [Required(ErrorMessage = "شناسه آیتم الزامی است")]
        public Guid CatalogItemId { get; set; }

        [Required]
        [Range(1, 1000, ErrorMessage = "تعداد باید بین 1 تا 1000 باشد")]
        public int Quantity { get; set; }

        [StringLength(500)]
        public string? Note { get; set; }
    }

    /// <summary>
    /// جزئیات موقعیت
    /// </summary>
    public class LocationDetailsDto
    {
        [Required]
        public FloorType OriginFloorType { get; set; }

        [Range(0, 100)]
        public int? OriginFloorNumber { get; set; }

        public bool OriginHasElevator { get; set; }
        public bool OriginHasParking { get; set; }

        [Required]
        public FloorType DestinationFloorType { get; set; }

        [Range(0, 100)]
        public int? DestinationFloorNumber { get; set; }

        public bool DestinationHasElevator { get; set; }
        public bool DestinationHasParking { get; set; }

        [Range(0, 1000, ErrorMessage = "فاصله باید بین 0 تا 1000 کیلومتر باشد")]
        public decimal? EstimatedDistance { get; set; }
    }

    /// <summary>
    /// سرویس بسته‌بندی
    /// </summary>
    public class PackingServiceDto
    {
        [Required]
        public bool IsRequested { get; set; }

        public List<PackingServiceItemDto> Items { get; set; } = new();
    }

    /// <summary>
    /// آیتم بسته‌بندی
    /// </summary>
    public class PackingServiceItemDto
    {
        [Required]
        public Guid PackingProductId { get; set; }

        [Required]
        [Range(1, 1000)]
        public int Quantity { get; set; }
    }

    /// <summary>
    /// درخواست به‌روزرسانی وضعیت سفارش
    /// </summary>
    public class UpdateOrderStatusRequest
    {
        [Required(ErrorMessage = "وضعیت جدید الزامی است")]
        public OrderStatus NewStatus { get; set; }

        [StringLength(500)]
        public string? Reason { get; set; }
    }

    /// <summary>
    /// درخواست تخصیص راننده
    /// </summary>
    public class AssignDriverRequest
    {
        [Required(ErrorMessage = "شناسه راننده الزامی است")]
        public Guid DriverId { get; set; }

        [StringLength(500)]
        public string? Note { get; set; }
    }

    // ============================================
    // RESPONSE DTOs
    // ============================================

    /// <summary>
    /// پاسخ کامل سفارش
    /// </summary>
    public class OrderResponse
    {
        public Guid Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string ServiceType { get; set; } = string.Empty;

        // زمان‌ها
        public DateTime PreferredDateTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? AcceptedAt { get; set; }
        public DateTime? CompletedAt { get; set; }

        // آدرس‌ها
        public OrderAddressResponse OriginAddress { get; set; } = null!;
        public OrderAddressResponse DestinationAddress { get; set; } = null!;

        // جزئیات
        public LocationDetailsResponse LocationDetails { get; set; } = null!;
        public List<OrderItemResponse> Items { get; set; } = new();
        public PackingServiceResponse? PackingService { get; set; }

        // قیمت
        public decimal BasePrice { get; set; }
        public decimal PackingPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal? DiscountAmount { get; set; }
        public decimal FinalPrice { get; set; }

        // کاربر و راننده
        public Guid UserId { get; set; }
        public string? UserName { get; set; }
        public string? UserPhone { get; set; }
        
        public DriverInfoResponse? Driver { get; set; }

        // توضیحات
        public string? CustomerNote { get; set; }
        public string? AdminNote { get; set; }
    }

    /// <summary>
    /// لیست ساده سفارش‌ها
    /// </summary>
    public class OrderListItemResponse
    {
        public Guid Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string ServiceType { get; set; } = string.Empty;
        public DateTime PreferredDateTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal FinalPrice { get; set; }
        public string? UserName { get; set; }
        public string? UserPhone { get; set; }
        public string? DriverName { get; set; }
        public bool IsPaid { get; set; }
    }

    /// <summary>
    /// آدرس سفارش - Response
    /// </summary>
    public class OrderAddressResponse
    {
        public string FullAddress { get; set; } = string.Empty;
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string? BuildingNo { get; set; }
        public string? Unit { get; set; }
        public string? ContactName { get; set; }
        public string? ContactPhone { get; set; }
    }

    /// <summary>
    /// جزئیات موقعیت - Response
    /// </summary>
    public class LocationDetailsResponse
    {
        public string OriginFloorType { get; set; } = string.Empty;
        public int? OriginFloorNumber { get; set; }
        public bool OriginHasElevator { get; set; }
        public bool OriginHasParking { get; set; }
        
        public string DestinationFloorType { get; set; } = string.Empty;
        public int? DestinationFloorNumber { get; set; }
        public bool DestinationHasElevator { get; set; }
        public bool DestinationHasParking { get; set; }
        
        public decimal? EstimatedDistance { get; set; }
    }

    /// <summary>
    /// آیتم سفارش - Response
    /// </summary>
    public class OrderItemResponse
    {
        public Guid Id { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public string? Note { get; set; }
    }

    /// <summary>
    /// سرویس بسته‌بندی - Response
    /// </summary>
    public class PackingServiceResponse
    {
        public Guid Id { get; set; }
        public decimal TotalPrice { get; set; }
        public List<PackingItemResponse> Items { get; set; } = new();
    }

    /// <summary>
    /// آیتم بسته‌بندی - Response
    /// </summary>
    public class PackingItemResponse
    {
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }

    /// <summary>
    /// اطلاعات راننده در سفارش
    /// </summary>
    public class DriverInfoResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string VehicleType { get; set; } = string.Empty;
        public string LicensePlate { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public string? AvatarUrl { get; set; }
    }

    /// <summary>
    /// پاسخ محاسبه قیمت
    /// </summary>
    public class PriceEstimateResponse
    {
        public decimal BasePrice { get; set; }
        public decimal PackingPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal? DiscountAmount { get; set; }
        public decimal FinalPrice { get; set; }
        
        public PriceBreakdown Breakdown { get; set; } = null!;
    }

    /// <summary>
    /// جزئیات قیمت
    /// </summary>
    public class PriceBreakdown
    {
        public decimal DistancePrice { get; set; }
        public decimal FloorPrice { get; set; }
        public decimal ItemsPrice { get; set; }
        public decimal PackingPrice { get; set; }
        public decimal ExtraServices { get; set; }
    }
}
