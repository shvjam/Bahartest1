namespace BarbariBahar.API.Services.Interfaces
{
    public interface IDriverService
    {
        Task<(bool Success, Driver? Driver, string? Message)> CreateDriverAsync(CreateDriverDto dto);
        Task<(bool Success, string? Message)> UpdateDriverAsync(Guid driverId, UpdateDriverDto dto);
        Task<(bool Success, string? Message)> VerifyDriverAsync(Guid driverId);
        Task<(bool Success, string? Message)> ToggleAvailabilityAsync(Guid driverId);
        Task<Driver?> GetDriverByIdAsync(Guid driverId);
        Task<Driver?> GetDriverByUserIdAsync(Guid userId);
        Task<List<Driver>> GetAvailableDriversAsync(VehicleType? vehicleType = null);
        Task<List<Driver>> GetAllDriversAsync(bool? isActive = null);
        Task<DriverStats?> GetDriverStatsAsync(Guid driverId);
    }

    public class CreateDriverDto
    {
        public Guid UserId { get; set; }
        public string LicensePlate { get; set; } = string.Empty;
        public VehicleType VehicleType { get; set; }
        public string? VehicleModel { get; set; }
        public string? VehicleColor { get; set; }
        public int? VehicleYear { get; set; }
        public int AvailableWorkers { get; set; }
    }

    public class UpdateDriverDto
    {
        public string? LicensePlate { get; set; }
        public VehicleType? VehicleType { get; set; }
        public string? VehicleModel { get; set; }
        public string? VehicleColor { get; set; }
        public int? VehicleYear { get; set; }
        public int? AvailableWorkers { get; set; }
        public bool? IsAvailable { get; set; }
    }

    public class DriverStats
    {
        public int TotalRides { get; set; }
        public int CompletedRides { get; set; }
        public int CancelledRides { get; set; }
        public decimal TotalEarnings { get; set; }
        public decimal AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public int TodayRides { get; set; }
        public decimal TodayEarnings { get; set; }
        public int ThisMonthRides { get; set; }
        public decimal ThisMonthEarnings { get; set; }
    }
}
