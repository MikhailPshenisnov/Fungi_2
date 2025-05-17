using BackendFungi.Database.Entities;

namespace BackendFungi.Abstractions.Services;
public interface IArticleMushroomsService
{
    Task<Guid> AddMushroomToArticleAsync(Guid articleId, Guid mushroomId, CancellationToken ct);
    Task<List<ArticleMushroom>> GetAllMushroomsAsync(Guid articleId, CancellationToken ct);
    Task<Guid> DeleteMushroomFromArticle(Guid articleId, Guid mushroomId, CancellationToken ct);
}
