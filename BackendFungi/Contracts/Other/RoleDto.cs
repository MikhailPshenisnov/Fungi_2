namespace BackendFungi.Contracts.Other;

public record RoleDto(
    Guid Id,
    string Name,
    int AccessLevel,
    List<string> Permissions
);
