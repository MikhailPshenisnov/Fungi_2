using BackendFungi.Models;
using System.ComponentModel.DataAnnotations;

namespace BackendFungi.Contracts.Requests.AuthorizationRequests;

public record RegisterUserRequest(
    [property: Required]
    [property: MinLength(User.MinUsernameLength)]
    [property: MaxLength(User.MaxUsernameLength)]
    [property: RegularExpression(User.UsernamePattern)]
    string Name,
    [property: Required]
    [property: EmailAddress]
    [property: MaxLength(User.MaxEmailLength)]
    string Email,
    [property: Required]
    [property: MinLength(User.MinPasswordLength)]
    [property: MaxLength(User.MaxPasswordLength)]
    [property: RegularExpression(User.PasswordPolicyPattern)]
    string Password
);
