namespace BarbariBahar.API.Models
{
    /// <summary>
    /// تنظیمات سرویس SMS (IPPanel)
    /// </summary>
    public class SmsSettings
    {
        public string ApiUrl { get; set; } = "https://edge.ippanel.com/v1/api/send";
        public string AccessKey { get; set; } = string.Empty;
        public string FromNumber { get; set; } = string.Empty;
        public bool IsEnabled { get; set; } = true;
        public int OtpExpirationMinutes { get; set; } = 2;
        
        // Template برای پیام‌های مختلف
        public SmsTemplates Templates { get; set; } = new();
    }

    public class SmsTemplates
    {
        public string OtpMessage { get; set; } = "کد تایید شما: {0}\nباربری بهار";
        public string WelcomeMessage { get; set; } = "خوش آمدید {0} عزیز!\nباربری بهار";
        public string OrderCreatedMessage { get; set; } = "سفارش شما با شماره {0} ثبت شد.\nباربری بهار";
        public string OrderAcceptedMessage { get; set; } = "سفارش {0} توسط راننده پذیرفته شد.\nباربری بهار";
        public string OrderCompletedMessage { get; set; } = "سفارش {0} با موفقیت تکمیل شد.\nباربری بهار";
    }
}
