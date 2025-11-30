namespace BarbariBahar.API.Exceptions
{
    /// <summary>
    /// Base Exception برای اپلیکیشن
    /// </summary>
    public class AppException : Exception
    {
        public int StatusCode { get; set; }
        public List<string>? Errors { get; set; }

        public AppException(string message, int statusCode = 500) : base(message)
        {
            StatusCode = statusCode;
        }

        public AppException(string message, int statusCode, List<string> errors) : base(message)
        {
            StatusCode = statusCode;
            Errors = errors;
        }
    }

    /// <summary>
    /// خطای Not Found (404)
    /// </summary>
    public class NotFoundException : AppException
    {
        public NotFoundException(string message) : base(message, 404)
        {
        }

        public NotFoundException(string entityName, object key)
            : base($"{entityName} با شناسه {key} یافت نشد", 404)
        {
        }
    }

    /// <summary>
    /// خطای Bad Request (400)
    /// </summary>
    public class BadRequestException : AppException
    {
        public BadRequestException(string message) : base(message, 400)
        {
        }

        public BadRequestException(string message, List<string> errors)
            : base(message, 400, errors)
        {
        }
    }

    /// <summary>
    /// خطای Unauthorized (401)
    /// </summary>
    public class UnauthorizedException : AppException
    {
        public UnauthorizedException(string message = "شما مجاز به انجام این عملیات نیستید")
            : base(message, 401)
        {
        }
    }

    /// <summary>
    /// خطای Forbidden (403)
    /// </summary>
    public class ForbiddenException : AppException
    {
        public ForbiddenException(string message = "دسترسی غیرمجاز")
            : base(message, 403)
        {
        }
    }

    /// <summary>
    /// خطای Conflict (409)
    /// </summary>
    public class ConflictException : AppException
    {
        public ConflictException(string message) : base(message, 409)
        {
        }
    }

    /// <summary>
    /// خطای Validation (422)
    /// </summary>
    public class ValidationException : AppException
    {
        public Dictionary<string, List<string>> ValidationErrors { get; set; }

        public ValidationException(Dictionary<string, List<string>> validationErrors)
            : base("خطای اعتبارسنجی", 422)
        {
            ValidationErrors = validationErrors;
        }

        public ValidationException(string field, string error)
            : base("خطای اعتبارسنجی", 422)
        {
            ValidationErrors = new Dictionary<string, List<string>>
            {
                { field, new List<string> { error } }
            };
        }
    }

    /// <summary>
    /// خطای سرور داخلی (500)
    /// </summary>
    public class InternalServerException : AppException
    {
        public InternalServerException(string message = "خطای داخلی سرور")
            : base(message, 500)
        {
        }

        public InternalServerException(string message, Exception innerException)
            : base(message, 500)
        {
        }
    }
}
