using Microsoft.AspNetCore.Http;

namespace BackendFungi.Abstractions.Services;

public interface IArticleMediaStorageService
{
    Task<string> SaveArticleImageAsync(IFormFile file, CancellationToken ct);

    Task<bool> DeleteArticleImageAsync(string? mediaPath, CancellationToken ct);

    string? BuildPublicUrl(string? mediaPath);
}
