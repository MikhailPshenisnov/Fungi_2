using BackendFungi.Contracts.Other;
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

    [Range(typeof(bool), "true", "true", ErrorMessage = "User agreement consent must be accepted")]
    public bool IsUserAgreementAccepted { get; init; }

    [Range(typeof(bool), "true", "true", ErrorMessage = "Personal data processing consent must be accepted")]
    public bool IsPersonalDataProcessingConsentAccepted { get; init; }

    [Required]
    [MaxLength(32)]
    [RegularExpression(LegalConsentConstants.UserAgreementVersionPattern, ErrorMessage = "Unsupported user agreement version")]
    public string UserAgreementVersion { get; init; } = string.Empty;

    [Required]
    [MaxLength(32)]
    [RegularExpression(
        LegalConsentConstants.PersonalDataProcessingConsentVersionPattern,
        ErrorMessage = "Unsupported personal data processing consent version")]
    public string PersonalDataProcessingConsentVersion { get; init; } = string.Empty;
}
