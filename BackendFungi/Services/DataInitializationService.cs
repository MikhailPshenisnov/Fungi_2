using BackendFungi.Abstractions.Services;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using BackendFungi.Models.Other;

namespace BackendFungi.Services;

public class DataInitializationService : IDataInitializationService
{
    private readonly IConfiguration _configuration;
    private readonly IRolesService _rolesService;
    private readonly IUsersService _usersService;

    private static DateTime LastInitializationCheckDate { get; set; }

    public DataInitializationService(IConfiguration configuration, IRolesService rolesService,
        IUsersService usersService)
    {
        _configuration = configuration;
        _rolesService = rolesService;
        _usersService = usersService;
    }

    public async Task InitializeData(CancellationToken cancellationToken)
    {
        var dataInitializationConfig = _configuration.GetSection("DataInitialization");

        var allRoles = await _rolesService.GetFilteredRolesAsync(null, cancellationToken);

        var existingSuperUserRole = allRoles
            .FirstOrDefault(r => r.AccessLevel == (int)AccessLevelEnumerator.SuperUser);
        if (existingSuperUserRole is null)
        {
            var (superUserRole, superUserRoleError) = Role.Create(
                Guid.NewGuid(),
                dataInitializationConfig["DefaultSuperUserRoleName"] ?? string.Empty,
                (int)AccessLevelEnumerator.SuperUser);

            if (!string.IsNullOrEmpty(superUserRoleError))
                throw new InitializationException($"Incorrect data format while initialization process, unable to " +
                                                  $"create a role model: {superUserRoleError}");

            await _rolesService.CreateRoleAsync(superUserRole, cancellationToken);
        }

        var existingCommonUserRole = allRoles
            .FirstOrDefault(r => r.AccessLevel == (int)AccessLevelEnumerator.CommonUser);
        if (existingCommonUserRole is null)
        {
            var (commonUserRole, commonUserRoleError) = Role.Create(
                Guid.NewGuid(),
                dataInitializationConfig["DefaultCommonUserRoleName"] ?? string.Empty,
                (int)AccessLevelEnumerator.SuperUser);

            if (!string.IsNullOrEmpty(commonUserRoleError))
                throw new InitializationException($"Incorrect data format while initialization process, unable to " +
                                                  $"create a role model: {commonUserRoleError}");

            await _rolesService.CreateRoleAsync(commonUserRole, cancellationToken);
        }

        var allUsers = await _usersService.GetFilteredUsersAsync(null, cancellationToken);

        var existingSuperUser = allUsers
            .FirstOrDefault(u => u.Role.AccessLevel == (int)AccessLevelEnumerator.SuperUser);
        if (existingSuperUser is null)
        {
            var superUserRole = (await _rolesService.GetFilteredRolesAsync(null, cancellationToken))
                .FirstOrDefault(r => r.AccessLevel == (int)AccessLevelEnumerator.SuperUser);

            var (superUser, superUserError) = User.Create(
                Guid.NewGuid(),
                dataInitializationConfig["DefaultSuperUserUsername"] ?? string.Empty,
                null,
                dataInitializationConfig["DefaultSuperUserPassword"] ?? string.Empty,
                false,
                superUserRole!);

            if (!string.IsNullOrEmpty(superUserError))
                throw new InitializationException($"Incorrect data format while initialization process, unable to " +
                                                  $"create a user model: {superUserError}");

            await _usersService.CreateUserAsync(superUser, cancellationToken);
        }

        LastInitializationCheckDate = DateTime.Now;
    }

    public Task<bool> IsReinitializationNeededCheck(CancellationToken cancellationToken)
    {
        return Task.FromResult(DateTime.Now > LastInitializationCheckDate.AddHours(1));
    }
}