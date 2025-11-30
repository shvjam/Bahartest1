using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BarbariBahar.API.Services.Interfaces;
using BarbariBahar.API.Models.ApiResponses;
using BarbariBahar.API.DTOs.Common;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IFileUploadService _fileUploadService;
        private readonly ILogger<FilesController> _logger;

        public FilesController(
            IFileUploadService fileUploadService,
            ILogger<FilesController> logger)
        {
            _fileUploadService = fileUploadService;
            _logger = logger;
        }

        /// <summary>
        /// آپلود تک فایل
        /// </summary>
        [HttpPost("upload")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<FileUploadResponseDto>>> UploadFile(
            IFormFile file,
            [FromQuery] string type = "general")
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(ApiResponse<FileUploadResponseDto>.ErrorResponse(
                    "فایل انتخاب نشده است"
                ));
            }

            var result = await _fileUploadService.UploadFileAsync(file, type);

            if (!result.Success)
            {
                return BadRequest(ApiResponse<FileUploadResponseDto>.ErrorResponse(
                    result.ErrorMessage ?? "خطا در آپلود فایل"
                ));
            }

            var response = new FileUploadResponseDto
            {
                FileName = result.FileName!,
                FileUrl = result.FileUrl!,
                FileSize = result.FileSize,
                ContentType = result.ContentType!
            };

            return Ok(ApiResponse<FileUploadResponseDto>.SuccessResponse(
                response,
                "فایل با موفقیت آپلود شد"
            ));
        }

        /// <summary>
        /// آپلود چند فایل
        /// </summary>
        [HttpPost("upload-multiple")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<List<FileUploadResponseDto>>>> UploadMultipleFiles(
            IFormFileCollection files,
            [FromQuery] string type = "general")
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest(ApiResponse<List<FileUploadResponseDto>>.ErrorResponse(
                    "هیچ فایلی انتخاب نشده است"
                ));
            }

            var results = await _fileUploadService.UploadMultipleFilesAsync(files, type);
            var successfulUploads = results.Where(r => r.Success).ToList();

            if (successfulUploads.Count == 0)
            {
                return BadRequest(ApiResponse<List<FileUploadResponseDto>>.ErrorResponse(
                    "آپلود تمام فایل‌ها با خطا مواجه شد"
                ));
            }

            var response = successfulUploads.Select(r => new FileUploadResponseDto
            {
                FileName = r.FileName!,
                FileUrl = r.FileUrl!,
                FileSize = r.FileSize,
                ContentType = r.ContentType!
            }).ToList();

            var message = successfulUploads.Count == files.Count
                ? "تمام فایل‌ها با موفقیت آپلود شدند"
                : $"{successfulUploads.Count} از {files.Count} فایل آپلود شد";

            return Ok(ApiResponse<List<FileUploadResponseDto>>.SuccessResponse(
                response,
                message
            ));
        }

        /// <summary>
        /// حذف فایل
        /// </summary>
        [HttpDelete("{fileName}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<ApiResponse>> DeleteFile(
            string fileName,
            [FromQuery] string type = "general")
        {
            var filePath = Path.Combine("wwwroot", "uploads", type, fileName);
            var result = await _fileUploadService.DeleteFileAsync(filePath);

            if (!result)
            {
                return NotFound(ApiResponse.ErrorResponse("فایل یافت نشد"));
            }

            return Ok(ApiResponse.SuccessResponse("فایل با موفقیت حذف شد"));
        }
    }
}