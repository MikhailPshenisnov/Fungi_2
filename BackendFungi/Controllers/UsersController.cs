using BackendFungi.Abstractions.Services;
using BackendFungi.Contracts.Other;
using BackendFungi.Contracts.Requests.UsersRequests;
using BackendFungi.Contracts.Responses;
using BackendFungi.Contracts.Responses.UsersResponses;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models.Filters;
using BackendFungi.Models.Other;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace BackendFungi.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class UsersController : ControllerBase
{
    private readonly IAccessCheckService _accessCheckService;
    private readonly IAvatarStorageService _avatarStorageService;
    private readonly IRolesService _rolesService;
    private readonly IUsersService _usersService;

    public UsersController(IAccessCheckService accessCheckService, IUsersService usersService,
        IAvatarStorageService avatarStorageService,
        IRolesService rolesService)
    {
        _accessCheckService = accessCheckService;
        _rolesService = rolesService;
        _usersService = usersService;
        _avatarStorageService = avatarStorageService;
    }

    // TODO: FIX THIS STRANGE METHOD AND CHECK REQUESTS RESPONSES FOR IT
    
    /*
        Я хз что это за метод, Саня тут костылей нагородил, переделайте или
        используйте базированный GetFilteredUsers без фильтра
    */
    
    [HttpGet]
    [SwaggerOperation(OperationId = "TestGetUsers", Summary = "Test get users",
        Description = "I don't know, something like GetFilteredUsers, but something crazy")]
    public async Task<ActionResult<BaseResponse<List<TestUsers>>>> TestGetUsers(CancellationToken cancellationToken)
    {
        UserFilter? userFilter = null;

        var users = await _usersService
            .GetFilteredUsersAsync(userFilter, cancellationToken);

        var response = new List<TestUsers>(
            users
                .Select(u => new TestUsers(
                    u.Id.ToString(),
                    u.Email,
                    u.Username,
                    u.Role.Id.ToString()))
                .ToList());

        return Ok(response);
    }

    [Authorize]
    [HttpGet]
    [SwaggerOperation(OperationId = "GetUser", Summary = "Get user",
        Description = "Receives information about the user by id")]
    public async Task<ActionResult<BaseResponse<GetUserResponse>>> GetUser([FromQuery] GetUserRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _usersService
            .GetUserAsync(request.UserId, cancellationToken);

        var response = new BaseResponse<GetUserResponse>(
            new GetUserResponse(
                MapUserToDto(user)),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpGet]
    [SwaggerOperation(OperationId = "GetFilteredUsers", Summary = "Get filtered users",
        Description = "Gets a list of users with filters")]
    public async Task<ActionResult<BaseResponse<GetFilteredUsersResponse>>> GetFilteredUsers([FromQuery] GetFilteredUsersRequest request,
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.UsersRead,
            cancellationToken);

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
                    .Select(MapUserToDto)
                    .ToList()),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    [SwaggerOperation(OperationId = "CreateUser", Summary = "Create user",
        Description = "Creates user")]
    public async Task<ActionResult<BaseResponse<CreateUserResponse>>> CreateUser([FromBody] CreateUserRequest request,
        CancellationToken cancellationToken)
    {
        var u = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.UsersManage,
            cancellationToken);

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

        if (u.Role.AccessLevel >= user.Role.AccessLevel)
            throw new AccessException("The user does not have sufficient access rights");

        var createdUserId = await _usersService
            .CreateUserAsync(user, cancellationToken);

        var response = new BaseResponse<CreateUserResponse>(
            new CreateUserResponse(
                createdUserId),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpGet]
    [SwaggerOperation(OperationId = "GetCurrentUserProfile", Summary = "Get current user profile",
        Description = "Returns profile data for the currently authenticated user")]
    public async Task<ActionResult<BaseResponse<GetCurrentUserProfileResponse>>> GetCurrentUserProfile(
        CancellationToken cancellationToken)
    {
        var currentUser = await _accessCheckService.GetCurrentUser(HttpContext, cancellationToken);

        var response = new BaseResponse<GetCurrentUserProfileResponse>(
            new GetCurrentUserProfileResponse(
                MapUserToDto(currentUser)),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    [Consumes("multipart/form-data")]
    [SwaggerOperation(OperationId = "UploadMyAvatar", Summary = "Upload current user avatar",
        Description = "Uploads avatar image, crops it to square and stores as WebP")]
    public async Task<ActionResult<BaseResponse<UploadMyAvatarResponse>>> UploadMyAvatar(
        [FromForm] UploadMyAvatarRequest request,
        CancellationToken cancellationToken)
    {
        var currentUser = await _accessCheckService.GetCurrentUser(HttpContext, cancellationToken);

        var avatarPath = await _avatarStorageService
            .SaveUserAvatarAsync(currentUser.Id, request.Avatar, currentUser.AvatarPath, cancellationToken);

        await _usersService
            .SetUserAvatarPathAsync(currentUser.Id, avatarPath, cancellationToken);

        var response = new BaseResponse<UploadMyAvatarResponse>(
            new UploadMyAvatarResponse(
                _avatarStorageService.BuildPublicUrl(avatarPath) ?? string.Empty),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpDelete]
    [SwaggerOperation(OperationId = "DeleteMyAvatar", Summary = "Delete current user avatar",
        Description = "Deletes avatar for the currently authenticated user")]
    public async Task<ActionResult<BaseResponse<DeleteMyAvatarResponse>>> DeleteMyAvatar(
        CancellationToken cancellationToken)
    {
        var currentUser = await _accessCheckService.GetCurrentUser(HttpContext, cancellationToken);

        var hadAvatar = !string.IsNullOrWhiteSpace(currentUser.AvatarPath);

        if (hadAvatar)
        {
            await _avatarStorageService.DeleteUserAvatarAsync(currentUser.AvatarPath, cancellationToken);
            await _usersService.SetUserAvatarPathAsync(currentUser.Id, null, cancellationToken);
        }

        var response = new BaseResponse<DeleteMyAvatarResponse>(
            new DeleteMyAvatarResponse(
                hadAvatar,
                null),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPut]
    [SwaggerOperation(OperationId = "UpdateUser", Summary = "Update user",
        Description = "Updates user info by id")]
    public async Task<ActionResult<BaseResponse<UpdateUserResponse>>> UpdateUser([FromBody] UpdateUserRequest request,
        CancellationToken cancellationToken)
    {
        var u = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.UsersManage,
            cancellationToken);

        var existingUser = await _usersService
            .GetUserAsync(request.UserId, cancellationToken);

        var newRole = await _rolesService.GetRoleAsync(request.NewRoleId, cancellationToken);

        var (newUser, newUserError) = Models.User
            .Create(request.UserId,
                request.NewUsername,
                request.NewEmail,
                request.NewPassword,
                false,
                newRole,
                existingUser.AvatarPath);

        if (!string.IsNullOrEmpty(newUserError))
            throw new ConversionException($"Incorrect data format: {newUserError}");

        if (u.Role.AccessLevel >= newUser.Role.AccessLevel)
            throw new AccessException("The user does not have sufficient access rights");

        if (u.Role.AccessLevel >= existingUser.Role.AccessLevel)
            throw new AccessException("The user does not have sufficient access rights");

        var updatedUserId = await _usersService
            .UpdateUserAsync(request.UserId, newUser, cancellationToken);

        var response = new BaseResponse<UpdateUserResponse>(
            new UpdateUserResponse(
                updatedUserId),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpDelete]
    [SwaggerOperation(OperationId = "DeleteUser", Summary = "Delete user",
        Description = "Deletes user by id")]
    public async Task<ActionResult<BaseResponse<DeleteUserResponse>>> DeleteUser([FromQuery] DeleteUserRequest request,
        CancellationToken cancellationToken)
    {
        var u = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.UsersDelete,
            cancellationToken);

        var existingUser = await _usersService
            .GetUserAsync(request.UserId, cancellationToken);

        if (u.Role.AccessLevel >= existingUser.Role.AccessLevel)
            throw new AccessException("The user does not have sufficient access rights");

        var deletedUserId = await _usersService
            .DeleteUserAsync(request.UserId, cancellationToken);

        var response = new BaseResponse<DeleteUserResponse>(
            new DeleteUserResponse(
                deletedUserId),
            null);

        return Ok(response);
    }
    
    // TODO: I HAVE NO IDEA
    
    /*
        Саня, че это за прикол вообще, я не помню такого метода
    */
    
    [Authorize]
    [HttpPost]
    [SwaggerOperation(OperationId = "UpdateUserSmallParam", Summary = "Update user with small parameters",
        Description = "Short version of UpdateUser")]
    public async Task<IActionResult> UpdateUserSmallParam([FromForm] UpdateUserRequestSmallParam request,
        CancellationToken cancellationToken)
    {
        var currentUser = await _accessCheckService.GetCurrentUser(HttpContext, cancellationToken);

        var newName = request.NewName?.Trim();

        if (string.IsNullOrEmpty(newName))
            throw new ConversionException("Incorrect data format: New username is not specified");

        if (newName == currentUser.Username)
            throw new ConversionException("Incorrect data format: New username must differ from current username");


        var (newUser, newUserError) = Models.User
            .Create(currentUser.Id,
                newName,
                currentUser.Email,
                currentUser.PasswordHash,
                true,
                currentUser.Role,
                currentUser.AvatarPath);

        if (!string.IsNullOrEmpty(newUserError))
            throw new ConversionException($"Incorrect data format: {newUserError}");

        await _usersService
            .UpdateUserAsync(currentUser.Id, newUser, cancellationToken);

        return Ok();
    }

    private UserDto MapUserToDto(Models.User user)
    {
        return new UserDto(
            user.Id,
            user.Username,
            user.Email,
            _avatarStorageService.BuildPublicUrl(user.AvatarPath),
            new RoleDto(
                user.Role.Id,
                user.Role.Name,
                user.Role.AccessLevel,
                user.Role.PermissionCodes.OrderBy(x => x).ToList()));
    }
}
