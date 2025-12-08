namespace BackendFungi.Contracts.Responses.UsersResponses;

public record TestUsers(
    string UserId,
    string Email,
    string Name,
    string Role
);