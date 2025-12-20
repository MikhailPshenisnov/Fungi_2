namespace BackendFungi.Contracts.Responses.AuthorizationResponses;

public record GetCurrentUserDataResponse(
    string Token,
    string Name,
    string Email,
    int AsseccLvl,
    string UserId
);