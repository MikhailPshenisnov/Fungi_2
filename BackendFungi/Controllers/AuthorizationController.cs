using BackendFungi.Abstractions.Services;
using BackendFungi.Contracts.Other;
using BackendFungi.Contracts.Requests.AuthorizationRequests;
using BackendFungi.Contracts.Responses;
using BackendFungi.Contracts.Responses.AuthorizationResponses;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models.Filters;
using BackendFungi.Models.Other;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using IAuthorizationService = BackendFungi.Abstractions.Services.IAuthorizationService;


namespace BackendFungi.Controllers;

// TODO: FIX AUTH

/*
    Требуется переделать авторизацию от хранения в куках на авторизацию здорового человека
    Ну там через локал сторэдж и все такое
*/

[ApiController]
[Route("[controller]/[action]")]
public class AuthorizationController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IAuthorizationService _authorizationService;
    private readonly IRolesService _rolesService;
    private readonly IUsersService _usersService;

    public AuthorizationController(IAuthorizationService authorizationService,
        IRolesService rolesService, IUsersService usersService, IConfiguration configuration)
    {
        _authorizationService = authorizationService;
        _rolesService = rolesService;
        _usersService = usersService;
        _configuration = configuration;
    }

    [HttpPost]
    [SwaggerOperation(OperationId = "LoginUser", Summary = "Login user",
        Description = "Performs the user login procedure")]
    public async Task<ActionResult<BaseResponse<LoginUserResponse>>> LoginUser([FromBody] LoginUserRequest loginUserRequest,
        CancellationToken cancellationToken)
    {
        var token = await _authorizationService
            .LoginUser(loginUserRequest.Email, loginUserRequest.Password, cancellationToken);

        var response = new BaseResponse<LoginUserResponse>(
            new LoginUserResponse(
                token),
            null);

        return Ok(response);
    }

    [HttpPost]
    [SwaggerOperation(OperationId = "RegisterUser", Summary = "Register user",
        Description = "Performs user registration procedure")]
    public async Task<ActionResult<BaseResponse<RegisterUserResponse>>> RegisterUser([FromBody] RegisterUserRequest registerUserRequest,
        CancellationToken cancellationToken)
    {
        // проверка авторизации, что пользователь не вошел в аккаунт
        if (User.Identity is { IsAuthenticated: true })
        {
            var res = new BaseResponse<RegisterUserResponse>(
                null,
                new ExceptionDto(
                    ErrorCodes.RegistrationError,
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
        var defaultCommonRoleName = _configuration["DataInitialization:DefaultCommonUserRoleName"] ?? "CommonUser";

        var existingCommonUserRole = allRoles
            .FirstOrDefault(r => string.Equals(r.Name, defaultCommonRoleName, StringComparison.OrdinalIgnoreCase));

        if (existingCommonUserRole is null)
        {
            throw new IntegrityException("Unable to register user, common user role is not available");
        }

        var (user, userError) = Models.User
            .Create(Guid.NewGuid(),
                registerUserRequest.Name,
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
            .LoginUser(registerUserRequest.Email, registerUserRequest.Password, cancellationToken);

        var response = new BaseResponse<RegisterUserResponse>(
            new RegisterUserResponse(
                token),
            null);

        return Ok(response);
    }

    [HttpGet]
    [SwaggerOperation(OperationId = "GetCurrentUserToken", Summary = "Get current user token",
        Description = "Returns current user token")]
    public ActionResult<BaseResponse<GetCurrentUserTokenResponse>> GetCurrentUserToken(CancellationToken cancellationToken)
    {
        var token = TryExtractBearerTokenFromHeader();

        var response = new BaseResponse<GetCurrentUserTokenResponse>(
            new GetCurrentUserTokenResponse(
                token ?? string.Empty),
            null);
        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    [SwaggerOperation(OperationId = "ValidateToken", Summary = "Validate token",
        Description = "Allows you to obtain information about the user by token. " +
                      "Requires Authorization header in format: Bearer <token>.")]
    public async Task<ActionResult<BaseResponse<ValidateTokenResponse>>> ValidateToken(
        CancellationToken cancellationToken)
    {
        var token = TryExtractBearerTokenFromHeader();
        if (string.IsNullOrWhiteSpace(token))
            throw new AuthorizationException("Authorization Bearer token is missing");

        var tokenData = await _authorizationService.ValidateToken(token, cancellationToken);

        var response = new BaseResponse<ValidateTokenResponse>(
            new ValidateTokenResponse(
                token,
                tokenData),
            null);

        return Ok(response);
    }

    [HttpPost]
    [SwaggerOperation(OperationId = "LogoutUser", Summary = "Logout user",
        Description = "Completes logout on API side for stateless bearer authentication")]
    public ActionResult LogoutUser(CancellationToken cancellationToken)
    {
        return Ok();
    }

    // TODO: DELETE THIS BAD METHOD
    
    /*
        Саня, выпили этот костыль, есть же ValidateToken и куки тоже выпили
    */
    
    // TODO: CHECK RETURN DATA TYPE
    
    /*
        Саня, я поставил тип данных с оберткой, вроде оно и должно обернуть само, хз короче проверь свой костыль
    */
    
    [HttpGet]
    [SwaggerOperation(OperationId = "GetCurrentDataUser", 
        Summary = "Get current data user [NOT RECOMMENDED TO USE]",
        Description = "An analogue of the ValidateToken method, but this is a piece of some king of strange code that " +
                      "Sanya made to connect front easier (P. S. Выпилите этот метод пожалуйста, ну что за треш, господа)")]
    public async Task<ActionResult<BaseResponse<GetCurrentUserDataResponse>>> GetCurrentDataUser(CancellationToken cancellationToken)
    {
        var token = TryExtractBearerTokenFromHeader() ?? string.Empty;

        if (token != String.Empty)
        {
            var tokenData = await _authorizationService.ValidateToken(token, cancellationToken);

            var (userFilter, userFilterError) = UserFilter
                .Create(null,
                    tokenData.Email,
                    null);

            var filteredUsers = await _usersService
                .GetFilteredUsersAsync(userFilter, cancellationToken);

            var userRoleAccessLevel = filteredUsers[0].Role.AccessLevel;
            var asseccLvl = userRoleAccessLevel switch
            {
                <= 5 => 2,
                <= 19 => 1,
                _ => 0
            };

            var response = new GetCurrentUserDataResponse(
                token,
                filteredUsers[0].Username,
                tokenData.Email,
                asseccLvl,
                filteredUsers[0].Id.ToString()
            );

            return Ok(response);
        }
        else
        {
            var response = new GetCurrentUserDataResponse(
                "",
                "",
                "",
                -1,
                ""
            );

            return Ok(response);
        }
    }

    private string? TryExtractBearerTokenFromHeader()
    {
        const string bearerPrefix = "Bearer ";

        if (!Request.Headers.TryGetValue("Authorization", out var authorizationHeader))
            return null;

        var authorizationValue = authorizationHeader.ToString();
        if (!authorizationValue.StartsWith(bearerPrefix, StringComparison.OrdinalIgnoreCase))
            return null;

        var token = authorizationValue[bearerPrefix.Length..].Trim();
        return string.IsNullOrWhiteSpace(token) ? null : token;
    }
}
