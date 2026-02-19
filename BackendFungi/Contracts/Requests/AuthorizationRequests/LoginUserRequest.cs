using BackendFungi.Models;
using System.ComponentModel.DataAnnotations;

namespace BackendFungi.Contracts.Requests.AuthorizationRequests;

public record LoginUserRequest
{
    [Required]
    [EmailAddress]
    [MaxLength(User.MaxEmailLength)]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MinLength(User.MinPasswordLength)]
    [MaxLength(User.MaxPasswordLength)]
    public string Password { get; init; } = string.Empty;
}
