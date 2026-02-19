using BackendFungi.Models;
using System.ComponentModel.DataAnnotations;

namespace BackendFungi.Contracts.Requests.AuthorizationRequests;

public record RegisterUserRequest
{
    [Required]
    [MinLength(User.MinUsernameLength)]
    [MaxLength(User.MaxUsernameLength)]
    [RegularExpression(User.UsernamePattern)]
    public string Name { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(User.MaxEmailLength)]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MinLength(User.MinPasswordLength)]
    [MaxLength(User.MaxPasswordLength)]
    [RegularExpression(User.PasswordPolicyPattern)]
    public string Password { get; init; } = string.Empty;
}
