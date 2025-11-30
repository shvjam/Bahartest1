using System.ComponentModel.DataAnnotations;

namespace BarbariBahar.API.Models
{
    public class DriverAssignment
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid OrderId { get; set; }

        [Required]
        public Guid DriverId { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        public DateTime? EstimatedArrivalTime { get; set; }

        public DateTime? ActualArrivalTime { get; set; }

        public bool AutoAssigned { get; set; } = false;

        // Navigation Properties
        public Order Order { get; set; } = null!;
        public Driver Driver { get; set; } = null!;
    }
}
