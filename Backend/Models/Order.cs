using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class Order
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(20)]
        public string OrderNumber { get; set; } = string.Empty;

        public Guid? UserId { get; set; }
        
        public Guid? CustomerId { get; set; }

        [Required]
        [MaxLength(15)]
        public string CustomerPhone { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? CustomerName { get; set; }

        [Required]
        public Guid ServiceId { get; set; }
        
        [Required]
        public Guid ServiceCategoryId { get; set; }

        public Guid? DriverId { get; set; }

        [Required]
        public OrderStatus Status { get; set; } = OrderStatus.DRAFT;
        
        // Vehicle and Workers
        public VehicleType? VehicleType { get; set; }
        public bool RequiresPacking { get; set; }
        public bool RequiresWorkers { get; set; }
        public int? WorkerCount { get; set; }

        // زمان‌بندی
        [Required]
        public DateTime PreferredDateTime { get; set; }
        
        public DateTime? ScheduledDate { get; set; }
        public TimeSpan? ScheduledTime { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ConfirmedAt { get; set; }

        public DateTime? StartedAt { get; set; }

        public DateTime? CompletedAt { get; set; }
        
        public DateTime? CancelledAt { get; set; }

        // قیمت - Detailed pricing
        [Column(TypeName = "decimal(18,2)")]
        public decimal BasePrice { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? VehiclePrice { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? WorkerPrice { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? DistancePrice { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? FloorPrice { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? WalkingDistancePrice { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? StopsPrice { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? PackingPrice { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? Discount { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }
        
        // قیمت
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal EstimatedPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? FinalPrice { get; set; }

        [MaxLength(50)]
        public string? DiscountCode { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DiscountAmount { get; set; }
        
        // Payment
        public PaymentMethod? PaymentMethod { get; set; }
        public bool IsPaid { get; set; }

        // جزئیات سفارش (JSON)
        [Column(TypeName = "nvarchar(max)")]
        public string? DetailsJson { get; set; }
        
        [MaxLength(2000)]
        public string? SpecialInstructions { get; set; }

        // فاصله و زمان
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Distance { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal DistanceKm { get; set; }

        public int EstimatedDuration { get; set; }

        // یادداشت‌ها
        [MaxLength(2000)]
        public string? CustomerNote { get; set; }

        [MaxLength(2000)]
        public string? AdminNote { get; set; }

        [MaxLength(2000)]
        public string? DriverNote { get; set; }

        // امتیاز
        public int? Rating { get; set; }

        [MaxLength(2000)]
        public string? Review { get; set; }

        // لغو
        [MaxLength(500)]
        public string? CancellationReason { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? CancellationFee { get; set; }

        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        public User? Customer { get; set; }
        public User? User { get; set; }
        public Driver? Driver { get; set; }
        public ServiceCategory ServiceCategory { get; set; } = null!;
        public ServiceCategory Service { get; set; } = null!; // Alias
        public ICollection<OrderAddress> Addresses { get; set; } = new List<OrderAddress>();
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
        public ICollection<OrderStop> Stops { get; set; } = new List<OrderStop>();
        public ICollection<OrderRating> Ratings { get; set; } = new List<OrderRating>();
        public ICollection<OrderPackingProduct> PackingItems { get; set; } = new List<OrderPackingProduct>();
        public PackingService? PackingService { get; set; }
        public LocationDetails? LocationDetails { get; set; }
        public DriverAssignment? DriverAssignment { get; set; }
        public Payment? Payment { get; set; }
    }
}