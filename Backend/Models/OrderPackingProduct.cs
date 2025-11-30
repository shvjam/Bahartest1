using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BarbariBahar.API.Models
{
    public class OrderPackingProduct
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid? OrderId { get; set; }

        [Required]
        public Guid PackingServiceId { get; set; }

        [Required]
        public Guid PackingProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public Order? Order { get; set; }
        public PackingService PackingService { get; set; } = null!;
        public PackingProduct PackingProduct { get; set; } = null!;
    }
}