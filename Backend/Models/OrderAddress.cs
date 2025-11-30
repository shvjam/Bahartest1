using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class OrderAddress
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid OrderId { get; set; }

        [Required]
        public Guid AddressId { get; set; }

        [Required]
        public OrderAddressType Type { get; set; }

        public int? StopOrder { get; set; }
        
        // Address details (denormalized for Order)
        [MaxLength(500)]
        public string? AddressLine { get; set; }
        
        [MaxLength(100)]
        public string? City { get; set; }
        
        [MaxLength(100)]
        public string? District { get; set; }
        
        [MaxLength(20)]
        public string? PostalCode { get; set; }
        
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        
        public int? Floor { get; set; }
        public bool HasElevator { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? WalkingDistance { get; set; }
        
        [MaxLength(100)]
        public string? ContactName { get; set; }
        
        [MaxLength(15)]
        public string? ContactPhone { get; set; }
        
        [MaxLength(1000)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public Order Order { get; set; } = null!;
        public Address Address { get; set; } = null!;
    }
}