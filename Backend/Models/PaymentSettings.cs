namespace BarbariBahar.API.Models
{
    /// <summary>
    /// تنظیمات درگاه پرداخت ZarinPal
    /// </summary>
    public class PaymentSettings
    {
        public string MerchantId { get; set; } = string.Empty;
        public string PaymentUrl { get; set; } = "https://payment.zarinpal.com/pg/v4/payment/request.json";
        public string VerifyUrl { get; set; } = "https://payment.zarinpal.com/pg/v4/payment/verify.json";
        public string StartPaymentUrl { get; set; } = "https://payment.zarinpal.com/pg/StartPay/";
        public string CallbackUrl { get; set; } = string.Empty;
        public bool IsSandbox { get; set; } = false;
        public string Currency { get; set; } = "IRT"; // Toman
    }

    /// <summary>
    /// نتیجه درخواست پرداخت
    /// </summary>
    public class PaymentRequestResult
    {
        public bool Success { get; set; }
        public string? Authority { get; set; }
        public string? PaymentUrl { get; set; }
        public string? ErrorMessage { get; set; }
        public int? ErrorCode { get; set; }
    }

    /// <summary>
    /// نتیجه تایید پرداخت
    /// </summary>
    public class PaymentVerifyResult
    {
        public bool Success { get; set; }
        public long? RefId { get; set; }
        public string? ErrorMessage { get; set; }
        public int? ErrorCode { get; set; }
        public decimal? Amount { get; set; }
    }

    /// <summary>
    /// درخواست پرداخت
    /// </summary>
    public class PaymentRequest
    {
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? Mobile { get; set; }
        public string? Email { get; set; }
        public Guid OrderId { get; set; }
    }
}
