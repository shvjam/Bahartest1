using System.ComponentModel.DataAnnotations;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class Ticket
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        public Guid? OrderId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public TicketPriority Priority { get; set; } = TicketPriority.MEDIUM;

        [Required]
        public TicketStatus Status { get; set; } = TicketStatus.OPEN;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public DateTime? ClosedAt { get; set; }

        public Guid? AssignedToAdminId { get; set; }

        public User User { get; set; } = null!;
        public Order? Order { get; set; }
        public User? AssignedToAdmin { get; set; }
        public ICollection<TicketMessage> Messages { get; set; } = new List<TicketMessage>();
    }
}
