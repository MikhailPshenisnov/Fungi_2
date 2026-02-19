using BackendFungi.Models;
using System.ComponentModel.DataAnnotations;

namespace BackendFungi.Contracts.Requests.AuthorizationRequests;

public record LoginUserRequest(
    [property: Required]
    [property: EmailAddress]
    [property: MaxLength(User.MaxEmailLength)]
    string Email,
    [property: Required]
    [property: MinLength(User.MinPasswordLength)]
    [property: MaxLength(User.MaxPasswordLength)]
    string Password
);
