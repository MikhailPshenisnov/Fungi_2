using BackendFungi.Abstractions.Repositories;
using BackendFungi.Database.Context;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendFungi.Repositories;

public class RolesRepository : IRolesRepository
{
    private readonly FungiDbContext _context;

    public RolesRepository(FungiDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> CreateRole(Role role, CancellationToken cancellationToken)
    {
        var roleEntity = new Database.Entities.Role
        {
            Id = role.Id,
            Name = role.Name,
            AccessLevel = role.AccessLevel
        };

        await _context.Roles.AddAsync(roleEntity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return roleEntity.Id;
    }

    public async Task<List<Role>> GetAllRoles(CancellationToken cancellationToken)
    {
        var roleEntities = await _context.Roles
            .Include(r => r.RolePermissions)
            .ThenInclude(rp => rp.Permission)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var roles = roleEntities
            .Select(roleEntity =>
            {
                var (role, roleError) = Role
                    .Create(roleEntity.Id,
                        roleEntity.Name,
                        roleEntity.AccessLevel,
                        roleEntity.RolePermissions
                            .Select(rp => rp.Permission.Code)
                            .OrderBy(code => code)
                            .ToList());

                if (!string.IsNullOrEmpty(roleError))
                    throw new IntegrityException($"Incorrect data format in the database, unable to create a " +
                                                 $"role model: {roleError}");

                return role;
            })
            .ToList();

        return roles;
    }

    public async Task<List<Permission>> GetAllPermissions(CancellationToken cancellationToken)
    {
        var permissionEntities = await _context.Permissions
            .AsNoTracking()
            .OrderBy(p => p.Code)
            .ToListAsync(cancellationToken);

        var permissions = permissionEntities
            .Select(permissionEntity =>
            {
                var (permission, permissionError) = Permission.Create(
                    permissionEntity.Id,
                    permissionEntity.Code,
                    permissionEntity.Name,
                    permissionEntity.Description,
                    permissionEntity.IsSystem);

                if (!string.IsNullOrEmpty(permissionError))
                    throw new IntegrityException($"Incorrect data format in the database, unable to create a " +
                                                 $"permission model: {permissionError}");

                return permission;
            })
            .ToList();

        return permissions;
    }

    public async Task<List<string>> GetRolePermissionCodes(Guid roleId, CancellationToken cancellationToken)
    {
        var roleExists = await _context.Roles
            .AsNoTracking()
            .AnyAsync(r => r.Id == roleId, cancellationToken);

        if (!roleExists)
            throw new UnknownIdentifierException("Unknown role id");

        var permissionCodes = await _context.RolePermissions
            .AsNoTracking()
            .Where(rp => rp.RoleId == roleId)
            .Include(rp => rp.Permission)
            .Select(rp => rp.Permission.Code)
            .OrderBy(code => code)
            .ToListAsync(cancellationToken);

        return permissionCodes;
    }

    public async Task<Guid> SetRolePermissionCodes(Guid roleId, IReadOnlyCollection<string> permissionCodes,
        CancellationToken cancellationToken)
    {
        var roleExists = await _context.Roles
            .AsNoTracking()
            .AnyAsync(r => r.Id == roleId, cancellationToken);

        if (!roleExists)
            throw new UnknownIdentifierException("Unknown role id");

        var normalizedCodes = permissionCodes
            .Select(code => (code ?? string.Empty).Trim().ToLowerInvariant())
            .Where(code => !string.IsNullOrWhiteSpace(code))
            .Distinct()
            .ToList();

        var permissions = await _context.Permissions
            .AsNoTracking()
            .Where(p => normalizedCodes.Contains(p.Code))
            .ToListAsync(cancellationToken);

        if (permissions.Count != normalizedCodes.Count)
        {
            var knownCodes = permissions.Select(p => p.Code).ToHashSet();
            var unknownCodes = normalizedCodes.Where(code => !knownCodes.Contains(code)).OrderBy(x => x);
            throw new UnknownIdentifierException($"Unknown permission codes: {string.Join(", ", unknownCodes)}");
        }

        await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

        await _context.RolePermissions
            .Where(rp => rp.RoleId == roleId)
            .ExecuteDeleteAsync(cancellationToken);

        if (permissions.Count > 0)
        {
            var rolePermissions = permissions
                .Select(p => new Database.Entities.RolePermission
                {
                    RoleId = roleId,
                    PermissionId = p.Id
                })
                .ToList();

            await _context.RolePermissions.AddRangeAsync(rolePermissions, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        await transaction.CommitAsync(cancellationToken);

        return roleId;
    }

    public async Task<Guid> UpdateRole(Guid roleId, Role newRole, CancellationToken cancellationToken)
    {
        var oldRoleEntity = await _context.Roles
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == roleId, cancellationToken);

        if (oldRoleEntity is null)
            throw new UnknownIdentifierException("Unknown role id");

        await _context.Roles
            .Where(r => r.Id == roleId)
            .ExecuteUpdateAsync(x => x
                    .SetProperty(r => r.Name, r => newRole.Name)
                    .SetProperty(r => r.AccessLevel, r => newRole.AccessLevel),
                cancellationToken);

        return oldRoleEntity.Id;
    }

    public async Task<Guid> DeleteRole(Guid roleId, CancellationToken cancellationToken)
    {
        var numDeleted = await _context.Roles
            .Where(r => r.Id == roleId)
            .ExecuteDeleteAsync(cancellationToken);

        if (numDeleted == 0)
            throw new UnknownIdentifierException("Unknown role id");

        return roleId;
    }
}
