using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses.UsersResponses;

public record GetCurrentUserProfileResponse(
    UserDto User
);
