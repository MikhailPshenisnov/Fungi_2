using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace BackendFungi.Contracts.Requests.UsersRequests;

public record UploadMyAvatarRequest
{
    [Required]
    public IFormFile Avatar { get; init; } = null!;
}
