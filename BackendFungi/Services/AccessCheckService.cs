using BackendFungi.Abstractions.Services;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace BackendFungi.Services;

public class AccessCheckService : IAccessCheckService
{
    private readonly IAuthorizationService _authorizationService;
    private readonly IUsersService _usersService;

    public AccessCheckService(IAuthorizationService authorizationService, IUsersService usersService)
    {
        _authorizationService = authorizationService;
        _usersService = usersService;
    }

    public async Task<User> CheckAccessLevel(HttpContext context, int minAccessLevel,
        CancellationToken cancellationToken)
    {
        var token = await context
            .GetTokenAsync(JwtBearerDefaults.AuthenticationScheme, "access_token");

        if (token is null)
            throw new AccessException("The user does not have sufficient access rights");

        // request.Headers.TryGetValue("Authorization", out var authHeader);
        // var token = authHeader.ToString().Replace("Bearer ", string.Empty);

        var tokenData = await _authorizationService.ValidateToken(token, cancellationToken);

        var user = await _usersService.GetUserAsync(tokenData.UserId, cancellationToken);

        if (user.Role.AccessLevel > minAccessLevel)
            throw new AccessException("The user does not have sufficient access rights");

        return user;
    }
}