namespace BackendFungi.Contracts.Requests.AuthorizationRequests;

public record LoginUserRequest(
    string Username,
    string Password
);