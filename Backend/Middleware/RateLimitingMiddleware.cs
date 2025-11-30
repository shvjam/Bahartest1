using Microsoft.Extensions.Caching.Memory;
using System.Collections.Concurrent;

namespace BarbariBahar.API.Middleware
{
    /// <summary>
    /// Middleware برای محدود کردن تعداد درخواست‌ها (Rate Limiting)
    /// </summary>
    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IMemoryCache _cache;
        private readonly ILogger<RateLimitingMiddleware> _logger;
        private static readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new();

        // تنظیمات Rate Limiting
        private readonly RateLimitOptions _options = new()
        {
            GeneralRequests = new RateLimitRule { Limit = 100, WindowSeconds = 60 }, // 100 درخواست در دقیقه
            AuthRequests = new RateLimitRule { Limit = 5, WindowSeconds = 60 },      // 5 درخواست در دقیقه
            LoginRequests = new RateLimitRule { Limit = 5, WindowSeconds = 300 },    // 5 درخواست در 5 دقیقه
            ApiRequests = new RateLimitRule { Limit = 1000, WindowSeconds = 3600 },  // 1000 درخواست در ساعت
        };

        public RateLimitingMiddleware(
            RequestDelegate next,
            IMemoryCache cache,
            ILogger<RateLimitingMiddleware> logger)
        {
            _next = next;
            _cache = cache;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var clientId = GetClientIdentifier(context);
            var endpoint = GetEndpointCategory(context);

            var rule = GetRateLimitRule(endpoint);

            if (!await CheckRateLimit(clientId, endpoint, rule))
            {
                _logger.LogWarning(
                    "Rate limit exceeded for {ClientId} on {Endpoint}",
                    clientId,
                    endpoint);

                context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                context.Response.Headers.Add("Retry-After", rule.WindowSeconds.ToString());
                
                await context.Response.WriteAsJsonAsync(new
                {
                    message = "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً چند لحظه صبر کنید.",
                    retryAfter = rule.WindowSeconds
                });
                
                return;
            }

            await _next(context);
        }

        private string GetClientIdentifier(HttpContext context)
        {
            // ترکیب IP و User-Agent برای شناسایی بهتر
            var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var userAgent = context.Request.Headers["User-Agent"].ToString();
            var userAgentHash = string.IsNullOrEmpty(userAgent) 
                ? "no-agent" 
                : Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(userAgent)).Substring(0, 10);

            // اگر کاربر لاگین کرده، از userId استفاده کن
            var userId = context.User?.FindFirst("userId")?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                return $"user_{userId}";
            }

            return $"ip_{ip}_{userAgentHash}";
        }

        private string GetEndpointCategory(HttpContext context)
        {
            var path = context.Request.Path.Value?.ToLower() ?? "";

            if (path.StartsWith("/api/auth/send-otp") || path.StartsWith("/api/auth/verify-otp"))
                return "auth";
            
            if (path.StartsWith("/api/auth"))
                return "login";
            
            if (path.StartsWith("/api/"))
                return "api";

            return "general";
        }

        private RateLimitRule GetRateLimitRule(string endpoint)
        {
            return endpoint switch
            {
                "auth" => _options.AuthRequests,
                "login" => _options.LoginRequests,
                "api" => _options.ApiRequests,
                _ => _options.GeneralRequests
            };
        }

        private async Task<bool> CheckRateLimit(string clientId, string endpoint, RateLimitRule rule)
        {
            var key = $"ratelimit_{endpoint}_{clientId}";
            var lockKey = $"lock_{key}";

            // استفاده از Lock برای Thread-Safety
            var semaphore = _locks.GetOrAdd(lockKey, _ => new SemaphoreSlim(1, 1));
            
            await semaphore.WaitAsync();
            try
            {
                if (!_cache.TryGetValue(key, out RequestCounter counter))
                {
                    counter = new RequestCounter
                    {
                        Count = 1,
                        WindowStart = DateTime.UtcNow
                    };
                    
                    var cacheOptions = new MemoryCacheEntryOptions()
                        .SetAbsoluteExpiration(TimeSpan.FromSeconds(rule.WindowSeconds));
                    
                    _cache.Set(key, counter, cacheOptions);
                    return true;
                }

                // بررسی اینکه آیا Window منقضی شده
                if (DateTime.UtcNow - counter.WindowStart > TimeSpan.FromSeconds(rule.WindowSeconds))
                {
                    counter.Count = 1;
                    counter.WindowStart = DateTime.UtcNow;
                    _cache.Set(key, counter);
                    return true;
                }

                // بررسی محدودیت
                if (counter.Count >= rule.Limit)
                {
                    return false;
                }

                counter.Count++;
                _cache.Set(key, counter);
                return true;
            }
            finally
            {
                semaphore.Release();
            }
        }

        private class RequestCounter
        {
            public int Count { get; set; }
            public DateTime WindowStart { get; set; }
        }

        private class RateLimitRule
        {
            public int Limit { get; set; }
            public int WindowSeconds { get; set; }
        }

        private class RateLimitOptions
        {
            public RateLimitRule GeneralRequests { get; set; } = new();
            public RateLimitRule AuthRequests { get; set; } = new();
            public RateLimitRule LoginRequests { get; set; } = new();
            public RateLimitRule ApiRequests { get; set; } = new();
        }
    }

    public static class RateLimitingMiddlewareExtensions
    {
        public static IApplicationBuilder UseCustomRateLimiting(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RateLimitingMiddleware>();
        }
    }
}
