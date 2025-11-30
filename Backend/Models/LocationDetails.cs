using System.ComponentModel.DataAnnotations;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class LocationDetails
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid OrderId { get; set; }

        public int OriginFloor { get; set; } = 0;
        
        public FloorType? OriginFloorType { get; set; }

        public bool OriginHasElevator { get; set; } = false;

        public int OriginWalkingDistance { get; set; } = 0;

        public int DestinationFloor { get; set; } = 0;
        
        public FloorType? DestinationFloorType { get; set; }

        public bool DestinationHasElevator { get; set; } = false;

        public int DestinationWalkingDistance { get; set; } = 0;

        public int StopCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public Order Order { get; set; } = null!;
    }
}