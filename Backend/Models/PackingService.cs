using System.ComponentModel.DataAnnotations;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class PackingService
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid OrderId { get; set; }

        [Required]
        public PackingType Type { get; set; }

        public int MaleWorkers { get; set; } = 0;

        public int FemaleWorkers { get; set; } = 0;

        public int EstimatedHours { get; set; } = 0;

        public bool NeedsMaterials { get; set; } = false;

        [MaxLength(20)]
        public string? MaterialsMode { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public Order Order { get; set; } = null!;
        public ICollection<PackingServiceItem> Items { get; set; } = new List<PackingServiceItem>();
        public ICollection<OrderPackingProduct> Products { get; set; } = new List<OrderPackingProduct>();
    }
}
