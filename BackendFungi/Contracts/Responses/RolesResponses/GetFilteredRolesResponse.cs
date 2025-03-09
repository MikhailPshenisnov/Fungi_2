using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses.RolesResponses;

public record GetFilteredRolesResponse(
    List<RoleDto> Roles
);