namespace BackendFungi.Contracts.Responses.RolesResponses;

public record SetRolePermissionsResponse(
    Guid RoleId,
    List<string> PermissionCodes
);
