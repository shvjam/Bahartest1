using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using BarbariBahar.API.Models;
using BarbariBahar.API.Services.Interfaces;
using BarbariBahar.API.Data;
using BarbariBahar.API.Enums;
using Microsoft.EntityFrameworkCore;

namespace BarbariBahar.API.Services
{
    /// <summary>
    /// سرویس پرداخت با ZarinPal
    /// </summary>
    public class PaymentService : IPaymentService
    {
        private readonly PaymentSettings _paymentSettings;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<PaymentService> _logger;
        private readonly AppDbContext _context;

        public PaymentService(
            IOptions<PaymentSettings> paymentSettings,
            IHttpClientFactory httpClientFactory,
            ILogger<PaymentService> logger,
            AppDbContext context)
        {
            _paymentSettings = paymentSettings.Value;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
            _context = context;
        }

        /// <summary>
        /// درخواست پرداخت جدید
        /// </summary>
        public async Task<PaymentRequestResult> RequestPaymentAsync(PaymentRequest request)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient();

                // تبدیل مبلغ به ریال (ZarinPal با ریال کار می‌کنه)
                var amountInRials = (long)(request.Amount * 10);

                var payload = new
                {
                    merchant_id = _paymentSettings.MerchantId,
                    amount = amountInRials,
                    description = request.Description,
                    callback_url = _paymentSettings.CallbackUrl,
                    metadata = new
                    {
                        mobile = request.Mobile ?? "",
                        email = request.Email ?? "",
                        order_id = request.OrderId.ToString()
                    }
                };

                var jsonContent = JsonSerializer.Serialize(payload);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                _logger.LogInformation("Requesting payment for order {OrderId}, amount: {Amount} Tomans",
                    request.OrderId, request.Amount);

                var response = await httpClient.PostAsync(_paymentSettings.PaymentUrl, content);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var result = JsonSerializer.Deserialize<ZarinPalResponse>(responseContent);

                    if (result?.data?.code == 100 || result?.data?.code == 101)
                    {
                        var authority = result.data.authority;
                        var paymentUrl = GetPaymentUrl(authority);

                        // ذخیره اطلاعات پرداخت در دیتابیس
                        var payment = new Payment
                        {
                            Id = Guid.NewGuid(),
                            OrderId = request.OrderId,
                            Amount = request.Amount,
                            PaymentMethod = PaymentMethod.ONLINE,
                            PaymentStatus = PaymentStatus.PENDING,
                            TransactionId = authority,
                            CreatedAt = DateTime.UtcNow
                        };

                        await _context.Payments.AddAsync(payment);
                        await _context.SaveChangesAsync();

                        _logger.LogInformation("Payment request successful. Authority: {Authority}", authority);

                        return new PaymentRequestResult
                        {
                            Success = true,
                            Authority = authority,
                            PaymentUrl = paymentUrl
                        };
                    }
                    else
                    {
                        _logger.LogError("Payment request failed. Code: {Code}, Message: {Message}",
                            result?.data?.code, result?.data?.message);

                        return new PaymentRequestResult
                        {
                            Success = false,
                            ErrorCode = result?.data?.code,
                            ErrorMessage = GetErrorMessage(result?.data?.code ?? 0)
                        };
                    }
                }
                else
                {
                    _logger.LogError("Payment request failed. Status: {StatusCode}, Response: {Response}",
                        response.StatusCode, responseContent);

                    return new PaymentRequestResult
                    {
                        Success = false,
                        ErrorMessage = "خطا در ارتباط با درگاه پرداخت"
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error requesting payment for order {OrderId}", request.OrderId);
                return new PaymentRequestResult
                {
                    Success = false,
                    ErrorMessage = "خطا در درخواست پرداخت"
                };
            }
        }

        /// <summary>
        /// تایید پرداخت
        /// </summary>
        public async Task<PaymentVerifyResult> VerifyPaymentAsync(string authority, decimal amount)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient();

                // تبدیل مبلغ به ریال
                var amountInRials = (long)(amount * 10);

                var payload = new
                {
                    merchant_id = _paymentSettings.MerchantId,
                    amount = amountInRials,
                    authority = authority
                };

                var jsonContent = JsonSerializer.Serialize(payload);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                _logger.LogInformation("Verifying payment. Authority: {Authority}, Amount: {Amount} Tomans",
                    authority, amount);

                var response = await httpClient.PostAsync(_paymentSettings.VerifyUrl, content);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var result = JsonSerializer.Deserialize<ZarinPalVerifyResponse>(responseContent);

