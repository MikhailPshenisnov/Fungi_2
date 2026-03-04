namespace BackendFungi.Contracts.Other;

public record TokenDto(
    Guid UserId,
    string Name,
    string Email,
    Guid RoleId,
    string RoleGroup,
    List<string> Permissions
);
