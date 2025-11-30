using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class DiscountCode
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        public string Code { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public DiscountType DiscountType { get; set; } = DiscountType.PERCENTAGE;
        
        [Required]
        [MaxLength(20)]
        public string Type { get; set; } = "PERCENTAGE";

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Value { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MaxDiscount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MinOrderAmount { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int? UsageLimit { get; set; }
        
        public int UsedCount { get; set; } = 0;

        public int UsageCount { get; set; } = 0;

        public int? PerUserLimit { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}