using BarbariBahar.API.Services.Interfaces;

namespace BarbariBahar.API.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UserService> _logger;

        public UserService(AppDbContext context, ILogger<UserService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<User?> GetUserByIdAsync(Guid userId)
        {
            return await _context.Users
                .Include(u => u.Driver)
                .Include(u => u.Orders)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<User?> GetUserByPhoneNumberAsync(string phoneNumber)
        {
            return await _context.Users
                .Include(u => u.Driver)
                .FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
        }

        public async Task<(bool Success, User? User, string? Message)> CreateUserAsync(
            string phoneNumber, UserRole role = UserRole.CUSTOMER)
        {
            try
            {
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);

                if (existingUser != null)
                {
                    return (false, null, "کاربری با این شماره تلفن قبلاً ثبت شده است");
                }

                var user = new User
                {
                    Id = Guid.NewGuid(),
                    PhoneNumber = phoneNumber,
                    Role = role,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("User created with phone number {PhoneNumber}", phoneNumber);

                return (true, user, "کاربر با موفقیت ایجاد شد");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user with phone {PhoneNumber}", phoneNumber);
                return (false, null, "خطا در ایجاد کاربر");
            }
        }

        public async Task<(bool Success, string? Message)> UpdateUserAsync(Guid userId, UpdateUserDto dto)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);

                if (user == null)
                {
                    return (false, "کاربر یافت نشد");
                }

                if (!string.IsNullOrWhiteSpace(dto.FullName))
                    user.FullName = dto.FullName;

                if (!string.IsNullOrWhiteSpace(dto.Email))
                    user.Email = dto.Email;

                if (dto.Role.HasValue)
                    user.Role = dto.Role.Value;

                if (dto.IsActive.HasValue)
                    user.IsActive = dto.IsActive.Value;

                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return (true, "اطلاعات کاربر به‌روزرسانی شد");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {UserId}", userId);
                return (false, "خطا در به‌روزرسانی کاربر");
            }
        }

        public async Task<(bool Success, string? Message)> DeactivateUserAsync(Guid userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);

                if (user == null)
                {
                    return (false, "کاربر یافت نشد");
                }

                user.IsActive = false;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return (true, "کاربر با موفقیت غیرفعال شد");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deactivating user {UserId}", userId);
                return (false, "خطا در غیرفعال کردن کاربر");
            }
        }

        public async Task<List<User>> GetAllUsersAsync(UserRole? role = null)
        {
            var query = _context.Users.Include(u => u.Driver).AsQueryable();

            if (role.HasValue)
            {
                query = query.Where(u => u.Role == role.Value);
            }

            return await query
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();
        }

        public async Task<UserStats?> GetUserStatsAsync(Guid userId)
        {
            var user = await _context.Users
                .Include(u => u.Orders)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return null;

            var completedOrders = user.Orders.Where(o => o.Status == OrderStatus.COMPLETED).ToList();

            return new UserStats
            {
                TotalOrders = user.Orders.Count,
                CompletedOrders = completedOrders.Count,
                CancelledOrders = user.Orders.Count(o => o.Status == OrderStatus.CANCELLED),
                TotalSpent = completedOrders.Sum(o => o.TotalPrice)
            };
        }
    }
}
