using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class Payment
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid OrderId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public PaymentMethod Method { get; set; }
        public PaymentMethod PaymentMethod { get; set; } // Alias

        [Required]
        public PaymentStatus Status { get; set; } = PaymentStatus.PENDING;
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.PENDING; // Alias

        [MaxLength(200)]
        public string? TransactionId { get; set; }
        
        [MaxLength(200)]
        public string? ReferenceNumber { get; set; }

        [MaxLength(500)]
        public string? GatewayResponse { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? PaidAt { get; set; }

        public DateTime? RefundedAt { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? RefundAmount { get; set; }

        // Navigation Properties
        public Order Order { get; set; } = null!;
    }
}