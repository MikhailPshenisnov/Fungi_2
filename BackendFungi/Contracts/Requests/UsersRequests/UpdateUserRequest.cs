namespace BackendFungi.Contracts.Requests.UsersRequests;

public record UpdateUserRequest(
    Guid UserId,
    string NewUsername,
    string? NewEmail,
    string NewPassword,
    Guid NewRoleId
);