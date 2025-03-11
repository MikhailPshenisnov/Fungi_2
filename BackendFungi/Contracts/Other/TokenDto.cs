namespace BackendFungi.Contracts.Other;

public record TokenDto(
    Guid UserId,
    string Username,
    Guid RoleId,
    string RoleGroup
);