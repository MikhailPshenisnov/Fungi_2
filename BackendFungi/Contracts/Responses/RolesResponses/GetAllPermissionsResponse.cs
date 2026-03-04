using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses.RolesResponses;

public record GetAllPermissionsResponse(
    List<PermissionDto> Permissions
);
