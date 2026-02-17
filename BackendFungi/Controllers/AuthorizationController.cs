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
    [SwaggerOperation(OperationId = "LoginUser", Summary = "Login user",
        Description = "Performs the user login procedure")]
    public async Task<ActionResult<BaseResponse<LoginUserResponse>>> LoginUser([FromBody] LoginUserRequest loginUserRequest,
        CancellationToken cancellationToken)
    {
        var token = await _authorizationService
            .LoginUser(loginUserRequest.Email, loginUserRequest.Password, cancellationToken);

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
    [SwaggerOperation(OperationId = "GetCurrentUserToken", Summary = "Get current user token",
        Description = "Returns current user token")]
    public async Task<ActionResult<BaseResponse<GetCurrentUserTokenResponse>>> GetCurrentUserToken(CancellationToken cancellationToken)
    {
        Request.Cookies.TryGetValue("jwt_token", out var token);

        var response = new BaseResponse<GetCurrentUserTokenResponse>(
            new GetCurrentUserTokenResponse(
                token ?? string.Empty),
            null);
        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    [SwaggerOperation(OperationId = "ValidateToken", Summary = "Validate token",
        Description = "Allows you to obtain information about the user by token")]
    public async Task<ActionResult<BaseResponse<ValidateTokenResponse>>> ValidateToken([FromBody] ValidateTokenRequest? validateTokenRequest,
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

    [HttpPost]
    [SwaggerOperation(OperationId = "LogoutUser", Summary = "Logout user",
        Description = "Removes user data from cookies")]
    public async Task<ActionResult> LogoutUser(CancellationToken cancellationToken)
    {
        Response.Cookies.Append("jwt_token", string.Empty, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict
        });

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
        Request.Cookies.TryGetValue("jwt_token", out var token);

        token = token ?? string.Empty;

        if (token != String.Empty)
        {
            var tokenData = await _authorizationService.ValidateToken(token, cancellationToken);

            int asseccLvl = 0;
            switch (tokenData.RoleGroup)
            {
                case "SuperUser":
                {
                    asseccLvl = 2;
                    break;
                }
                case "Administrator":
                {
                    asseccLvl = 1;
                    break;
                }
                case "Editor":
                {
                    asseccLvl = 1;
                    break;
                }
                case "CommonUser":
                {
                    asseccLvl = 0;
                    break;
                }
                default:
                {
                    asseccLvl = 0;
                    break;
                }
            }

            var (userFilter, userFilterError) = UserFilter
                .Create(null,
                    tokenData.Email,
                    null);

            var filteredUsers = await _usersService
                .GetFilteredUsersAsync(userFilter, cancellationToken);

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
}