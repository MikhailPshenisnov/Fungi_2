namespace BackendFungi.Contracts.Requests.RolesRequests;

public record SetRolePermissionsRequest(
    Guid RoleId,
    List<string> PermissionCodes
);
