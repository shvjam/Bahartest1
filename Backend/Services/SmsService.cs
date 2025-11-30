using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using BarbariBahar.API.Models;
using BarbariBahar.API.Services.Interfaces;

namespace BarbariBahar.API.Services
{
    public class SmsService : ISmsService
    {
        private readonly SmsSettings _smsSettings;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<SmsService> _logger;

        public SmsService(
            IOptions<SmsSettings> smsSettings,
            IHttpClientFactory httpClientFactory,
            ILogger<SmsService> logger)
        {
            _smsSettings = smsSettings.Value;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<bool> SendOtpAsync(string phoneNumber, string otpCode)
        {
            // استفاده مستقیم از پراپرتی OtpMessage
            var template = !string.IsNullOrWhiteSpace(_smsSettings.Templates?.OtpMessage) 
                ? _smsSettings.Templates.OtpMessage 
                : "کد تایید: {0}";
                
            var message = string.Format(template, otpCode);
            return await SendSmsAsync(phoneNumber, message);
        }

        public async Task<bool> SendWelcomeMessageAsync(string phoneNumber, string fullName)
        {
            var template = !string.IsNullOrWhiteSpace(_smsSettings.Templates?.WelcomeMessage) 
                ? _smsSettings.Templates.WelcomeMessage 
                : "خوش آمدید {0}";

            var message = string.Format(template, fullName);
            return await SendSmsAsync(phoneNumber, message);
        }

        public async Task<bool> SendOrderCreatedAsync(string phoneNumber, string orderNumber)
        {
            var template = !string.IsNullOrWhiteSpace(_smsSettings.Templates?.OrderCreatedMessage) 
                ? _smsSettings.Templates.OrderCreatedMessage 
                : "سفارش {0} ثبت شد";

            var message = string.Format(template, orderNumber);
            return await SendSmsAsync(phoneNumber, message);
        }

        public async Task<bool> SendOrderAcceptedAsync(string phoneNumber, string orderNumber)
        {
            var template = !string.IsNullOrWhiteSpace(_smsSettings.Templates?.OrderAcceptedMessage) 
                ? _smsSettings.Templates.OrderAcceptedMessage 
                : "سفارش {0} پذیرفته شد";

            var message = string.Format(template, orderNumber);
            return await SendSmsAsync(phoneNumber, message);
        }

        public async Task<bool> SendOrderCompletedAsync(string phoneNumber, string orderNumber)
        {
            var template = !string.IsNullOrWhiteSpace(_smsSettings.Templates?.OrderCompletedMessage) 
                ? _smsSettings.Templates.OrderCompletedMessage 
                : "سفارش {0} تکمیل شد";

            var message = string.Format(template, orderNumber);
            return await SendSmsAsync(phoneNumber, message);
        }

        public async Task<bool> SendCustomMessageAsync(string phoneNumber, string message)
        {
            return await SendSmsAsync(phoneNumber, message);
        }

        public async Task<bool> SendBulkMessageAsync(List<string> phoneNumbers, string message)
        {
            return await SendSmsInternalAsync(phoneNumbers.ToArray(), message);
        }

        private async Task<bool> SendSmsAsync(string phoneNumber, string message)
        {
            return await SendSmsInternalAsync(new[] { phoneNumber }, message);
        }

        private async Task<bool> SendSmsInternalAsync(string[] recipients, string message)
        {
            if (!_smsSettings.IsEnabled)
            {
                _logger.LogWarning("SMS Service is DISABLED in settings.");
                // برای تست لوکال، اگر سرویس خاموش است true برمی‌گردانیم تا ارور ندهد
                return true; 
            }

            try
            {
                var httpClient = _httpClientFactory.CreateClient();
                
                var accessKey = _smsSettings.AccessKey?.Trim();
                var sender = _smsSettings.FromNumber?.Trim();
                var apiUrl = _smsSettings.ApiUrl;

                if (string.IsNullOrEmpty(accessKey))
                {
                    _logger.LogError("SMS AccessKey is empty!");
                    return false;
                }

                // ساختار استاندارد پنل‌های جدید (IPPanel/Edge)
                var payload = new
                {
                    sender = sender,       
                    recipient = recipients,
                    message = message
                };

                var jsonContent = JsonSerializer.Serialize(payload);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                httpClient.DefaultRequestHeaders.Clear();
                // هدر استاندارد AccessKey
                httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", $"AccessKey {accessKey}");

                _logger.LogInformation("Sending SMS to {Count} recipients. Msg: {Msg}", recipients.Length, message);

                var response = await httpClient.PostAsync(apiUrl, content);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("SMS SUCCESS. Response: {Response}", responseContent);
                    return true;
                }
                else
                {
                    _logger.LogError("SMS FAILED. Status: {Status}, Response: {Response}", response.StatusCode, responseContent);
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in SMS Service");
                return false;
            }
        }
    }
}
