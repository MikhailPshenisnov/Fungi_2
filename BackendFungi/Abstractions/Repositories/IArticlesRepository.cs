using BackendFungi.Models;
using BackendFungi.Models.Filters;
using BackendFungi.Models.Other;

namespace BackendFungi.Abstractions.Repositories;

public interface IArticlesRepository
{
    Task<Guid> CreateArticle(Article article, CancellationToken ct);

    Task<List<Article>> GetAllArticles(CancellationToken ct);

    Task<(List<Article> Articles, int TotalCount)> GetFilteredPublishedArticles(
        ArticleFilter? articleFilter,
        int page,
        int pageSize,
        ArticleSortMode sortMode,
        CancellationToken ct);

    Task<Guid> UpdateArticle(Guid articleId, Article newArticle, CancellationToken ct);

    Task<Guid> DeleteArticle(Guid articleId, CancellationToken ct);

    Task<List<Guid>> GetArticleMushroomIds(Guid articleId, CancellationToken ct);

    Task<Guid> ReplaceArticleMushrooms(Guid articleId, IReadOnlyCollection<Guid> mushroomIds, CancellationToken ct);
}
