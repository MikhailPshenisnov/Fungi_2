using BackendFungi.Models;

namespace BackendFungi.Abstractions.Services;

public interface IAccessCheckService
{
    Task<User> GetCurrentUser(HttpContext context, CancellationToken ct);

    Task<User> CheckAccessLevel(HttpContext context, int minAccessLevel, CancellationToken ct);

    Task<User> CheckPermission(HttpContext context, string permissionCode, CancellationToken ct);
}
