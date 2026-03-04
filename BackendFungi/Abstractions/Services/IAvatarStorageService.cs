using Microsoft.AspNetCore.Http;

namespace BackendFungi.Abstractions.Services;

public interface IAvatarStorageService
{
    Task<string> SaveUserAvatarAsync(Guid userId, IFormFile file, string? oldPath, CancellationToken ct);

    Task<bool> DeleteUserAvatarAsync(string? avatarPath, CancellationToken ct);

    string? BuildPublicUrl(string? avatarPath);
}
