using System.Security.Claims;

namespace BarbariBahar.API.Services.Interfaces
{
    public interface IJwtService
    {
        string GenerateAccessToken(User user);
        ClaimsPrincipal? ValidateToken(string token);
        Guid? GetUserIdFromToken(string token);
    }
}
