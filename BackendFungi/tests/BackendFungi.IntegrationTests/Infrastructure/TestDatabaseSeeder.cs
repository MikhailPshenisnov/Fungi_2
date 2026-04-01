using System.Reflection;
using BackendFungi.Database.Context;
using BackendFungi.Models.Other;
using Microsoft.EntityFrameworkCore;
using PermissionEntity = BackendFungi.Database.Entities.Permission;
using RoleEntity = BackendFungi.Database.Entities.Role;
using RolePermissionEntity = BackendFungi.Database.Entities.RolePermission;
using RoleModel = BackendFungi.Models.Role;
using UserEntity = BackendFungi.Database.Entities.User;
using UserModel = BackendFungi.Models.User;

namespace BackendFungi.IntegrationTests.Infrastructure;

public static class TestDatabaseSeeder
{
    public static async Task SeedAsync(FungiDbContext dbContext, CancellationToken cancellationToken)
    {
        await SeedPermissionsAsync(dbContext, cancellationToken);
        await SeedRolesAsync(dbContext, cancellationToken);
        await SeedUsersAsync(dbContext, cancellationToken);
    }

    private static async Task SeedPermissionsAsync(FungiDbContext dbContext, CancellationToken cancellationToken)
    {
        if (await dbContext.Permissions.AnyAsync(cancellationToken))
            return;

        var permissionCodes = typeof(PermissionCodes)
            .GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy)
            .Where(field => field.IsLiteral && !field.IsInitOnly && field.FieldType == typeof(string))
            .Select(field => (string)field.GetRawConstantValue()!)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(code => code, StringComparer.OrdinalIgnoreCase)
            .ToList();

        var permissions = permissionCodes
            .Select(code => new PermissionEntity
            {
                Id = Guid.NewGuid(),
                Code = code,
                Name = code,
                Description = "Seeded integration-test permission",
                IsSystem = true
            })
            .ToList();

        await dbContext.Permissions.AddRangeAsync(permissions, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task SeedRolesAsync(FungiDbContext dbContext, CancellationToken cancellationToken)
    {
        if (await dbContext.Roles.AnyAsync(cancellationToken))
            return;

        var roles = TestUsers.Roles
            .Select(role => new RoleEntity
            {
                Id = role.Id,
                Name = role.Name,
                AccessLevel = role.AccessLevel
            })
            .ToList();

        await dbContext.Roles.AddRangeAsync(roles, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        var permissionsByCode = (await dbContext.Permissions
                .AsNoTracking()
                .ToListAsync(cancellationToken))
            .ToDictionary(permission => permission.Code, permission => permission.Id, StringComparer.OrdinalIgnoreCase);

        var rolePermissions = TestUsers.Roles
            .SelectMany(role => role.PermissionCodes.Select(code => new RolePermissionEntity
            {
                RoleId = role.Id,
                PermissionId = permissionsByCode[code]
            }))
            .ToList();

        await dbContext.RolePermissions.AddRangeAsync(rolePermissions, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private static async Task SeedUsersAsync(FungiDbContext dbContext, CancellationToken cancellationToken)
    {
        if (await dbContext.Users.AnyAsync(cancellationToken))
            return;

        var rolesById = TestUsers.Roles.ToDictionary(role => role.Id);

        var users = TestUsers.All.Values
            .Select(seedUser =>
            {
                var role = rolesById[seedUser.RoleId];
                var (userModel, error) = UserModel.Create(
                    seedUser.Id,
                    seedUser.Username,
                    seedUser.Email,
                    seedUser.Password,
                    false,
                    RoleModel.Create(role.Id, role.Name, role.AccessLevel, role.PermissionCodes).Role);

                if (!string.IsNullOrWhiteSpace(error))
                    throw new InvalidOperationException($"Unable to build seeded user '{seedUser.Email}': {error}");

                return new UserEntity
                {
                    Id = seedUser.Id,
                    RoleId = seedUser.RoleId,
                    Username = seedUser.Username,
                    Email = seedUser.Email,
                    PasswordHash = userModel.PasswordHash
                };
            })
            .ToList();

        await dbContext.Users.AddRangeAsync(users, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
