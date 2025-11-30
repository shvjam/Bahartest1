using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BarbariBahar.API.Enums;

namespace BarbariBahar.API.Models
{
    public class Driver
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        // اطلاعات وسیله نقلیه
        [Required]
        [MaxLength(20)]
        public string LicensePlate { get; set; } = string.Empty;

        [Required]
        public VehicleType VehicleType { get; set; }

        [MaxLength(50)]
        public string? VehicleModel { get; set; }

        [MaxLength(30)]
        public string? VehicleColor { get; set; }

        public int? VehicleYear { get; set; }

        public int AvailableWorkers { get; set; } = 1;

        // مدارک
        [MaxLength(50)]
        public string? DriverLicenseNumber { get; set; }

        public DateTime? DriverLicenseExpiry { get; set; }

        [MaxLength(500)]
        public string? DriverLicenseImage { get; set; }

        [MaxLength(500)]
        public string? VehicleCardImage { get; set; }

        [MaxLength(500)]
        public string? InsuranceImage { get; set; }

        public bool DocumentsVerified { get; set; } = false;

        public DateTime? VerifiedAt { get; set; }

        // آمار
        [Column(TypeName = "decimal(3,2)")]
        public decimal Rating { get; set; } = 0;

        public int TotalRides { get; set; } = 0;
        public int TotalTrips { get; set; } = 0; // Alias
        
        public int CompletedRides { get; set; } = 0;
        public int CompletedTrips { get; set; } = 0; // Alias
        
        public int CancelledRides { get; set; } = 0;
        public int CancelledTrips { get; set; } = 0; // Alias

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalEarnings { get; set; } = 0;

        // وضعیت
        public bool IsActive { get; set; } = true;

        public bool IsAvailable { get; set; } = false;
        
        public bool IsVerified { get; set; } = false;
        
        public DriverStatus Status { get; set; } = DriverStatus.Offline;

        // موقعیت فعلی
        [Column(TypeName = "decimal(10,8)")]
        public decimal? CurrentLatitude { get; set; }

        [Column(TypeName = "decimal(11,8)")]
        public decimal? CurrentLongitude { get; set; }

        public DateTime? LastLocationUpdate { get; set; }

        // اطلاعات بانکی
        [MaxLength(50)]
        public string? BankAccountNumber { get; set; }

        [MaxLength(50)]
        public string? BankName { get; set; }

        [MaxLength(100)]
        public string? BankAccountHolder { get; set; }

        [MaxLength(10)]
        public string? ShabaNumber { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        public User User { get; set; } = null!;
        public ICollection<DriverAssignment> Assignments { get; set; } = new List<DriverAssignment>();
        public ICollection<LocationUpdate> LocationUpdates { get; set; } = new List<LocationUpdate>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}