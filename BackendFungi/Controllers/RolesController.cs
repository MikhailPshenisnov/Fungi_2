using BackendFungi.Abstractions.Services;
using BackendFungi.Contracts.Other;
using BackendFungi.Contracts.Requests.RolesRequests;
using BackendFungi.Contracts.Responses;
using BackendFungi.Contracts.Responses.RolesResponses;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using BackendFungi.Models.Filters;
using Microsoft.AspNetCore.Mvc;

namespace BackendFungi.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class RolesController : ControllerBase
{
    private readonly IRolesService _rolesService;

    public RolesController(IRolesService rolesService)
    {
        _rolesService = rolesService;
    }

    [HttpGet]
    public async Task<IActionResult> GetRole([FromQuery] GetRoleRequest request, CancellationToken cancellationToken)
    {
        var role = await _rolesService
            .GetRoleAsync(request.RoleId, cancellationToken);

        var response = new BaseResponse<GetRoleResponse>(
            new GetRoleResponse(
                new RoleDto(
                    role.Id,
                    role.Name,
                    role.AccessLevel)),
            null);

        return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetFilteredRoles([FromQuery] GetFilteredRolesRequest request,
        CancellationToken cancellationToken)
    {
        var (roleFilter, roleFilterError) = RoleFilter
            .Create(request.PartOfName,
                request.AccessLevelFrom,
                request.AccessLevelTo);

        if (!string.IsNullOrEmpty(roleFilterError))
            throw new ConversionException($"Incorrect data format: {roleFilterError}");

        var filteredRoles = await _rolesService
            .GetFilteredRolesAsync(roleFilter, cancellationToken);

        var response = new BaseResponse<GetFilteredRolesResponse>(
            new GetFilteredRolesResponse(
                filteredRoles
                    .Select(role =>
                        new RoleDto(
                            role.Id,
                            role.Name,
                            role.AccessLevel))
                    .ToList()),
            null);

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateRole([FromBody] CreateRoleRequest request,
        CancellationToken cancellationToken)
    {
        var (role, roleError) = Role
            .Create(Guid.NewGuid(),
                request.Name,
                request.AccessLevel);

        if (!string.IsNullOrEmpty(roleError))
            throw new ConversionException($"Incorrect data format: {roleError}");

        var createdRoleId = await _rolesService
            .CreateRoleAsync(role, cancellationToken);

        var response = new BaseResponse<CreateRoleResponse>(
            new CreateRoleResponse(
                createdRoleId),
            null);

        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateRole([FromBody] UpdateRoleRequest request,
        CancellationToken cancellationToken)
    {
        var (newRole, newRoleError) = Role
            .Create(request.RoleId,
                request.NewName,
                request.NewAccessLevel);

        if (!string.IsNullOrEmpty(newRoleError))
            throw new ConversionException($"Incorrect data format: {newRoleError}");

        var updatedRoleId = await _rolesService
            .UpdateRoleAsync(request.RoleId, newRole, cancellationToken);

        var response = new BaseResponse<UpdateRoleResponse>(
            new UpdateRoleResponse(
                updatedRoleId),
            null);

        return Ok(response);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteRole([FromQuery] DeleteRoleRequest request,
        CancellationToken cancellationToken)
    {
        var deletedRoleId = await _rolesService
            .DeleteRoleAsync(request.RoleId, cancellationToken);

        var response = new BaseResponse<DeleteRoleResponse>(
            new DeleteRoleResponse(
                deletedRoleId),
            null);

        return Ok(response);
    }
}