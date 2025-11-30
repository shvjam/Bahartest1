using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.DTOs.Auth
{
    // ============================================
    // REQUEST DTOs
    // ============================================

    /// <summary>
    /// درخواست ارسال OTP
    /// </summary>
    public class SendOtpRequest
    {
        [Required(ErrorMessage = "شماره موبایل الزامی است")]
        [Phone(ErrorMessage = "فرمت شماره موبایل نامعتبر است")]
        [RegularExpression(@"^09\d{9}$", ErrorMessage = "شماره موبایل باید با 09 شروع شود و 11 رقم باشد")]
        public string PhoneNumber { get; set; } = string.Empty;
    }

    /// <summary>
    /// درخواست تایید OTP
    /// </summary>
    public class VerifyOtpRequest
    {
        [Required(ErrorMessage = "شماره موبایل الزامی است")]
        [Phone(ErrorMessage = "فرمت شماره موبایل نامعتبر است")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "کد تایید الزامی است")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "کد تایید باید 6 رقم باشد")]
        public string OtpCode { get; set; } = string.Empty;
    }

    /// <summary>
    /// درخواست Refresh Token
    /// </summary>
    public class RefreshTokenRequest
    {
        [Required(ErrorMessage = "Refresh Token الزامی است")]
        public string RefreshToken { get; set; } = string.Empty;
    }

    /// <summary>
    /// درخواست Revoke Token
    /// </summary>
    public class RevokeTokenRequest
    {
        [Required(ErrorMessage = "Refresh Token الزامی است")]
        public string RefreshToken { get; set; } = string.Empty;
    }

    // ============================================
    // RESPONSE DTOs
    // ============================================

    /// <summary>
    /// پاسخ موفق Authentication
    /// </summary>
    public class AuthResponse
    {
        public UserDto User { get; set; } = null!;
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime AccessTokenExpiry { get; set; }
        public DateTime RefreshTokenExpiry { get; set; }
    }

    /// <summary>
    /// اطلاعات کاربر برای Response
    /// </summary>
    public class UserDto
    {
        public Guid Id { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// پاسخ ارسال OTP
    /// </summary>
    public class SendOtpResponse
    {
        public string Message { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        
        // فقط در Development
        public string? OtpCode { get; set; }
    }
}
