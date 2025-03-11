using BackendFungi.Models;
using BackendFungi.Models.Filters;

namespace BackendFungi.Abstractions.Services;

public interface IUsersService
{
    Task<Guid> CreateUserAsync(User user, CancellationToken ct);

    Task<User> GetUserAsync(Guid userId, CancellationToken ct);

    Task<List<User>> GetFilteredUsersAsync(UserFilter? userFilter, CancellationToken ct);

    Task<Guid> UpdateUserAsync(Guid userId, User newUser, CancellationToken ct);

    Task<Guid> DeleteUserAsync(Guid userId, CancellationToken ct);
}