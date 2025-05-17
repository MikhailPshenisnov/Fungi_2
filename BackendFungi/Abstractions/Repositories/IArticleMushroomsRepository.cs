using BackendFungi.Database.Entities;

namespace BackendFungi.Abstractions.Repositories;

public interface IArticleMushroomsRepository
{
    Task<Guid> AddMushroomToArticleAsync(Guid articleId, Guid mushroomId, CancellationToken ct);
    Task<List<ArticleMushroom>> GetAllMushroomsAsync(Guid articleId, CancellationToken ct);
    Task<Guid> DeleteMushroomFromArticle(Guid articleId, Guid mushroomId, CancellationToken ct);
}