using BackendFungi.Abstractions.Services;
using BackendFungi.Contracts.Other;
using BackendFungi.Contracts.Requests.UsersRequests;
using BackendFungi.Contracts.Responses;
using BackendFungi.Contracts.Responses.UsersResponses;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models.Filters;
using Microsoft.AspNetCore.Mvc;

namespace BackendFungi.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class UsersController : ControllerBase
{
    private readonly IRolesService _rolesService;
    private readonly IUsersService _usersService;

    public UsersController(IUsersService usersService, IRolesService rolesService)
    {
        _rolesService = rolesService;
        _usersService = usersService;
    }

    [HttpGet]
    public async Task<IActionResult> GetUser([FromQuery] GetUserRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _usersService
            .GetUserAsync(request.UserId, cancellationToken);

        var response = new BaseResponse<GetUserResponse>(
            new GetUserResponse(
                new UserDto(
                    user.Id,
                    user.Username,
                    user.Email,
                    user.PasswordHash,
                    new RoleDto(
                        user.Role.Id,
                        user.Role.Name,
                        user.Role.AccessLevel))),
            null);

        return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetFilteredUsers([FromQuery] GetFilteredUsersRequest request,
        CancellationToken cancellationToken)
    {
        var (userFilter, userFilterError) = UserFilter
            .Create(request.PartOfUsername,
                request.PartOfEmail,
                request.RoleId);

        if (!string.IsNullOrEmpty(userFilterError))
            throw new ConversionException($"Incorrect data format: {userFilterError}");

        var filteredUsers = await _usersService
            .GetFilteredUsersAsync(userFilter, cancellationToken);

        var response = new BaseResponse<GetFilteredUsersResponse>(
            new GetFilteredUsersResponse(
                filteredUsers
                    .Select(user =>
                        new UserDto(
                            user.Id,
                            user.Username,
                            user.Email,
                            user.PasswordHash,
                            new RoleDto(
                                user.Role.Id,
                                user.Role.Name,
                                user.Role.AccessLevel)))
                    .ToList()),
            null);

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request,
        CancellationToken cancellationToken)
    {
        var role = await _rolesService.GetRoleAsync(request.RoleId, cancellationToken);

        var (user, userError) = Models.User
            .Create(Guid.NewGuid(),
                request.Username,
                request.Email,
                request.Password,
                false,
                role);

        if (!string.IsNullOrEmpty(userError))
            throw new ConversionException($"Incorrect data format: {userError}");

        var createdUserId = await _usersService
            .CreateUserAsync(user, cancellationToken);

        var response = new BaseResponse<CreateUserResponse>(
            new CreateUserResponse(
                createdUserId),
            null);

        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequest request,
        CancellationToken cancellationToken)
    {
        var newRole = await _rolesService.GetRoleAsync(request.NewRoleId, cancellationToken);

        var (newUser, newUserError) = Models.User
            .Create(request.UserId,
                request.NewUsername,
                request.NewEmail,
                request.NewPassword,
                false,
                newRole);

        if (!string.IsNullOrEmpty(newUserError))
            throw new ConversionException($"Incorrect data format: {newUserError}");

        var updatedUserId = await _usersService
            .UpdateUserAsync(request.UserId, newUser, cancellationToken);

        var response = new BaseResponse<UpdateUserResponse>(
            new UpdateUserResponse(
                updatedUserId),
            null);

        return Ok(response);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteUser([FromQuery] DeleteUserRequest request,
        CancellationToken cancellationToken)
    {
        var deletedUserId = await _usersService
            .DeleteUserAsync(request.UserId, cancellationToken);

        var response = new BaseResponse<DeleteUserResponse>(
            new DeleteUserResponse(
                deletedUserId),
            null);

        return Ok(response);
    }
}