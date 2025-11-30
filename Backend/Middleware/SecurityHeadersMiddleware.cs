namespace BarbariBahar.API.Middleware
{
    /// <summary>
    /// Middleware برای افزودن Security Headers به تمام Response ها
    /// </summary>
    public class SecurityHeadersMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<SecurityHeadersMiddleware> _logger;
        private readonly bool _isDevelopment;

        public SecurityHeadersMiddleware(
            RequestDelegate next,
            ILogger<SecurityHeadersMiddleware> logger,
            IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _isDevelopment = env.IsDevelopment();
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Security Headers
            AddSecurityHeaders(context);

            await _next(context);
        }

        private void AddSecurityHeaders(HttpContext context)
        {
            var headers = context.Response.Headers;

            // X-Content-Type-Options: جلوگیری از MIME Type Sniffing
            if (!headers.ContainsKey("X-Content-Type-Options"))
            {
                headers.Add("X-Content-Type-Options", "nosniff");
            }

            // X-Frame-Options: جلوگیری از Clickjacking
            if (!headers.ContainsKey("X-Frame-Options"))
            {
                headers.Add("X-Frame-Options", "DENY");
            }

            // X-XSS-Protection: فعال‌سازی XSS Filter مرورگر
            if (!headers.ContainsKey("X-XSS-Protection"))
            {
                headers.Add("X-XSS-Protection", "1; mode=block");
            }

            // Referrer-Policy: کنترل اطلاعات Referrer
            if (!headers.ContainsKey("Referrer-Policy"))
            {
                headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
            }

            // Content-Security-Policy: محافظت در برابر XSS و Injection
            if (!headers.ContainsKey("Content-Security-Policy"))
            {
                var csp = _isDevelopment
                    ? "default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:; font-src 'self' data:;"
                    : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';";
                
                headers.Add("Content-Security-Policy", csp);
            }

            // Permissions-Policy: محدود کردن دسترسی به Feature های مرورگر
            if (!headers.ContainsKey("Permissions-Policy"))
            {
                headers.Add("Permissions-Policy", 
                    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()");
            }

            // Strict-Transport-Security (HSTS): اجبار استفاده از HTTPS
            if (!_isDevelopment && !headers.ContainsKey("Strict-Transport-Security"))
            {
                headers.Add("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
            }

            // X-Powered-By: حذف اطلاعات تکنولوژی سرور
            headers.Remove("X-Powered-By");
            headers.Remove("Server");

            // Cache-Control برای صفحات حساس
            if (context.Request.Path.StartsWithSegments("/api/auth") || 
                context.Request.Path.StartsWithSegments("/api/users"))
            {
                if (!headers.ContainsKey("Cache-Control"))
                {
                    headers.Add("Cache-Control", "no-store, no-cache, must-revalidate, private");
                    headers.Add("Pragma", "no-cache");
                    headers.Add("Expires", "0");
                }
            }
        }
    }

    public static class SecurityHeadersMiddlewareExtensions
    {
        public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<SecurityHeadersMiddleware>();
        }
    }
}
