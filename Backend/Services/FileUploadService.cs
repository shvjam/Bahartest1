using Microsoft.Extensions.Options;
using BarbariBahar.API.Models;
using BarbariBahar.API.Services.Interfaces;
using BarbariBahar.API.Exceptions;

namespace BarbariBahar.API.Services
{
    /// <summary>
    /// سرویس آپلود و مدیریت فایل‌ها
    /// </summary>
    public class FileUploadService : IFileUploadService
    {
        private readonly FileUploadSettings _settings;
        private readonly ILogger<FileUploadService> _logger;
        private readonly IWebHostEnvironment _environment;

        public FileUploadService(
            IOptions<FileUploadSettings> settings,
            ILogger<FileUploadService> logger,
            IWebHostEnvironment environment)
        {
            _settings = settings.Value;
            _logger = logger;
            _environment = environment;

            // ایجاد پوشه‌های لازم
            EnsureDirectoriesExist();
        }

        /// <summary>
        /// آپلود تک فایل
        /// </summary>
        public async Task<FileUploadResult> UploadFileAsync(IFormFile file, string subPath = "general")
        {
            try
            {
                // اعتبارسنجی فایل
                if (!ValidateFile(file, out var errorMessage))
                {
                    return new FileUploadResult
                    {
                        Success = false,
                        ErrorMessage = errorMessage
                    };
                }

                // ایجاد نام یکتا برای فایل
                var fileName = GenerateUniqueFileName(file.FileName);
                var directory = Path.Combine(_environment.WebRootPath, _settings.UploadPath, subPath);
                var filePath = Path.Combine(directory, fileName);

                // اطمینان از وجود پوشه
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                // ذخیره فایل
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                _logger.LogInformation("File uploaded successfully: {FileName}", fileName);

                return new FileUploadResult
                {
                    Success = true,
                    FileName = fileName,
                    FilePath = filePath,
                    FileUrl = GetFileUrl(fileName, subPath),
                    FileSize = file.Length,
                    ContentType = file.ContentType
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file: {FileName}", file.FileName);
                return new FileUploadResult
                {
                    Success = false,
                    ErrorMessage = "خطا در آپلود فایل"
                };
            }
        }

        /// <summary>
        /// آپلود چند فایل
        /// </summary>
        public async Task<List<FileUploadResult>> UploadMultipleFilesAsync(IFormFileCollection files, string subPath = "general")
        {
            var results = new List<FileUploadResult>();

            foreach (var file in files)
            {
                var result = await UploadFileAsync(file, subPath);
                results.Add(result);
            }

            return results;
        }

        /// <summary>
        /// حذف فایل
        /// </summary>
        public async Task<bool> DeleteFileAsync(string filePath)
        {
            try
            {
                if (File.Exists(filePath))
                {
                    await Task.Run(() => File.Delete(filePath));
                    _logger.LogInformation("File deleted successfully: {FilePath}", filePath);
                    return true;
                }

                _logger.LogWarning("File not found for deletion: {FilePath}", filePath);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file: {FilePath}", filePath);
                return false;
            }
        }

        /// <summary>
        /// اعتبارسنجی فایل
        /// </summary>
        public bool ValidateFile(IFormFile file, out string errorMessage)
        {
            errorMessage = string.Empty;

            // بررسی null
            if (file == null || file.Length == 0)
            {
                errorMessage = "فایل خالی است";
                return false;
            }

            // بررسی حجم
            if (file.Length > _settings.MaxFileSize)
            {
                errorMessage = $"حجم فایل نباید بیشتر از {_settings.MaxFileSize / 1024 / 1024} مگابایت باشد";
                return false;
            }

            // بررسی پسوند
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_settings.AllowedExtensions.Contains(extension))
            {
                errorMessage = $"فرمت فایل مجاز نیست. فرمت‌های مجاز: {string.Join(", ", _settings.AllowedExtensions)}";
                return false;
            }

            // بررسی MIME Type
            if (!_settings.AllowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
            {
                errorMessage = "نوع فایل مجاز نیست";
                return false;
            }

            return true;
        }

        /// <summary>
        /// دریافت URL فایل
        /// </summary>
        public string GetFileUrl(string fileName, string subPath)
        {
            return $"/uploads/{subPath}/{fileName}";
        }

        /// <summary>
        /// تولید نام یکتا برای فایل
        /// </summary>
        private string GenerateUniqueFileName(string originalFileName)
        {
            var extension = Path.GetExtension(originalFileName);
            var uniqueName = $"{Guid.NewGuid()}{extension}";
            return uniqueName;
        }

        /// <summary>
        /// اطمینان از وجود پوشه‌ها
        /// </summary>
        private void EnsureDirectoriesExist()
        {
            var basePath = Path.Combine(_environment.WebRootPath, _settings.UploadPath);

            // پوشه اصلی
            if (!Directory.Exists(basePath))
            {
                Directory.CreateDirectory(basePath);
            }

            // پوشه‌های فرعی
            var subPaths = new[]
            {
                _settings.AvatarsPath,
                _settings.DocumentsPath,
                _settings.VehiclesPath,
                _settings.OrdersPath
            };

            foreach (var subPath in subPaths)
            {
                var fullPath = Path.Combine(basePath, subPath);
                if (!Directory.Exists(fullPath))
                {
                    Directory.CreateDirectory(fullPath);
                    _logger.LogInformation("Directory created: {Path}", fullPath);
                }
            }
        }
    }
}
