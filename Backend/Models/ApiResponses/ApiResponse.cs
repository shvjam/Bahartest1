namespace BarbariBahar.API.Models.ApiResponses
{
    /// <summary>
    /// ساختار استاندارد پاسخ API
    /// </summary>
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // سازنده‌های کمکی
        public static ApiResponse<T> SuccessResponse(T data, string message = "عملیات با موفقیت انجام شد")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data,
                Timestamp = DateTime.UtcNow
            };
        }

        public static ApiResponse<T> ErrorResponse(string message, List<string>? errors = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Errors = errors,
                Timestamp = DateTime.UtcNow
            };
        }

        public static ApiResponse<T> ErrorResponse(string message, string error)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Errors = new List<string> { error },
                Timestamp = DateTime.UtcNow
            };
        }
        
        public static ApiResponse<T> Failure(string message, List<string>? errors = null)
        {
            return ErrorResponse(message, errors);
        }
    }

    /// <summary>
    /// پاسخ بدون Data
    /// </summary>
    public class ApiResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public object? Data { get; set; }
        public List<string>? Errors { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        
        public static ApiResponse SuccessResponse(string message = "عملیات با موفقیت انجام شد")
        {
            return new ApiResponse
            {
                Success = true,
                Message = message,
                Timestamp = DateTime.UtcNow
            };
        }

        public static ApiResponse ErrorResponse(string message, List<string>? errors = null)
        {
            return new ApiResponse
            {
                Success = false,
                Message = message,
                Errors = errors,
                Timestamp = DateTime.UtcNow
            };
        }

        public static ApiResponse ErrorResponse(string message, string error)
        {
            return new ApiResponse
            {
                Success = false,
                Message = message,
                Errors = new List<string> { error },
                Timestamp = DateTime.UtcNow
            };
        }
        
        public static ApiResponse Failure(string message, List<string>? errors = null)
        {
            return ErrorResponse(message, errors);
        }
        
        public static ApiResponse<T> Failure<T>(string message, List<string>? errors = null)
        {
            return ApiResponse<T>.ErrorResponse(message, errors);
        }
    }
}
