namespace BarbariBahar.API.Models
{
    /// <summary>
    /// تنظیمات آپلود فایل
    /// </summary>
    public class FileUploadSettings
    {
        public string UploadPath { get; set; } = "wwwroot/uploads";
        public long MaxFileSize { get; set; } = 5 * 1024 * 1024; // 5 MB
        public List<string> AllowedExtensions { get; set; } = new()
        {
            ".jpg", ".jpeg", ".png", ".gif", ".pdf"
        };
        public List<string> AllowedMimeTypes { get; set; } = new()
        {
            "image/jpeg", "image/png", "image/gif", "application/pdf"
        };

        // مسیرهای مختلف
        public string AvatarsPath { get; set; } = "avatars";
        public string DocumentsPath { get; set; } = "documents";
        public string VehiclesPath { get; set; } = "vehicles";
        public string OrdersPath { get; set; } = "orders";
    }

    /// <summary>
    /// نتیجه آپلود فایل
    /// </summary>
    public class FileUploadResult
    {
        public bool Success { get; set; }
        public string? FileName { get; set; }
        public string? FilePath { get; set; }
        public string? FileUrl { get; set; }
        public long FileSize { get; set; }
        public string? ContentType { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
