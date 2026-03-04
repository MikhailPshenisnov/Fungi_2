using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BackendFungi.Abstractions.Services;
using BackendFungi.Contracts.Other;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using Microsoft.IdentityModel.Tokens;

namespace BackendFungi.Services;

public class AuthorizationService : IAuthorizationService
{
    private readonly IUsersService _usersService;
    private readonly IConfiguration _configuration;

    public AuthorizationService(IUsersService usersService, IConfiguration configuration)
    {
        _usersService = usersService;
        _configuration = configuration;
    }

    public async Task<string> LoginUser(string username, string password, CancellationToken cancellationToken)
    {
        var user = (await _usersService.GetFilteredUsersAsync(null, cancellationToken))
            .FirstOrDefault(u => u.Email == username);

        if (user is null)
            throw new AuthorizationException("Invalid login or password");

        if (!BCrypt.Net.BCrypt.EnhancedVerify(password, user.PasswordHash))
            throw new AuthorizationException("Invalid login or password");

        var token = await GenerateJwtToken(user, cancellationToken);

        return token;
    }

    public async Task<TokenDto> ValidateToken(string token, CancellationToken cancellationToken)
    {
        var principal = await ValidateJwtToken(token, cancellationToken);

        try
        {
            var tokenData = new TokenDto(
                Guid.Parse(principal.FindFirst("UserId")?.Value!),
                principal.FindFirst("Name")?.Value!,
                principal.FindFirst("Email")?.Value!,
                Guid.Parse(principal.FindFirst("RoleId")?.Value!),
                principal.FindFirst("RoleGroup")?.Value!,
                principal.FindAll("Permission")
                    .Select(claim => claim.Value)
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .OrderBy(code => code)
                    .ToList());

            return tokenData;
        }
        catch (Exception e)
        {
            throw new IntegrityException("Invalid data format in the token", e);
        }
    }

    private Task<string> GenerateJwtToken(User user, CancellationToken cancellationToken)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]
                                         ?? throw new ConfigurationException("Jwt-key is missing"));

        var roleGroup = user.Role.Name;

        var claims = new List<Claim>
        {
            new("UserId", user.Id.ToString()),
            new("Name", user.Username),
            new("Email", user.Email),
            new("RoleId", user.Role.Id.ToString()),
            new("RoleGroup", roleGroup)
        };

        claims.AddRange(user.Role.PermissionCodes
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Select(code => new Claim("Permission", code)));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(30),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return Task.FromResult(tokenHandler.WriteToken(token));
    }

    private Task<ClaimsPrincipal> ValidateJwtToken(string token, CancellationToken cancellationToken)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]
                                         ?? throw new ConfigurationException("Jwt-key is missing"));

        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = _configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = _configuration["Jwt:Audience"],
            ValidateLifetime = true
        };

        var principal = tokenHandler.ValidateToken(token, validationParameters, out _);

        return Task.FromResult(principal);
    }
}
