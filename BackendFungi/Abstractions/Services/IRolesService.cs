using BackendFungi.Models;
using BackendFungi.Models.Filters;

namespace BackendFungi.Abstractions.Services;

public interface IRolesService
{
    Task<Guid> CreateRoleAsync(Role role, CancellationToken ct);

    Task<Role> GetRoleAsync(Guid roleId, CancellationToken ct);

    Task<List<Role>> GetFilteredRolesAsync(RoleFilter? roleFilter, CancellationToken ct);

    Task<List<Permission>> GetAllPermissionsAsync(CancellationToken ct);

    Task<List<string>> GetRolePermissionCodesAsync(Guid roleId, CancellationToken ct);

    Task<Guid> SetRolePermissionCodesAsync(Guid roleId, IReadOnlyCollection<string> permissionCodes, CancellationToken ct);

    Task<bool> RoleHasPermissionAsync(Guid roleId, string permissionCode, CancellationToken ct);

    Task<Guid> UpdateRoleAsync(Guid roleId, Role newRole, CancellationToken ct);

    Task<Guid> DeleteRoleAsync(Guid roleId, CancellationToken ct);
}
