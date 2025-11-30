namespace BarbariBahar.API.Services.Interfaces
{
    public interface IUserService
    {
        Task<User?> GetUserByIdAsync(Guid userId);
        Task<User?> GetUserByPhoneNumberAsync(string phoneNumber);
        Task<(bool Success, User? User, string? Message)> CreateUserAsync(string phoneNumber, UserRole role = UserRole.CUSTOMER);
        Task<(bool Success, string? Message)> UpdateUserAsync(Guid userId, UpdateUserDto dto);
        Task<(bool Success, string? Message)> DeactivateUserAsync(Guid userId);
        Task<List<User>> GetAllUsersAsync(UserRole? role = null);
        Task<UserStats?> GetUserStatsAsync(Guid userId);
    }

    public class UpdateUserDto
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public UserRole? Role { get; set; }
        public bool? IsActive { get; set; }
    }

    public class UserStats
    {
        public int TotalOrders { get; set; }
        public int CompletedOrders { get; set; }
        public int CancelledOrders { get; set; }
        public decimal TotalSpent { get; set; }
    }
}
