namespace BackendFungi.Contracts.Requests.UsersRequests;

public record GetFilteredUsersRequest(
    string? PartOfUsername,
    string? PartOfEmail,
    Guid? RoleId
);