using BackendFungi.Abstractions.Repositories;
using BackendFungi.Abstractions.Services;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using BackendFungi.Models.Filters;

namespace BackendFungi.Services;

public class RolesService : IRolesService
{
    private readonly IRolesRepository _rolesRepository;

    public RolesService(IRolesRepository rolesRepository)
    {
        _rolesRepository = rolesRepository;
    }

    // Creates a new role in the system via the repository
    // Parameters: role model with role data and cancellation token
    // Returns: guid of the created role
    public async Task<Guid> CreateRoleAsync(Role role, CancellationToken cancellationToken)
    {
        var createdRoleId = await _rolesRepository.CreateRole(role, cancellationToken);

        return createdRoleId;
    }

    // Retrieves a role by its guid from the repository
    // Parameters: guid of the role and cancellation token
    // Returns: role model if found or throws UnknownIdentifierException if the role guid is unknown
    public async Task<Role> GetRoleAsync(Guid roleId, CancellationToken cancellationToken)
    {
        var allRoles = await _rolesRepository.GetAllRoles(cancellationToken);

        var role = allRoles.FirstOrDefault(r => r.Id == roleId);

        if (role == null)
            throw new UnknownIdentifierException("Unknown role id");

        return role;
    }

    // Retrieves a filtered list of roles based on the provided filter from the repository
    // Parameters: optional role filter model to filter roles and cancellation token
    // Returns: list of role models matching the filter, sorted by publish access level and then by name
    public async Task<List<Role>> GetFilteredRolesAsync(RoleFilter? roleFilter, CancellationToken cancellationToken)
    {
        var roles = await _rolesRepository.GetAllRoles(cancellationToken);

        if (roleFilter is null)
            return roles;

        if (roleFilter.PartOfName is not null)
        {
            roles = roles
                .Where(r => r.Name.ToLower().Contains(roleFilter.PartOfName.ToLower()))
                .ToList();
        }

        if (roleFilter.AccessLevelFrom is not null)
        {
            roles = roles
                .Where(r => r.AccessLevel >= roleFilter.AccessLevelFrom)
                .ToList();
        }

        if (roleFilter.AccessLevelTo is not null)
        {
            roles = roles
                .Where(r => r.AccessLevel <= roleFilter.AccessLevelTo)
                .ToList();
        }

        return roles.OrderBy(r => r.AccessLevel).ThenBy(r => r.Name).ToList();
    }

    public async Task<List<Permission>> GetAllPermissionsAsync(CancellationToken cancellationToken)
    {
        var permissions = await _rolesRepository.GetAllPermissions(cancellationToken);
        return permissions.OrderBy(p => p.Code).ToList();
    }

    public async Task<List<string>> GetRolePermissionCodesAsync(Guid roleId, CancellationToken cancellationToken)
    {
        return await _rolesRepository.GetRolePermissionCodes(roleId, cancellationToken);
    }

    public async Task<Guid> SetRolePermissionCodesAsync(Guid roleId, IReadOnlyCollection<string> permissionCodes,
        CancellationToken cancellationToken)
    {
        return await _rolesRepository.SetRolePermissionCodes(roleId, permissionCodes, cancellationToken);
    }

    public async Task<bool> RoleHasPermissionAsync(Guid roleId, string permissionCode, CancellationToken cancellationToken)
    {
        var permissionCodes = await _rolesRepository.GetRolePermissionCodes(roleId, cancellationToken);
        return permissionCodes.Contains(permissionCode, StringComparer.OrdinalIgnoreCase);
    }

    // Updates an existing role in the system via the repository
    // Parameters: guid of the role, role model with updated data, and cancellation token
    // Returns: guid of the updated role
    public async Task<Guid> UpdateRoleAsync(Guid roleId, Role newRole, CancellationToken cancellationToken)
    {
        var updatedRoleId = await _rolesRepository.UpdateRole(roleId, newRole, cancellationToken);

        return updatedRoleId;
    }

    // Deletes a role from the system via the repository
    // Parameters: guid of the role and cancellation token
    // Returns: guid of the deleted role
    public async Task<Guid> DeleteRoleAsync(Guid roleId, CancellationToken cancellationToken)
    {
        var deletedRoleId = await _rolesRepository.DeleteRole(roleId, cancellationToken);

        return deletedRoleId;
    }
}
