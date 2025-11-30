using System.Net;
using System.Text.Json;
using BarbariBahar.API.Models.ApiResponses;

namespace BarbariBahar.API.Middleware
{
    public class ExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlerMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionHandlerMiddleware(
            RequestDelegate next,
            ILogger<ExceptionHandlerMiddleware> logger,
            IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var errorResponse = new ErrorResponse
            {
                Message = "خطای سرور رخ داده است",
                Timestamp = DateTime.UtcNow
            };

            switch (exception)
            {
                case UnauthorizedAccessException:
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    errorResponse.Message = exception.Message;
                    errorResponse.StatusCode = context.Response.StatusCode;
                    break;

                case KeyNotFoundException:
                    context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    errorResponse.Message = exception.Message;
                    errorResponse.StatusCode = context.Response.StatusCode;
                    break;

                case ArgumentNullException:
                case ArgumentException:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorResponse.Message = exception.Message;
                    errorResponse.StatusCode = context.Response.StatusCode;
                    break;

                case InvalidOperationException:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorResponse.Message = exception.Message;
                    errorResponse.StatusCode = context.Response.StatusCode;
                    break;

                default:
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    errorResponse.StatusCode = context.Response.StatusCode;
                    
                    // در محیط Development جزئیات خطا را نمایش بده
                    if (_env.IsDevelopment())
                    {
                        errorResponse.Detail = exception.Message;
                        errorResponse.StackTrace = exception.StackTrace;
                    }
                    else
                    {
                        errorResponse.Message = "خطای داخلی سرور. لطفاً با پشتیبانی تماس بگیرید.";
                    }
                    break;
            }

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = _env.IsDevelopment()
            };

            var result = JsonSerializer.Serialize(errorResponse, options);
            await context.Response.WriteAsync(result);
        }
    }

    // Extension method برای راحتی استفاده
    public static class ExceptionHandlerMiddlewareExtensions
    {
        public static IApplicationBuilder UseCustomExceptionHandler(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionHandlerMiddleware>();
        }
    }
}