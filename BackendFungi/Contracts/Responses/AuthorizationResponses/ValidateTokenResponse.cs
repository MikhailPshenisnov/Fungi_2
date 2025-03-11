using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses.AuthorizationResponses;

public record ValidateTokenResponse(
    string Token,
    TokenDto TokenData
);