                    if (result?.data?.code == 100 || result?.data?.code == 101)
                    {
                        // پرداخت موفق
                        _logger.LogInformation("Payment verified successfully. RefId: {RefId}", result.data.ref_id);

                        // به‌روزرسانی وضعیت پرداخت در دیتابیس
                        var payment = await _context.Payments
                            .FirstOrDefaultAsync(p => p.TransactionId == authority);

                        if (payment != null)
                        {
                            payment.PaymentStatus = PaymentStatus.COMPLETED;
                            payment.ReferenceNumber = result.data.ref_id.ToString();
                            payment.PaidAt = DateTime.UtcNow;
                            await _context.SaveChangesAsync();

                            // به‌روزرسانی وضعیت سفارش
                            var order = await _context.Orders.FindAsync(payment.OrderId);
                            if (order != null && order.Status == OrderStatus.PENDING_PAYMENT)
                            {
                                order.Status = OrderStatus.PENDING;
                                await _context.SaveChangesAsync();
                            }
                        }

                        return new PaymentVerifyResult
                        {
                            Success = true,
                            RefId = result.data.ref_id,
                            Amount = amount
                        };
                    }
                    else
                    {
                        _logger.LogWarning("Payment verification failed. Code: {Code}", result?.data?.code);

                        // به‌روزرسانی وضعیت پرداخت به ناموفق
                        var payment = await _context.Payments
                            .FirstOrDefaultAsync(p => p.TransactionId == authority);

                        if (payment != null)
                        {
                            payment.PaymentStatus = PaymentStatus.FAILED;
                            await _context.SaveChangesAsync();
                        }

                        return new PaymentVerifyResult
                        {
                            Success = false,
                            ErrorCode = result?.data?.code,
                            ErrorMessage = GetErrorMessage(result?.data?.code ?? 0)
                        };
                    }
                }
                else
                {
                    _logger.LogError("Payment verification request failed. Status: {StatusCode}",
                        response.StatusCode);

                    return new PaymentVerifyResult
                    {
                        Success = false,
                        ErrorMessage = "خطا در تایید پرداخت"
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying payment. Authority: {Authority}", authority);
                return new PaymentVerifyResult
                {
                    Success = false,
                    ErrorMessage = "خطا در تایید پرداخت"
                };
            }
        }

        /// <summary>
        /// دریافت URL پرداخت
        /// </summary>
        public string GetPaymentUrl(string authority)
        {
            if (_paymentSettings.IsSandbox)
            {
                return $"https://sandbox.zarinpal.com/pg/StartPay/{authority}";
            }
            return $"{_paymentSettings.StartPaymentUrl}{authority}";
        }

        /// <summary>
        /// تبدیل کد خطا به پیام فارسی
        /// </summary>
        private string GetErrorMessage(int errorCode)
        {
            return errorCode switch
            {
                -1 => "اطلاعات ارسال شده ناقص است",
                -2 => "IP یا مرچنت کد پذیرنده صحیح نیست",
                -3 => "با توجه به محدودیت‌های شاپرک امکان پرداخت با رقم درخواست شده میسر نمی‌باشد",
                -4 => "سطح تایید پذیرنده پایین‌تر از سطح نقره‌ای است",
                -11 => "درخواست مورد نظر یافت نشد",
                -12 => "امکان ویرایش درخواست میسر نمی‌باشد",
                -21 => "هیچ نوع عملیات مالی برای این تراکنش یافت نشد",
                -22 => "تراکنش ناموفق بوده است",
                -33 => "رقم تراکنش با رقم پرداخت شده مطابقت ندارد",
                -34 => "سقف تقسیم تراکنش از لحاظ تعداد یا رقم عبور نموده است",
                -40 => "اجازه دسترسی به متد مربوطه وجود ندارد",
                -41 => "اطلاعات ارسال شده مربوط به AdditionalData غیرمعتبر است",
                -42 => "مدت زمان معتبر طول عمر شناسه پرداخت باید بین 30 دقیقه تا 45 روز باشد",
                -54 => "درخواست مورد نظر آرشیو شده است",
                100 => "عملیات با موفقیت انجام شد",
                101 => "عملیات پرداخت موفق بوده و قبلا تایید شده است",
                _ => "خطای نامشخص در پرداخت"
            };
        }

        #region ZarinPal Response Models

        private class ZarinPalResponse
        {
            public ZarinPalData? data { get; set; }
            public List<string>? errors { get; set; }
        }

        private class ZarinPalData
        {
            public int code { get; set; }
            public string? message { get; set; }
            public string authority { get; set; } = string.Empty;
            public string? fee_type { get; set; }
            public long? fee { get; set; }
        }

        private class ZarinPalVerifyResponse
        {
            public ZarinPalVerifyData? data { get; set; }
            public List<string>? errors { get; set; }
        }

        private class ZarinPalVerifyData
        {
            public int code { get; set; }
            public string? message { get; set; }
            public string? card_hash { get; set; }
            public string? card_pan { get; set; }
            public long ref_id { get; set; }
            public string? fee_type { get; set; }
            public long? fee { get; set; }
        }

        #endregion
    }
}
