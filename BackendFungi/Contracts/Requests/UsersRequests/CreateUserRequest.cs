namespace BackendFungi.Contracts.Requests.UsersRequests;

public record CreateUserRequest(
    string Username,
    string? Email,
    string Password,
    Guid RoleId
);