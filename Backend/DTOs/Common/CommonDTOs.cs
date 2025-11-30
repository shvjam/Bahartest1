using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.Common
{
    // ============================================
    // SERVICE DTOs
    // ============================================

    public class ServiceCategoryResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string ServiceType { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateServiceCategoryRequest
    {
        [Required(ErrorMessage = "نام الزامی است")]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        public string ServiceType { get; set; } = string.Empty;

        public string? IconUrl { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    // ============================================
    // CATALOG DTOs
    // ============================================

    public class CatalogCategoryResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? IconUrl { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public int ItemsCount { get; set; }
    }

    public class CatalogItemResponse
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal BasePrice { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class CreateCatalogItemRequest
    {
        [Required]
        public Guid CategoryId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal BasePrice { get; set; }

        public string? ImageUrl { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    // ============================================
    // PACKING DTOs
    // ============================================

    public class PackingProductResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal UnitPrice { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class CreatePackingProductRequest
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal UnitPrice { get; set; }

        public string? ImageUrl { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    // ============================================
    // PRICING DTOs
    // ============================================

    public class PricingConfigResponse
    {
        public Guid Id { get; set; }
        public string ServiceType { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public decimal PricePerKm { get; set; }
        public decimal PricePerFloor { get; set; }
        public bool IsActive { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class UpdatePricingConfigRequest
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal BasePrice { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal PricePerKm { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal PricePerFloor { get; set; }

        public bool IsActive { get; set; } = true;
    }

    // ============================================
    // NOTIFICATION DTOs
    // ============================================

    public class NotificationResponse
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid? RelatedEntityId { get; set; }
    }

    public class CreateNotificationRequest
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        public string Type { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Message { get; set; } = string.Empty;

        public Guid? RelatedEntityId { get; set; }
    }

    // ============================================
    // DISCOUNT DTOs
    // ============================================

    public class DiscountCodeResponse
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string DiscountType { get; set; } = string.Empty;
        public decimal DiscountValue { get; set; }
        public decimal? MaxDiscountAmount { get; set; }
        public decimal? MinOrderAmount { get; set; }
        public int? MaxUsageCount { get; set; }
        public int UsedCount { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidUntil { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateDiscountCodeRequest
    {
        [Required]
        [StringLength(50)]
        public string Code { get; set; } = string.Empty;

        [Required]
        public string DiscountType { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal DiscountValue { get; set; }

        public decimal? MaxDiscountAmount { get; set; }
        public decimal? MinOrderAmount { get; set; }
        public int? MaxUsageCount { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidUntil { get; set; }
        public bool IsActive { get; set; } = true;
    }

    // ============================================
    // DASHBOARD DTOs
    // ============================================

    public class DashboardStatsResponse
    {
        public int TotalOrders { get; set; }
        public int PendingOrders { get; set; }
        public int InProgressOrders { get; set; }
        public int CompletedOrders { get; set; }
        public int CancelledOrders { get; set; }
        
        public int TotalUsers { get; set; }
        public int ActiveDrivers { get; set; }
        public int AvailableDrivers { get; set; }
        
        public decimal TodayRevenue { get; set; }
        public decimal MonthRevenue { get; set; }
        public decimal TotalRevenue { get; set; }
        
        public List<RecentOrderResponse> RecentOrders { get; set; } = new();
    }

    public class RecentOrderResponse
    {
        public Guid Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public decimal FinalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // ============================================
    // FILE UPLOAD DTOs
    // ============================================

    public class FileUploadResponseDto
    {
        public string FileName { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string ContentType { get; set; } = string.Empty;
    }
}