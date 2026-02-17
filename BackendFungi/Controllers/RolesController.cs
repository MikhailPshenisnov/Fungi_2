using BackendFungi.Abstractions.Services;
using BackendFungi.Contracts.Other;
using BackendFungi.Contracts.Requests.RolesRequests;
using BackendFungi.Contracts.Responses;
using BackendFungi.Contracts.Responses.RolesResponses;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using BackendFungi.Models.Filters;
using BackendFungi.Models.Other;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace BackendFungi.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class RolesController : ControllerBase
{
    private readonly IAccessCheckService _accessCheckService;
    private readonly IRolesService _rolesService;

    public RolesController(IAccessCheckService accessCheckService, IRolesService rolesService)
    {
        _accessCheckService = accessCheckService;
        _rolesService = rolesService;
    }

    // TODO: FIX THIS STRANGE METHOD AND CHECK REQUESTS RESPONSES FOR IT
    
    /*
        Я хз что это за метод, Саня тут костылей нагородил, переделайте или 
        используйте базированный GetFilteredRoles без фильтра
    */
    
    [HttpGet]
    [SwaggerOperation(OperationId = "TestGetRoles", Summary = "Test get roles",
        Description = "I don't know, something like GetFilteredRoles, but something crazy")]
    public async Task<ActionResult<BaseResponse<List<TestRoles>>>> TestGetRoles(CancellationToken cancellationToken)
    {
        RoleFilter? roleFilter = null;

        var filteredRoles = await _rolesService
            .GetFilteredRolesAsync(roleFilter, cancellationToken);

        var response = new List<TestRoles>(
            filteredRoles
                .Select(role =>
                    {
                        var level = role.AccessLevel switch
                        {
                            20 => 0,
                            0 => 2,
                            _ => 1
                        };
                        return new TestRoles(
                            role.Id.ToString(),
                            role.Name,
                            level
                        );
                    }
                )
                .ToList());

        return Ok(response);
    }

    [Authorize]
    [HttpGet]
    [SwaggerOperation(OperationId = "GetRole", Summary = "Get role",
        Description = "Receives information about the role by id")]
    public async Task<ActionResult<BaseResponse<GetRoleResponse>>> GetRole([FromQuery] GetRoleRequest request, 
        CancellationToken cancellationToken)
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

    [Authorize]
    [HttpGet]
    [SwaggerOperation(OperationId = "GetFilteredRoles", Summary = "Get filtered roles",
        Description = "Gets a list of roles with filters")]
    public async Task<ActionResult<BaseResponse<GetFilteredRolesResponse>>> GetFilteredRoles([FromQuery] GetFilteredRolesRequest request,
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckAccessLevel(
            HttpContext,
            (int)AccessLevelEnumerator.JuniorAdministratorMin,
            cancellationToken);

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

    [Authorize]
    [HttpPost]
    [SwaggerOperation(OperationId = "CreateRole", Summary = "Create role",
        Description = "Creates role")]
    public async Task<ActionResult<BaseResponse<CreateRoleResponse>>> CreateRole([FromBody] CreateRoleRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.CheckAccessLevel(
            HttpContext,
            (int)AccessLevelEnumerator.JuniorAdministratorMin,
            cancellationToken);

        var (role, roleError) = Role
            .Create(Guid.NewGuid(),
                request.Name,
                request.AccessLevel);

        if (!string.IsNullOrEmpty(roleError))
            throw new ConversionException($"Incorrect data format: {roleError}");

        if (user.Role.AccessLevel >= role.AccessLevel)
            throw new AccessException("The user does not have sufficient access rights");

        var createdRoleId = await _rolesService
            .CreateRoleAsync(role, cancellationToken);

        var response = new BaseResponse<CreateRoleResponse>(
            new CreateRoleResponse(
                createdRoleId),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPut]
    [SwaggerOperation(OperationId = "UpdateRole", Summary = "Update role",
        Description = "Updates role info by id")]
    public async Task<ActionResult<BaseResponse<UpdateRoleResponse>>> UpdateRole([FromBody] UpdateRoleRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.CheckAccessLevel(
            HttpContext,
            (int)AccessLevelEnumerator.JuniorAdministratorMin,
            cancellationToken);

        var (newRole, newRoleError) = Role
            .Create(request.RoleId,
                request.NewName,
                request.NewAccessLevel);

        if (!string.IsNullOrEmpty(newRoleError))
            throw new ConversionException($"Incorrect data format: {newRoleError}");

        if (user.Role.AccessLevel >= newRole.AccessLevel)
            throw new AccessException("The user does not have sufficient access rights");

        var existingRole = await _rolesService
            .GetRoleAsync(request.RoleId, cancellationToken);

        if (user.Role.AccessLevel >= existingRole.AccessLevel)
            throw new AccessException("The user does not have sufficient access rights");

        var updatedRoleId = await _rolesService
            .UpdateRoleAsync(request.RoleId, newRole, cancellationToken);

        var response = new BaseResponse<UpdateRoleResponse>(
            new UpdateRoleResponse(
                updatedRoleId),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpDelete]
    [SwaggerOperation(OperationId = "DeleteRole", Summary = "Delete role",
        Description = "Deletes role by id")]
    public async Task<ActionResult<BaseResponse<DeleteRoleResponse>>> DeleteRole([FromQuery] DeleteRoleRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.CheckAccessLevel(
            HttpContext,
            (int)AccessLevelEnumerator.AdministratorMin,
            cancellationToken);

        var existingRole = await _rolesService
            .GetRoleAsync(request.RoleId, cancellationToken);

        if (user.Role.AccessLevel >= existingRole.AccessLevel)
            throw new AccessException("The user does not have sufficient access rights");

        var deletedRoleId = await _rolesService
            .DeleteRoleAsync(request.RoleId, cancellationToken);

        var response = new BaseResponse<DeleteRoleResponse>(
            new DeleteRoleResponse(
                deletedRoleId),
            null);

        return Ok(response);
    }
}