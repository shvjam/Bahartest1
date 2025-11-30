using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BarbariBahar.API.DTOs.Auth;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IAuthService authService,
            ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// ارسال کد OTP به شماره موبایل
        /// </summary>
        [HttpPost("send-otp")]
        [ProducesResponseType(typeof(SendOtpResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "داده‌های ورودی نامعتبر است", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _authService.SendOtpAsync(request);
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid phone number format: {PhoneNumber}", request.PhoneNumber);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending OTP to {PhoneNumber}", request.PhoneNumber);
                return StatusCode(500, new { message = "خطا در ارسال کد تایید. لطفاً دوباره تلاش کنید." });
            }
        }

        /// <summary>
        /// تایید کد OTP و ورود کاربر
        /// </summary>
        [HttpPost("verify-otp")]
        [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "داده‌های ورودی نامعتبر است", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _authService.VerifyOtpAsync(request);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Invalid OTP for {PhoneNumber}", request.PhoneNumber);
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying OTP for {PhoneNumber}", request.PhoneNumber);
                return StatusCode(500, new { message = "خطا در تایید کد. لطفاً دوباره تلاش کنید." });
            }
        }

        /// <summary>
        /// تمدید توکن با استفاده از Refresh Token
        /// </summary>
        [HttpPost("refresh")]
        [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Refresh Token الزامی است" });
                }

                var response = await _authService.RefreshTokenAsync(request);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Invalid refresh token");
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error refreshing token");
                return StatusCode(500, new { message = "خطا در تمدید توکن" });
            }
        }

        /// <summary>
        /// لغو Refresh Token (خروج از حساب)
        /// </summary>
        [Authorize]
        [HttpPost("revoke")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RevokeToken([FromBody] RevokeTokenRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Refresh Token الزامی است" });
                }

                await _authService.RevokeTokenAsync(request);
                return Ok(new { message = "خروج از حساب با موفقیت انجام شد" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error revoking token");
                return StatusCode(500, new { message = "خطا در خروج از حساب" });
            }
        }

        /// <summary>
        /// دریافت اطلاعات کاربر فعلی
        /// </summary>
        [Authorize]
        [HttpGet("me")]
        [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
                {
                    return Unauthorized(new { message = "کاربر یافت نشد" });
                }

                var user = await _authService.GetUserByIdAsync(userGuid);
                return Ok(user);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "User not found");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current user");
                return StatusCode(500, new { message = "خطا در دریافت اطلاعات کاربر" });
            }
        }
    }
}
