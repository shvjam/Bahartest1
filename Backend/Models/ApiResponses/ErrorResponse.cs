namespace BarbariBahar.API.Models.ApiResponses
{
    /// <summary>
    /// مدل پاسخ خطا
    /// </summary>
    public class ErrorResponse
    {
        public string Message { get; set; } = string.Empty;
        public string? Detail { get; set; }
        public List<string>? Errors { get; set; }
        public string? StackTrace { get; set; }
        public int StatusCode { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public ErrorResponse()
        {
        }

        public ErrorResponse(int statusCode, string message, string? detail = null)
        {
            StatusCode = statusCode;
            Message = message;
            Detail = detail;
        }
    }

    /// <summary>
    /// خطاهای Validation
    /// </summary>
    public class ValidationErrorResponse : ErrorResponse
    {
        public Dictionary<string, List<string>> ValidationErrors { get; set; } = new();

        public ValidationErrorResponse(Dictionary<string, List<string>> errors)
        {
            StatusCode = 400;
            Message = "خطای اعتبارسنجی";
            ValidationErrors = errors;
        }
    }
}
