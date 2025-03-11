using BackendFungi.Models;
using BackendFungi.Models.Filters;

namespace BackendFungi.Abstractions.Services;

public interface IArticlesService
{
    Task<Guid> CreateArticleAsync(Article article, CancellationToken ct);

    Task<Article> GetArticleAsync(Guid articleId, CancellationToken ct);

    Task<List<Article>> GetFilteredArticlesAsync(ArticleFilter? articleFilter, CancellationToken ct);

    Task<Guid> UpdateArticleAsync(Guid articleId, Article newArticle, CancellationToken ct);

    Task<Guid> DeleteArticleAsync(Guid articleId, CancellationToken ct);
}