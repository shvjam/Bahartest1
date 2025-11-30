using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using BarbariBahar.API.DTOs.Auth;
using System.Security.Cryptography;

namespace BarbariBahar.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IJwtService _jwtService;
        private readonly ISmsService _smsService;
        private readonly IMemoryCache _cache;
        private readonly ILogger<AuthService> _logger;
        private readonly IConfiguration _configuration;
        private readonly IInputSanitizationService _sanitizationService;
        private readonly IAuditLogService _auditLogService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(
            AppDbContext context,
            IJwtService jwtService,
            ISmsService smsService,
            IMemoryCache cache,
            ILogger<AuthService> logger,
            IConfiguration configuration,
            IInputSanitizationService sanitizationService,
            IAuditLogService auditLogService,
            IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _jwtService = jwtService;
            _smsService = smsService;
            _cache = cache;
            _logger = logger;
            _configuration = configuration;
            _sanitizationService = sanitizationService;
            _auditLogService = auditLogService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<SendOtpResponse> SendOtpAsync(SendOtpRequest request)
        {
            var ipAddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            
            // Sanitize شماره تلفن
            var phoneNumber = _sanitizationService.SanitizePhoneNumber(request.PhoneNumber);

            // اعتبارسنجی
            if (!_sanitizationService.IsValidPhoneNumber(phoneNumber))
            {
                await _auditLogService.LogSecurityEventAsync(
                    "OTP_REQUEST_INVALID_PHONE",
                    $"Invalid phone: {request.PhoneNumber}",
                    ipAddress,
                    false);
                throw new ArgumentException("فرمت شماره موبایل نامعتبر است");
            }

            // بررسی Blacklist
            if (await IsPhoneNumberBlacklistedAsync(phoneNumber))
            {
                await _auditLogService.LogSecurityEventAsync(
                    "OTP_REQUEST_BLACKLISTED",
                    $"Blacklisted phone: {phoneNumber}",
                    ipAddress,
                    false);
                throw new InvalidOperationException("شماره شما در لیست سیاه قرار دارد");
            }

            // بررسی Rate Limiting
            var rateLimitKey = $"otp_rate_limit_{phoneNumber}";
            if (_cache.TryGetValue(rateLimitKey, out int attemptCount))
            {
                if (attemptCount >= 3)
                {
                    await _auditLogService.LogSecurityEventAsync(
                        "OTP_RATE_LIMIT_EXCEEDED",
                        $"Phone: {phoneNumber}",
                        ipAddress,
                        false);
                    throw new InvalidOperationException("تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً 5 دقیقه صبر کنید.");
                }
                _cache.Set(rateLimitKey, attemptCount + 1, TimeSpan.FromMinutes(5));
            }
            else
            {
                _cache.Set(rateLimitKey, 1, TimeSpan.FromMinutes(5));
            }

            // جستجو یا ایجاد کاربر
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);

            if (user == null)
            {
                user = new User
                {
                    Id = Guid.NewGuid(),
                    PhoneNumber = phoneNumber,
                    Role = UserRole.CUSTOMER,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
                
                await _auditLogService.LogActionAsync(
                    "USER_CREATED",
                    user.Id.ToString(),
                    $"Phone: {phoneNumber}",
                    ipAddress);
            }

            // تولید کد OTP
            var otpCode = GenerateSecureOtp();
            var expiresAt = DateTime.UtcNow.AddMinutes(2);

            // ذخیره OTP در Cache
            var otpKey = $"otp_{phoneNumber}";
            _cache.Set(otpKey, new OtpData
            {
                Code = otpCode,
                ExpiresAt = expiresAt,
                UserId = user.Id,
                AttemptCount = 0
            }, TimeSpan.FromMinutes(2));

            // ارسال SMS
            var isDevelopment = _configuration.GetValue<bool>("IsDevelopment", false);
            
            if (!isDevelopment)
            {
                try
                {
                    await _smsService.SendOtpAsync(phoneNumber, otpCode);
                    await _auditLogService.LogSecurityEventAsync(
                        "OTP_SENT",
                        $"Phone: {phoneNumber}",
                        ipAddress,
                        true);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send SMS to {PhoneNumber}", phoneNumber);
                    await _auditLogService.LogSecurityEventAsync(
                        "OTP_SMS_FAILED",
                        $"Phone: {phoneNumber}",
                        ipAddress,
                        false);
                    throw new InvalidOperationException("خطا در ارسال پیامک. لطفاً دوباره تلاش کنید.");
                }
            }
            else
            {
                _logger.LogInformation("OTP Code for {PhoneNumber}: {OtpCode} (Development Mode)", phoneNumber, otpCode);
            }

            return new SendOtpResponse
            {
                Message = "کد تایید برای شما ارسال شد",
                ExpiresAt = expiresAt,
                OtpCode = isDevelopment ? otpCode : null
            };
        }

        public async Task<AuthResponse> VerifyOtpAsync(VerifyOtpRequest request)
        {
            var ipAddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            
            var phoneNumber = _sanitizationService.SanitizePhoneNumber(request.PhoneNumber);
            var otpKey = $"otp_{phoneNumber}";

            // بررسی OTP در Cache
            if (!_cache.TryGetValue(otpKey, out OtpData? otpData) || otpData == null)
            {
                await _auditLogService.LogSecurityEventAsync(
                    "OTP_VERIFY_EXPIRED",
                    $"Phone: {phoneNumber}",
                    ipAddress,
                    false);
                throw new UnauthorizedAccessException("کد تایید منقضی شده یا نامعتبر است");
            }

            // بررسی تعداد تلاش‌ها
            if (otpData.AttemptCount >= 3)
            {
                _cache.Remove(otpKey);
                await _auditLogService.LogSecurityEventAsync(
                    "OTP_MAX_ATTEMPTS_EXCEEDED",
                    $"Phone: {phoneNumber}",
                    ipAddress,
                    false);
                throw new UnauthorizedAccessException("تعداد تلاش‌های شما بیش از حد مجاز است. لطفاً کد جدید درخواست کنید.");
            }

            if (otpData.ExpiresAt < DateTime.UtcNow)
            {
                _cache.Remove(otpKey);
                await _auditLogService.LogSecurityEventAsync(
                    "OTP_VERIFY_EXPIRED_TIME",
                    $"Phone: {phoneNumber}",
                    ipAddress,
                    false);
                throw new UnauthorizedAccessException("کد تایید منقضی شده است");
            }

            if (otpData.Code != request.OtpCode)
            {
                otpData.AttemptCount++;
                _cache.Set(otpKey, otpData, TimeSpan.FromMinutes(2));
                
                await _auditLogService.LogSecurityEventAsync(
                    "OTP_VERIFY_INVALID",
                    $"Phone: {phoneNumber}, Attempt: {otpData.AttemptCount}",
                    ipAddress,
                    false);
                throw new UnauthorizedAccessException("کد تایید اشتباه است");
            }

            // OTP معتبر است - حذف از Cache
            _cache.Remove(otpKey);

            // دریافت کاربر
            var user = await _context.Users
                .Include(u => u.Driver)
                .FirstOrDefaultAsync(u => u.Id == otpData.UserId);

            if (user == null || !user.IsActive)
            {
                await _auditLogService.LogSecurityEventAsync(
                    "OTP_USER_NOT_FOUND",
                    $"UserId: {otpData.UserId}",
                    ipAddress,
                    false);
                throw new UnauthorizedAccessException("کاربر یافت نشد یا غیرفعال است");
            }

            // به‌روزرسانی آخرین ورود
            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // ثبت لاگ موفق
            await _auditLogService.LogSecurityEventAsync(
                "LOGIN_SUCCESS",
                $"UserId: {user.Id}, Phone: {phoneNumber}",
                ipAddress,
                true);

            // تولید Tokens
            var accessToken = _jwtService.GenerateAccessToken(user);
            var refreshToken = await GenerateAndSaveRefreshToken(user.Id, ipAddress);

            var userDto = new UserDto
            {
                Id = user.Id,
                PhoneNumber = user.PhoneNumber,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString(),
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };

            return new AuthResponse
            {
                User = userDto,
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token,
                AccessTokenExpiry = DateTime.UtcNow.AddMinutes(60),
                RefreshTokenExpiry = refreshToken.ExpiresAt
            };
        }

        public async Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request)
        {
            // یافتن Refresh Token
            var storedToken = await _context.RefreshTokens
                .Include(rt => rt.User)
                    .ThenInclude(u => u.Driver)
                .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

            if (storedToken == null)
            {
                throw new UnauthorizedAccessException("توکن نامعتبر است");
            }

            if (storedToken.ExpiresAt < DateTime.UtcNow)
            {
                throw new UnauthorizedAccessException("توکن منقضی شده است");
            }

            if (storedToken.IsRevoked)
            {
                throw new UnauthorizedAccessException("توکن لغو شده است");
            }

            var user = storedToken.User;
            if (!user.IsActive)
            {
                throw new UnauthorizedAccessException("کاربر غیرفعال است");
            }

            // لغو توکن قبلی
            storedToken.RevokedAt = DateTime.UtcNow;
            storedToken.RevokedByIp = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            // تولید توکن جدید
            var accessToken = _jwtService.GenerateAccessToken(user);
            var newRefreshToken = await GenerateAndSaveRefreshToken(user.Id, _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "unknown");

            await _context.SaveChangesAsync();

            var userDto = new UserDto
            {
                Id = user.Id,
                PhoneNumber = user.PhoneNumber,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString(),
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };

            return new AuthResponse
            {
                User = userDto,
                AccessToken = accessToken,
                RefreshToken = newRefreshToken.Token,
                AccessTokenExpiry = DateTime.UtcNow.AddMinutes(60),
                RefreshTokenExpiry = newRefreshToken.ExpiresAt
            };
        }

        public async Task RevokeTokenAsync(RevokeTokenRequest request)
        {
            var token = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

            if (token != null && !token.IsRevoked)
            {
                token.RevokedAt = DateTime.UtcNow;
                token.RevokedByIp = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                await _context.SaveChangesAsync();
            }
        }

        public async Task<UserDto> GetUserByIdAsync(Guid userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                throw new KeyNotFoundException("کاربر یافت نشد");
            }

            return new UserDto
            {
                Id = user.Id,
                PhoneNumber = user.PhoneNumber,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString(),
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }

        // Private Helper Methods
        private async Task<bool> IsPhoneNumberBlacklistedAsync(string phoneNumber)
        {
            // اینجا می‌توانید چک کنید که شماره در Blacklist هست یا نه
            // مثلاً از دیتابیس یا Cache
            return false;
        }

        private string GenerateSecureOtp()
        {
            // استفاده از RNG برای امنیت بیشتر
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[4];
            rng.GetBytes(bytes);
            var randomNumber = Math.Abs(BitConverter.ToInt32(bytes, 0));
            return (randomNumber % 900000 + 100000).ToString();
        }

        private async Task<RefreshToken> GenerateAndSaveRefreshToken(Guid userId, string ipAddress)
        {
            var refreshToken = new RefreshToken
            {
                UserId = userId,
                Token = GenerateSecureRefreshToken(),
                ExpiresAt = DateTime.UtcNow.AddDays(30),
                CreatedAt = DateTime.UtcNow,
                CreatedByIp = ipAddress
            };

            await _context.RefreshTokens.AddAsync(refreshToken);
            return refreshToken;
        }

        private string GenerateSecureRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }

        // Internal class for OTP cache
        private class OtpData
        {
            public string Code { get; set; } = string.Empty;
            public DateTime ExpiresAt { get; set; }
            public Guid UserId { get; set; }
            public int AttemptCount { get; set; }
        }
    }
}