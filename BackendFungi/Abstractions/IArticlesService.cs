using BackendFungi.Models;

namespace BackendFungi.Abstractions;

public interface IArticlesService
{
    Task<Article> GetArticleAsync(string articleTitle, CancellationToken ct);

    Task<List<Article>> GetAllArticlesAsync(CancellationToken ct);

    Task<List<Article>> GetFilteredArticlesAsync(ArticleFilter articleFilter, CancellationToken ct);

    Task<Guid> CreateArticleAsync(Article article, CancellationToken ct);

    Task<Guid> UpdateArticleAsync(string articleTitle, Article newArticle, CancellationToken ct);

    Task<Guid> DeleteArticleAsync(string articleTitle, CancellationToken ct);
}