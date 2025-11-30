using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class Address
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid? UserId { get; set; }

        [MaxLength(100)]
        public string? Title { get; set; }

        [Required]
        [MaxLength(1000)]
        public string FullAddress { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string City { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Province { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? District { get; set; }

        [MaxLength(200)]
        public string? Street { get; set; }

        [MaxLength(100)]
        public string? Alley { get; set; }

        [MaxLength(50)]
        public string? Building { get; set; }

        [MaxLength(20)]
        public string? Unit { get; set; }

        public int? Floor { get; set; }

        [MaxLength(20)]
        public string? PostalCode { get; set; }

        [Column(TypeName = "decimal(10,8)")]
        public decimal? Latitude { get; set; }

        [Column(TypeName = "decimal(11,8)")]
        public decimal? Longitude { get; set; }

        [MaxLength(15)]
        public string? PhoneNumber { get; set; }

        [MaxLength(100)]
        public string? RecipientName { get; set; }

        [MaxLength(15)]
        public string? RecipientPhone { get; set; }

        [MaxLength(1000)]
        public string? Details { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public User? User { get; set; }
    }
}
