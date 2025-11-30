using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Models
{
    public class PackingServiceItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid PackingServiceId { get; set; }

        [Required]
        [MaxLength(200)]
        public string ItemName { get; set; } = string.Empty;

        [Required]
        public int Quantity { get; set; }

        [MaxLength(100)]
        public string? Category { get; set; }
        
        public PackingProduct? PackingProduct { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public PackingService PackingService { get; set; } = null!;
    }
}