namespace BackendFungi.Contracts.Requests.AuthorizationRequests;

public record RegisterUserRequest(
    string Username,
    string? Email,
    string Password
);