namespace BackendFungi.Contracts.Requests.UsersRequests;

public record UpdateUserRequestSmallParam(
    string UserEmail,
    string? NewName
);