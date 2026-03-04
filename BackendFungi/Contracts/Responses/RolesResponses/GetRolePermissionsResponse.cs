namespace BackendFungi.Contracts.Responses.RolesResponses;

public record GetRolePermissionsResponse(
    Guid RoleId,
    List<string> PermissionCodes
);
