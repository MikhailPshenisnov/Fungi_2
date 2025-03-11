using BackendFungi.Abstractions.Services;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using BackendFungi.Models.Other;

namespace BackendFungi.Services;

public class DataInitializationService : IDataInitializationService
{
    private readonly IConfiguration _configuration;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    private DateTime LastInitializationCheckDate { get; set; }

    public DataInitializationService(IConfiguration configuration, IServiceScopeFactory serviceScopeFactory)
    {
        _configuration = configuration;
        _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task InitializeData(CancellationToken cancellationToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var rolesService = scope.ServiceProvider.GetRequiredService<IRolesService>();
        var usersService = scope.ServiceProvider.GetRequiredService<IUsersService>();

        var configCheck = new List<string?>
            {
                _configuration["ConnectionStrings:FungiDbContext"],
                _configuration["Jwt:Key"],
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                _configuration["Frontend:FrontendAddress"],
                _configuration["DataInitialization:DefaultSuperUserRoleName"],
                _configuration["DataInitialization:DefaultCommonUserRoleName"],
                _configuration["DataInitialization:DefaultSuperUserUsername"],
                _configuration["DataInitialization:DefaultSuperUserPassword"]
            }
            .Select(x => x is null)
            .ToList()
            .Any();
        
        if (configCheck)
            throw new InitializationException("The configuration lacks the necessary information");

        var dataInitializationConfig = _configuration.GetSection("DataInitialization");

        var allRoles = await rolesService.GetFilteredRolesAsync(null, cancellationToken);

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

            await rolesService.CreateRoleAsync(superUserRole, cancellationToken);
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

            await rolesService.CreateRoleAsync(commonUserRole, cancellationToken);
        }

        var allUsers = await usersService.GetFilteredUsersAsync(null, cancellationToken);

        var existingSuperUser = allUsers
            .FirstOrDefault(u => u.Role.AccessLevel == (int)AccessLevelEnumerator.SuperUser);
        if (existingSuperUser is null)
        {
            var superUserRole = (await rolesService.GetFilteredRolesAsync(null, cancellationToken))
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

            await usersService.CreateUserAsync(superUser, cancellationToken);
        }

        LastInitializationCheckDate = DateTime.Now;
    }

    public Task<bool> IsReinitializationNeededCheck(CancellationToken cancellationToken)
    {
        return Task.FromResult(DateTime.Now > LastInitializationCheckDate.AddHours(1));
    }
}