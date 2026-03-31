using Microsoft.AspNetCore.Http;

namespace BackendFungi.Abstractions.Services;

public interface IMushroomMediaStorageService
{
    Task<string> SaveMushroomImageAsync(IFormFile file, CancellationToken ct);

    Task<bool> DeleteMushroomImageAsync(string? mediaPath, CancellationToken ct);

    string? BuildPublicUrl(string? mediaPath);
}
