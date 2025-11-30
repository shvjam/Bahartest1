using BarbariBahar.API.Models;

namespace BarbariBahar.API.Services.Interfaces
{
    /// <summary>
    /// Interface برای سرویس آپلود فایل
    /// </summary>
    public interface IFileUploadService
    {
        /// <summary>
        /// آپلود تک فایل
        /// </summary>
        Task<FileUploadResult> UploadFileAsync(IFormFile file, string subPath = "general");

        /// <summary>
        /// آپلود چند فایل
        /// </summary>
        Task<List<FileUploadResult>> UploadMultipleFilesAsync(IFormFileCollection files, string subPath = "general");

        /// <summary>
        /// حذف فایل
        /// </summary>
        Task<bool> DeleteFileAsync(string filePath);

        /// <summary>
        /// اعتبارسنجی فایل
        /// </summary>
        bool ValidateFile(IFormFile file, out string errorMessage);

        /// <summary>
        /// دریافت URL فایل
        /// </summary>
        string GetFileUrl(string fileName, string subPath);
    }
}
