using BackendFungi.Contracts.Other;

namespace BackendFungi.Abstractions.Services;

public interface IAuthorizationService
{
    Task<string> LoginUser(string login, string password, CancellationToken ct);

    Task<TokenDto> ValidateToken(string token, CancellationToken ct);
}