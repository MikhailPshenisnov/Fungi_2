using BackendFungi.Models;

namespace BackendFungi.Abstractions.Services;

public interface IAccessCheckService
{
    Task<User> CheckAccessLevel(HttpContext context, int minAccessLevel, CancellationToken ct);
}