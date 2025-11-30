using System.Text.RegularExpressions;
using System.Web;

namespace BarbariBahar.API.Services
{
    public interface IInputSanitizationService
    {
        string SanitizeString(string input);
        string SanitizePhoneNumber(string phoneNumber);
        string SanitizeEmail(string email);
        bool IsValidPhoneNumber(string phoneNumber);
        bool IsValidEmail(string email);
        bool ContainsSqlInjection(string input);
        bool ContainsXss(string input);
    }

    /// <summary>
    /// سرویس برای Sanitize کردن و اعتبارسنجی ورودی‌های کاربر
    /// </summary>
    public class InputSanitizationService : IInputSanitizationService
    {
        private static readonly Regex PhoneRegex = new(
            @"^09\d{9}$",
            RegexOptions.Compiled);

        private static readonly Regex EmailRegex = new(
            @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
            RegexOptions.Compiled | RegexOptions.IgnoreCase);

        private static readonly Regex SqlInjectionRegex = new(
            @"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|SCRIPT|UNION|DECLARE|CAST|CONVERT)\b)|(-{2})|(/\*)|(\*/)|(\bOR\b\s+\d+\s*=\s*\d+)|(\bAND\b\s+\d+\s*=\s*\d+)|(;)|(\bxp_)|(\bsp_)",
            RegexOptions.IgnoreCase | RegexOptions.Compiled);

        private static readonly Regex XssRegex = new(
            @"<script|</script|javascript:|onerror=|onload=|onclick=|onmouseover=|<iframe|eval\(|expression\(|vbscript:|data:text/html|<object|<embed",
            RegexOptions.IgnoreCase | RegexOptions.Compiled);

        private readonly ILogger<InputSanitizationService> _logger;

        public InputSanitizationService(ILogger<InputSanitizationService> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// پاکسازی رشته از کاراکترهای خطرناک
        /// </summary>
        public string SanitizeString(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return input;

            // Encode HTML برای جلوگیری از XSS
            var sanitized = HttpUtility.HtmlEncode(input);

            // حذف کاراکترهای غیرقابل چاپ
            sanitized = Regex.Replace(sanitized, @"[^\u0020-\u007E\u0600-\u06FF\u200C\u200F]", "");

            // Trim فضاهای خالی
            sanitized = sanitized.Trim();

            return sanitized;
        }

        /// <summary>
        /// پاکسازی شماره موبایل
        /// </summary>
        public string SanitizePhoneNumber(string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
                return phoneNumber;

            // حذف تمام کاراکترها به جز اعداد
            var sanitized = Regex.Replace(phoneNumber, @"[^\d]", "");

            // اگر با 0 شروع نمی‌شود، اضافه کن
            if (!sanitized.StartsWith("0") && sanitized.Length == 10)
            {
                sanitized = "0" + sanitized;
            }

            // اگر با 98 شروع می‌شود، تبدیل به 0
            if (sanitized.StartsWith("98") && sanitized.Length == 12)
            {
                sanitized = "0" + sanitized.Substring(2);
            }

            // اگر با +98 شروع می‌شود
            if (sanitized.StartsWith("0098"))
            {
                sanitized = "0" + sanitized.Substring(4);
            }

            return sanitized;
        }

        /// <summary>
        /// پاکسازی ایمیل
        /// </summary>
        public string SanitizeEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return email;

            // تبدیل به lowercase و Trim
            var sanitized = email.Trim().ToLowerInvariant();

            // حذف کاراکترهای غیرمجاز
            sanitized = Regex.Replace(sanitized, @"[^a-z0-9.@_+-]", "");

            return sanitized;
        }

        /// <summary>
        /// اعتبارسنجی شماره موبایل ایران
        /// </summary>
        public bool IsValidPhoneNumber(string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
                return false;

            var sanitized = SanitizePhoneNumber(phoneNumber);
            return PhoneRegex.IsMatch(sanitized);
        }

        /// <summary>
        /// اعتبارسنجی ایمیل
        /// </summary>
        public bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            var sanitized = SanitizeEmail(email);
            return EmailRegex.IsMatch(sanitized);
        }

        /// <summary>
        /// بررسی وجود SQL Injection
        /// </summary>
        public bool ContainsSqlInjection(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return false;

            var contains = SqlInjectionRegex.IsMatch(input);
            
            if (contains)
            {
                _logger.LogWarning("Potential SQL Injection detected: {Input}", input.Substring(0, Math.Min(50, input.Length)));
            }

            return contains;
        }

        /// <summary>
        /// بررسی وجود XSS
        /// </summary>
        public bool ContainsXss(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return false;

            var contains = XssRegex.IsMatch(input);
            
            if (contains)
            {
                _logger.LogWarning("Potential XSS detected: {Input}", input.Substring(0, Math.Min(50, input.Length)));
            }

            return contains;
        }
    }
}
