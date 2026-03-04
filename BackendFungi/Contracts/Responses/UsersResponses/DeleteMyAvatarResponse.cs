namespace BackendFungi.Contracts.Responses.UsersResponses;

public record DeleteMyAvatarResponse(
    bool IsDeleted,
    string? AvatarUrl
);
