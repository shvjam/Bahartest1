using BarbariBahar.API.DTOs.Auth;

namespace BarbariBahar.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<SendOtpResponse> SendOtpAsync(SendOtpRequest request);
        Task<AuthResponse> VerifyOtpAsync(VerifyOtpRequest request);
        Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request);
        Task RevokeTokenAsync(RevokeTokenRequest request);
        Task<UserDto> GetUserByIdAsync(Guid userId);
    }
}
