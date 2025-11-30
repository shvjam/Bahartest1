using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class LocationUpdate
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid DriverId { get; set; }

        public Guid? OrderId { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,8)")]
        public decimal Latitude { get; set; }

        [Required]
        [Column(TypeName = "decimal(11,8)")]
        public decimal Longitude { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? Speed { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? Heading { get; set; }
        
        [Column(TypeName = "decimal(5,2)")]
        public decimal? Accuracy { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public Driver Driver { get; set; } = null!;
    }
}