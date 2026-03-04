namespace BackendFungi.Contracts.Other;

public record PermissionDto(
    Guid Id,
    string Code,
    string Name,
    string? Description,
    bool IsSystem
);
