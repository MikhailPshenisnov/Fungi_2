using BackendFungi.Abstractions.Services;
using BackendFungi.Contracts.Other;
using BackendFungi.Contracts.Requests.AuthorizationRequests;
using BackendFungi.Contracts.Responses;
using BackendFungi.Contracts.Responses.AuthorizationResponses;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models.Other;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using IAuthorizationService = BackendFungi.Abstractions.Services.IAuthorizationService;


namespace BackendFungi.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class AuthorizationController : ControllerBase
{
    private readonly IAccessCheckService _accessCheckService;
    private readonly IAuthorizationService _authorizationService;
    private readonly IRolesService _rolesService;
    private readonly IUsersService _usersService;

    public AuthorizationController(IAccessCheckService accessCheckService, IAuthorizationService authorizationService,
        IRolesService rolesService, IUsersService usersService)
    {
        _accessCheckService = accessCheckService;
        _authorizationService = authorizationService;
        _rolesService = rolesService;
        _usersService = usersService;
    }

    [HttpPost]
    public async Task<IActionResult> LoginUser([FromBody] LoginUserRequest loginUserRequest,
        CancellationToken cancellationToken)
    {
        var token = await _authorizationService
            .LoginUser(loginUserRequest.Username, loginUserRequest.Password, cancellationToken);

        Response.Cookies.Append("jwt_token", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict
        });

        var response = new BaseResponse<LoginUserResponse>(
            new LoginUserResponse(
                token),
            null);

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterUserRequest registerUserRequest,
        CancellationToken cancellationToken)
    {
        // проверка авторизации, что пользователь не вошел в аккаунт
        if (User.Identity is { IsAuthenticated: true })
        {
            var res = new BaseResponse<RegisterUserResponse>(
                null,
                new ExceptionDto(
                    "Registration error",
                    "You cannot register, first leave the account"));
            return StatusCode(StatusCodes.Status403Forbidden, res);
        }

        // try
        // {
        //     await _accessCheckService.CheckAccessLevel(
        //         HttpContext,
        //         (int)AccessLevelEnumerator.CommonUser,
        //         cancellationToken);
        //
        //     return Forbid();
        // }
        // catch (AccessException e)
        // {
        //     throw;
        // }

        // создание пользователя
        var allRoles = await _rolesService.GetFilteredRolesAsync(null, cancellationToken);

        var existingCommonUserRole = allRoles
            .FirstOrDefault(r => r.AccessLevel == (int)AccessLevelEnumerator.CommonUser);

        if (existingCommonUserRole is null)
        {
            throw new IntegrityException("Unable to register user, common user role is not available");
        }

        var (user, userError) = Models.User
            .Create(Guid.NewGuid(),
                registerUserRequest.Username,
                registerUserRequest.Email,
                registerUserRequest.Password,
                false,
                existingCommonUserRole);

        if (!string.IsNullOrEmpty(userError))
            throw new ConversionException($"Incorrect data format: {userError}");

        var createdUserId = await _usersService
            .CreateUserAsync(user, cancellationToken);

        // вход в аккаунт нового пользователя
        var token = await _authorizationService
            .LoginUser(registerUserRequest.Username, registerUserRequest.Password, cancellationToken);

        Response.Cookies.Append("jwt_token", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict
        });

        var response = new BaseResponse<RegisterUserResponse>(
            new RegisterUserResponse(
                token),
            null);

        return Ok(response);
    }

    [HttpGet]
    public Task<IActionResult> GetCurrentUserToken(CancellationToken cancellationToken)
    {
        Request.Cookies.TryGetValue("jwt_token", out var token);

        var response = new BaseResponse<GetCurrentUserTokenResponse>(
            new GetCurrentUserTokenResponse(
                token ?? string.Empty),
            null);

        return Task.FromResult<IActionResult>(Ok(response));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> ValidateToken([FromBody] ValidateTokenRequest? validateTokenRequest,
        CancellationToken cancellationToken)
    {
        Request.Cookies.TryGetValue("jwt_token", out var token);

        if (token is null)
            throw new AuthorizationException("Token is somehow null, but it is impossible");

        if (validateTokenRequest is not null)
        {
            await _accessCheckService.CheckAccessLevel(
                HttpContext,
                (int)AccessLevelEnumerator.JuniorAdministratorMin,
                cancellationToken);

            token = validateTokenRequest.Token;
        }

        var tokenData = await _authorizationService.ValidateToken(token, cancellationToken);

        var response = new BaseResponse<ValidateTokenResponse>(
            new ValidateTokenResponse(
                token,
                tokenData),
            null);

        return Ok(response);
    }

    [HttpGet]
    public Task<IActionResult> LogoutUser(CancellationToken cancellationToken)
    {
        Response.Cookies.Append("jwt_token", string.Empty, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict
        });

        return Task.FromResult<IActionResult>(Ok());
    }
}