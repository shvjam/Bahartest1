using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Models
{
    public class TicketMessage
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TicketId { get; set; }

        [Required]
        public Guid SenderId { get; set; }

        [Required]
        [MaxLength(5000)]
        public string Message { get; set; } = string.Empty;

        public bool IsAdminMessage { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsRead { get; set; } = false;

        public DateTime? ReadAt { get; set; }

        public Ticket Ticket { get; set; } = null!;
        public User Sender { get; set; } = null!;
    }
}
