using BarbariBahar.API.Models;

namespace BarbariBahar.API.Services.Interfaces
{
    /// <summary>
    /// Interface برای سرویس پرداخت
    /// </summary>
    public interface IPaymentService
    {
        /// <summary>
        /// درخواست پرداخت جدید
        /// </summary>
        Task<PaymentRequestResult> RequestPaymentAsync(PaymentRequest request);

        /// <summary>
        /// تایید پرداخت
        /// </summary>
        Task<PaymentVerifyResult> VerifyPaymentAsync(string authority, decimal amount);

        /// <summary>
        /// دریافت URL پرداخت
        /// </summary>
        string GetPaymentUrl(string authority);
    }
}
