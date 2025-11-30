namespace BarbariBahar.API.Services.Interfaces
{
    /// <summary>
    /// Interface برای سرویس SMS
    /// </summary>
    public interface ISmsService
    {
        /// <summary>
        /// ارسال OTP به شماره موبایل
        /// </summary>
        Task<bool> SendOtpAsync(string phoneNumber, string otpCode);

        /// <summary>
        /// ارسال پیام خوش‌آمدگویی
        /// </summary>
        Task<bool> SendWelcomeMessageAsync(string phoneNumber, string fullName);

        /// <summary>
        /// ارسال اطلاع ایجاد سفارش
        /// </summary>
        Task<bool> SendOrderCreatedAsync(string phoneNumber, string orderNumber);

        /// <summary>
        /// ارسال اطلاع پذیرش سفارش توسط راننده
        /// </summary>
        Task<bool> SendOrderAcceptedAsync(string phoneNumber, string orderNumber);

        /// <summary>
        /// ارسال اطلاع تکمیل سفارش
        /// </summary>
        Task<bool> SendOrderCompletedAsync(string phoneNumber, string orderNumber);

        /// <summary>
        /// ارسال پیام سفارشی
        /// </summary>
        Task<bool> SendCustomMessageAsync(string phoneNumber, string message);

        /// <summary>
        /// ارسال پیام گروهی
        /// </summary>
        Task<bool> SendBulkMessageAsync(List<string> phoneNumbers, string message);
    }
}
