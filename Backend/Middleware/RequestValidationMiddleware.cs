using System.Text.RegularExpressions;

namespace BarbariBahar.API.Middleware
{
    /// <summary>
    /// Middleware برای اعتبارسنجی درخواست‌ها و جلوگیری از حملات
    /// </summary>
    public class RequestValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestValidationMiddleware> _logger;
        private static readonly Regex SqlInjectionPattern = new Regex(
            @"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|SCRIPT|UNION)\b)|(-{2})|(/\*)|(\*/)|(\bOR\b\s+\d+\s*=\s*\d+)|(\bAND\b\s+\d+\s*=\s*\d+)",
            RegexOptions.IgnoreCase | RegexOptions.Compiled);

        private static readonly Regex XssPattern = new Regex(
            @"<script|javascript:|onerror=|onload=|<iframe|eval\(|expression\(|vbscript:",
            RegexOptions.IgnoreCase | RegexOptions.Compiled);

        private const int MaxRequestSize = 20 * 1024 * 1024; // 20 MB
        private const int MaxUrlLength = 2048;
        private const int MaxHeaderValueLength = 8192;

        public RequestValidationMiddleware(
            RequestDelegate next,
            ILogger<RequestValidationMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // 1. بررسی طول URL
                if (context.Request.Path.Value?.Length > MaxUrlLength)
                {
                    _logger.LogWarning("Request URL too long: {Path}", context.Request.Path);
                    context.Response.StatusCode = StatusCodes.Status414UriTooLong;
                    await context.Response.WriteAsJsonAsync(new { message = "URL بیش از حد طولانی است" });
                    return;
                }

                // 2. بررسی Method های مجاز
                var allowedMethods = new[] { "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS" };
                if (!allowedMethods.Contains(context.Request.Method.ToUpper()))
                {
                    _logger.LogWarning("Invalid HTTP method: {Method}", context.Request.Method);
                    context.Response.StatusCode = StatusCodes.Status405MethodNotAllowed;
                    await context.Response.WriteAsJsonAsync(new { message = "متد HTTP مجاز نیست" });
                    return;
                }

                // 3. بررسی Content-Length
                if (context.Request.ContentLength > MaxRequestSize)
                {
                    _logger.LogWarning("Request body too large: {Size}", context.Request.ContentLength);
                    context.Response.StatusCode = StatusCodes.Status413PayloadTooLarge;
                    await context.Response.WriteAsJsonAsync(new { message = "حجم درخواست بیش از حد مجاز است" });
                    return;
                }

                // 4. بررسی Headers
                foreach (var header in context.Request.Headers)
                {
                    if (header.Value.ToString().Length > MaxHeaderValueLength)
                    {
                        _logger.LogWarning("Header value too long: {Header}", header.Key);
                        context.Response.StatusCode = StatusCodes.Status400BadRequest;
                        await context.Response.WriteAsJsonAsync(new { message = "مقدار Header نامعتبر است" });
                        return;
                    }

                    // بررسی XSS در Headers
                    if (XssPattern.IsMatch(header.Value.ToString()))
                    {
                        _logger.LogWarning("Potential XSS in header {Header}: {Value}", header.Key, header.Value);
                        context.Response.StatusCode = StatusCodes.Status400BadRequest;
                        await context.Response.WriteAsJsonAsync(new { message = "درخواست نامعتبر است" });
                        return;
                    }
                }

                // 5. بررسی Query String
                if (context.Request.QueryString.HasValue)
                {
                    var queryString = context.Request.QueryString.Value ?? "";

                    // بررسی SQL Injection
                    if (SqlInjectionPattern.IsMatch(queryString))
                    {
                        _logger.LogWarning("Potential SQL Injection in query string: {QueryString}", queryString);
                        context.Response.StatusCode = StatusCodes.Status400BadRequest;
                        await context.Response.WriteAsJsonAsync(new { message = "درخواست نامعتبر است" });
                        return;
                    }

                    // بررسی XSS
                    if (XssPattern.IsMatch(queryString))
                    {
                        _logger.LogWarning("Potential XSS in query string: {QueryString}", queryString);
                        context.Response.StatusCode = StatusCodes.Status400BadRequest;
                        await context.Response.WriteAsJsonAsync(new { message = "درخواست نامعتبر است" });
                        return;
                    }
                }

                // 6. بررسی Path Traversal
                if (context.Request.Path.Value?.Contains("..") == true ||
                    context.Request.Path.Value?.Contains("~") == true)
                {
                    _logger.LogWarning("Potential path traversal attempt: {Path}", context.Request.Path);
                    context.Response.StatusCode = StatusCodes.Status400BadRequest;
                    await context.Response.WriteAsJsonAsync(new { message = "مسیر نامعتبر است" });
                    return;
                }

                // 7. بررسی User-Agent
                if (!context.Request.Headers.ContainsKey("User-Agent"))
                {
                    _logger.LogWarning("Missing User-Agent header from {IP}", context.Connection.RemoteIpAddress);
                }

                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in RequestValidationMiddleware");
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await context.Response.WriteAsJsonAsync(new { message = "خطا در پردازش درخواست" });
            }
        }
    }

    public static class RequestValidationMiddlewareExtensions
    {
        public static IApplicationBuilder UseRequestValidation(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RequestValidationMiddleware>();
        }
    }
}
