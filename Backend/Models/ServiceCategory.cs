using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class ServiceCategory
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public ServiceType? ServiceType { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Slug { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? ShortDescription { get; set; }

        [MaxLength(100)]
        public string? Icon { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? BasePrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? PricePerKm { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? DiscountPercentage { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? FeaturesJson { get; set; }

        public bool IsActive { get; set; } = true;

        public bool IsFeatured { get; set; } = false;

        public int Order { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MinPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MaxPrice { get; set; }

        [MaxLength(1000)]
        public string? AdminNote { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}