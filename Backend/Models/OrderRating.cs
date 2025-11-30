using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Models
{
    public class OrderRating
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid OrderId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        public Guid? DriverId { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }
        
        [Range(1, 5)]
        public int? OverallRating { get; set; }
        
        [Range(1, 5)]
        public int? DriverRating { get; set; }
        
        [Range(1, 5)]
        public int? ServiceRating { get; set; }

        [MaxLength(2000)]
        public string? Review { get; set; }
        
        [MaxLength(2000)]
        public string? Comment { get; set; }

        [MaxLength(2000)]
        public string? DriverComment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        public Order Order { get; set; } = null!;
        public User User { get; set; } = null!;
        public Driver? Driver { get; set; }
    }
}