using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Models
{
    public class CatalogCategory
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Slug { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [MaxLength(100)]
        public string? Icon { get; set; }

        public int Order { get; set; } = 0;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        public ICollection<CatalogItem> Items { get; set; } = new List<CatalogItem>();
    }
}