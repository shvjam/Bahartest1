using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.User
{
    // ============================================
    // REQUEST DTOs
    // ============================================

    /// <summary>
    /// درخواست به‌روزرسانی پروفایل
    /// </summary>
    public class UpdateProfileRequest
    {
        [StringLength(100, ErrorMessage = "نام نباید بیشتر از 100 کاراکتر باشد")]
        public string? FullName { get; set; }

        [EmailAddress(ErrorMessage = "فرمت ایمیل نامعتبر است")]
        public string? Email { get; set; }

        public string? AvatarUrl { get; set; }
    }

    /// <summary>
    /// درخواست ایجاد آدرس
    /// </summary>
    public class CreateAddressRequest
    {
        [Required(ErrorMessage = "عنوان الزامی است")]
        [StringLength(100, ErrorMessage = "عنوان نباید بیشتر از 100 کاراکتر باشد")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "آدرس الزامی است")]
        [StringLength(500, ErrorMessage = "آدرس نباید بیشتر از 500 کاراکتر باشد")]
        public string FullAddress { get; set; } = string.Empty;

        [Required(ErrorMessage = "عرض جغرافیایی الزامی است")]
        [Range(-90, 90, ErrorMessage = "عرض جغرافیایی باید بین -90 تا 90 باشد")]
        public decimal Latitude { get; set; }

        [Required(ErrorMessage = "طول جغرافیایی الزامی است")]
        [Range(-180, 180, ErrorMessage = "طول جغرافیایی باید بین -180 تا 180 باشد")]
        public decimal Longitude { get; set; }

        public string? BuildingNo { get; set; }
        public string? Unit { get; set; }
        public string? PostalCode { get; set; }
        public string? Description { get; set; }
        public bool IsDefault { get; set; } = false;
    }

    /// <summary>
    /// درخواست به‌روزرسانی آدرس
    /// </summary>
    public class UpdateAddressRequest : CreateAddressRequest
    {
        [Required(ErrorMessage = "شناسه آدرس الزامی است")]
        public Guid Id { get; set; }
    }

    // ============================================
    // RESPONSE DTOs
    // ============================================

    /// <summary>
    /// اطلاعات کامل کاربر
    /// </summary>
    public class UserResponse
    {
        public Guid Id { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? AvatarUrl { get; set; }
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
        
        // اطلاعات اضافی
        public int TotalOrders { get; set; }
        public int CompletedOrders { get; set; }
    }

    /// <summary>
    /// اطلاعات آدرس
    /// </summary>
    public class AddressResponse
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string FullAddress { get; set; } = string.Empty;
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string? BuildingNo { get; set; }
        public string? Unit { get; set; }
        public string? PostalCode { get; set; }
        public string? Description { get; set; }
        public bool IsDefault { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// لیست ساده کاربران (برای Admin)
    /// </summary>
    public class UserListItemResponse
    {
        public Guid Id { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
    }
}
