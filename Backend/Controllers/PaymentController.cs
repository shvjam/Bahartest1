using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using BarbariBahar.API.Data;
using BarbariBahar.API.Services.Interfaces;
using BarbariBahar.API.Models;
using BarbariBahar.API.Models.ApiResponses;
using BarbariBahar.API.Exceptions;

namespace BarbariBahar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(
            AppDbContext context,
            IPaymentService paymentService,
            ILogger<PaymentController> logger)
        {
            _context = context;
            _paymentService = paymentService;
            _logger = logger;
        }

        /// <summary>
        /// درخواست پرداخت برای سفارش
        /// </summary>
        [HttpPost("request")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<PaymentRequestResult>>> RequestPayment(
            [FromBody] PaymentRequest request)
        {
            var userId = Guid.Parse(User.FindFirst("UserId")?.Value ?? "");

            // بررسی وجود سفارش
            var order = await _context.Orders
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == request.OrderId && o.UserId == userId);

            if (order == null)
            {
                throw new NotFoundException("سفارش یافت نشد");
            }

            // بررسی اینکه سفارش قبلاً پرداخت نشده باشد
            var existingPayment = await _context.Payments
                .Where(p => p.OrderId == request.OrderId && p.PaymentStatus == Enums.PaymentStatus.COMPLETED)
                .FirstOrDefaultAsync();

            if (existingPayment != null)
            {
                throw new BadRequestException("این سفارش قبلاً پرداخت شده است");
            }

            // مقداردهی اطلاعات پرداخت
            request.Amount = order.TotalPrice;
            request.Mobile = order.User?.PhoneNumber ?? "";
            request.Description = $"پرداخت سفارش {order.OrderNumber}";

            var result = await _paymentService.RequestPaymentAsync(request);

            if (!result.Success)
            {
                return BadRequest(ApiResponse<PaymentRequestResult>.ErrorResponse(
                    result.ErrorMessage ?? "خطا در ایجاد درخواست پرداخت"
                ));
            }

            return Ok(ApiResponse<PaymentRequestResult>.SuccessResponse(
                result,
                "لطفاً به درگاه پرداخت منتقل شوید"
            ));
        }

        /// <summary>
        /// تایید پرداخت (Callback از ZarinPal)
        /// </summary>
        [HttpGet("verify")]
        public async Task<IActionResult> VerifyPayment(
            [FromQuery] string Authority,
            [FromQuery] string Status)
        {
            if (Status != "OK")
            {
                return Redirect($"/payment/failed?message=پرداخت لغو شد");
            }

            // پیدا کردن پرداخت
            var payment = await _context.Payments
                .Include(p => p.Order)
                .FirstOrDefaultAsync(p => p.TransactionId == Authority);

            if (payment == null)
            {
                return Redirect($"/payment/failed?message=تراکنش یافت نشد");
            }

            // تایید پرداخت
            var result = await _paymentService.VerifyPaymentAsync(Authority, payment.Amount);

            if (!result.Success)
            {
                return Redirect($"/payment/failed?message={result.ErrorMessage}");
            }

            return Redirect($"/payment/success?refId={result.RefId}&amount={payment.Amount}");
        }

        /// <summary>
        /// دریافت وضعیت پرداخت سفارش
        /// </summary>
        [HttpGet("order/{orderId}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<Payment>>> GetOrderPaymentStatus(Guid orderId)
        {
            var userId = Guid.Parse(User.FindFirst("UserId")?.Value ?? "");

            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null)
            {
                throw new NotFoundException("سفارش یافت نشد");
            }

            var payment = await _context.Payments
                .Where(p => p.OrderId == orderId)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync();

            if (payment == null)
            {
                return NotFound(ApiResponse<Payment>.ErrorResponse("پرداختی برای این سفارش یافت نشد"));
            }

            return Ok(ApiResponse<Payment>.SuccessResponse(payment));
        }

        /// <summary>
        /// لیست تمام پرداخت‌ها (Admin)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<ApiResponse<List<Payment>>>> GetAllPayments()
        {
            var payments = await _context.Payments
                .Include(p => p.Order)
                .OrderByDescending(p => p.CreatedAt)
                .Take(100)
                .ToListAsync();

            return Ok(ApiResponse<List<Payment>>.SuccessResponse(payments));
        }
    }
}