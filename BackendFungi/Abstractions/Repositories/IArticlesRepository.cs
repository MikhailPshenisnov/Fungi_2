using BackendFungi.Models;

namespace BackendFungi.Abstractions.Repositories;

public interface IArticlesRepository
{
    Task<Guid> CreateArticle(Article article, CancellationToken ct);

    Task<List<Article>> GetAllArticles(CancellationToken ct);

    Task<Guid> UpdateArticle(Guid articleId, Article newArticle, CancellationToken ct);

    Task<Guid> DeleteArticle(Guid articleId, CancellationToken ct);
}