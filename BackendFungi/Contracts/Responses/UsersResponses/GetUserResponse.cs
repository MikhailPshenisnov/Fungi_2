using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses.UsersResponses;

public record GetUserResponse(
    UserDto User
);