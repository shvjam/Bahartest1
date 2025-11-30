using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class PricingConfig
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = "پیش‌فرض";
        
        public ServiceType? ServiceType { get; set; }

        // نرخ کارگر پایه
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal BaseWorkerRate { get; set; }

        // نرخ‌های خودرو و کارگر (JSON)
        [Column(TypeName = "nvarchar(max)")]
        public string? BaseVehicleRatesJson { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? WorkerRatesByVehicleJson { get; set; }

        // نرخ مسافت
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PerKmRate { get; set; }

        // نرخ طبقه
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PerFloorRate { get; set; }

        // نرخ مسافت پیاده‌روی (JSON)
        [Column(TypeName = "nvarchar(max)")]
        public string? WalkingDistanceRatesJson { get; set; }

        // نرخ توقف
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal StopRate { get; set; }

        // نرخ ساعتی بسته‌بندی
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PackingHourlyRate { get; set; }

        // تخمین هزینه مواد بسته‌بندی
        [Column(TypeName = "decimal(18,2)")]
        public decimal? PackingMaterialsEstimatedCost { get; set; }

        // آیا هزینه مواد در فاکتور لحاظ شود
        public bool IncludePackingMaterialsInInvoice { get; set; } = true;

        // جریمه لغو
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal CancellationFee { get; set; }

        // هزینه کارشناسی
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ExpertVisitFee { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}