using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BarbariBahar.API.Services.Interfaces;
using BarbariBahar.API.DTOs.Ticket;
using BarbariBahar.API.Models.ApiResponses;
using System.Security.Claims;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TicketsController : ControllerBase
    {
        private readonly ITicketService _ticketService;
        private readonly ILogger<TicketsController> _logger;

        public TicketsController(ITicketService ticketService, ILogger<TicketsController> logger)
        {
            _ticketService = ticketService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResponse<TicketResponse>>> GetTickets([FromQuery] TicketListQueryParams queryParams)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(ApiResponse<object>.Failure("احراز هویت انجام نشده است"));
                }

                if (userRole != "ADMIN")
                {
                    queryParams.UserId = Guid.Parse(userIdClaim);
                }

                var result = await _ticketService.GetTicketsAsync(queryParams);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در دریافت لیست تیکت‌ها");
                return StatusCode(500, ApiResponse<object>.Failure("خطا در دریافت لیست تیکت‌ها"));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<TicketDetailResponse>>> GetTicketById(Guid id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(ApiResponse<object>.Failure("احراز هویت انجام نشده است"));
                }

                var ticket = await _ticketService.GetTicketByIdAsync(id);

                if (ticket == null)
                {
                    return NotFound(ApiResponse<object>.Failure("تیکت یافت نشد"));
                }

                if (userRole != "ADMIN" && ticket.UserId.ToString() != userIdClaim)
                {
                    return Forbid();
                }

                await _ticketService.MarkMessagesAsReadAsync(id, Guid.Parse(userIdClaim));

                return Ok(ApiResponse<TicketDetailResponse>.SuccessResponse(ticket, "تیکت با موفقیت دریافت شد"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در دریافت جزئیات تیکت");
                return StatusCode(500, ApiResponse<object>.Failure("خطا در دریافت جزئیات تیکت"));
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<TicketResponse>>> CreateTicket([FromBody] CreateTicketRequest request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(ApiResponse<object>.Failure("احراز هویت انجام نشده است"));
                }

                var ticket = await _ticketService.CreateTicketAsync(Guid.Parse(userIdClaim), request);

                return Ok(ApiResponse<TicketResponse>.SuccessResponse(ticket, "تیکت با موفقیت ایجاد شد"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در ایجاد تیکت");
                return StatusCode(500, ApiResponse<object>.Failure("خطا در ایجاد تیکت"));
            }
        }

        [HttpPost("messages")]
        public async Task<ActionResult<ApiResponse<TicketMessageResponse>>> SendMessage([FromBody] SendTicketMessageRequest request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(ApiResponse<object>.Failure("احراز هویت انجام نشده است"));
                }

                var message = await _ticketService.SendMessageAsync(Guid.Parse(userIdClaim), request);

                return Ok(ApiResponse<TicketMessageResponse>.SuccessResponse(message, "پیام با موفقیت ارسال شد"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در ارسال پیام");
                return BadRequest(ApiResponse<object>.Failure(ex.Message));
            }
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<ApiResponse<object>>> UpdateTicketStatus(Guid id, [FromBody] UpdateTicketStatusRequest request)
        {
            try
            {
                var result = await _ticketService.UpdateTicketStatusAsync(id, request);

                if (!result)
                {
                    return NotFound(ApiResponse<object>.Failure("تیکت یافت نشد"));
                }

                return Ok(ApiResponse<object>.SuccessResponse(null, "وضعیت تیکت با موفقیت به‌روزرسانی شد"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در به‌روزرسانی وضعیت تیکت");
                return StatusCode(500, ApiResponse<object>.Failure("خطا در به‌روزرسانی وضعیت تیکت"));
            }
        }

        [HttpPatch("{id}/assign")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<ApiResponse<object>>> AssignTicket(Guid id, [FromBody] AssignTicketRequest request)
        {
            try
            {
                var result = await _ticketService.AssignTicketAsync(id, request);

                if (!result)
                {
                    return NotFound(ApiResponse<object>.Failure("تیکت یا ادمین یافت نشد"));
                }

                return Ok(ApiResponse<object>.SuccessResponse(null, "تیکت با موفقیت تخصیص داده شد"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در تخصیص تیکت");
                return StatusCode(500, ApiResponse<object>.Failure("خطا در تخصیص تیکت"));
            }
        }

        [HttpGet("unread-count")]
        public async Task<ActionResult<ApiResponse<int>>> GetUnreadCount()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(ApiResponse<object>.Failure("احراز هویت انجام نشده است"));
                }

                var count = await _ticketService.GetUnreadTicketsCountAsync(Guid.Parse(userIdClaim));

                return Ok(ApiResponse<int>.SuccessResponse(count, "تعداد تیکت‌های خوانده نشده"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "خطا در دریافت تعداد تیکت‌های خوانده نشده");
                return StatusCode(500, ApiResponse<object>.Failure("خطا در دریافت تعداد تیکت‌های خوانده نشده"));
            }
        }
    }
}
