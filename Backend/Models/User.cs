using System.ComponentModel.DataAnnotations;
using BarbariBahar.API.Enums;
using System.ComponentModel.DataAnnotations.Schema; // این خط اضافه شد


namespace BarbariBahar.API.Models
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(15)]
        public string PhoneNumber { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? FullName { get; set; }

        [MaxLength(200)]
        public string? Email { get; set; }

        [MaxLength(11)]
        public string? NationalId { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [MaxLength(500)]
        public string? ProfileImage { get; set; }
        
        [MaxLength(500)]
        public string? AvatarUrl { get; set; }

        [Required]
        public UserRole Role { get; set; } = UserRole.CUSTOMER;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
        
        public DateTime? LastLoginAt { get; set; }
        [NotMapped]
        public Driver? Driver
        {
            get => DriverProfile;
            set => DriverProfile = value;
        }
        // Relationships
        public Driver? DriverProfile { get; set; }
       
        public ICollection<Address> Addresses { get; set; } = new List<Address>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}