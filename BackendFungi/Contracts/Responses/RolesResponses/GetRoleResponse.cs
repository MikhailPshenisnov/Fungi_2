using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses.RolesResponses;

public record GetRoleResponse(
    RoleDto Role
);