using BackendFungi.Models;
using BackendFungi.Models.Filters;
using BackendFungi.Models.Other;

namespace BackendFungi.Abstractions.Services;

public interface IArticlesService
{
    Task<Guid> CreateArticleAsync(Article article, CancellationToken ct);

    Task<Article> GetArticleAsync(Guid articleId, CancellationToken ct);

    Task<(List<Article> Articles, int TotalCount)> GetFilteredArticlesAsync(
        ArticleFilter? articleFilter,
        int page,
        int pageSize,
        ArticleSortMode sortMode,
        CancellationToken ct);

    Task<Guid> UpdateArticleAsync(Guid articleId, Article newArticle, CancellationToken ct);

    Task<Guid> DeleteArticleAsync(Guid articleId, CancellationToken ct);

    Task<Guid> CreateDraftAsync(Article article, CancellationToken ct);

    Task<Guid> UpdateDraftAsync(Guid articleId, Article article, CancellationToken ct);

    Task<Article> SubmitForReviewAsync(Guid articleId, Guid actorUserId, CancellationToken ct);

    Task<Article> ModerateArticleAsync(Guid articleId, ModerationDecision decision, string? reviewNote, Guid actorUserId, CancellationToken ct);

    Task<Article> ArchiveArticleAsync(Guid articleId, Guid actorUserId, CancellationToken ct);

    Task<List<Article>> GetMyDraftsAsync(Guid userId, CancellationToken ct);

    Task<List<Article>> GetMyMaterialsAsync(Guid userId, CancellationToken ct);

    Task<List<Article>> GetModerationQueueAsync(CancellationToken ct);

    Task<Article> GetEditorArticleAsync(Guid articleId, CancellationToken ct);

    Task PublishDueScheduledArticlesAsync(CancellationToken ct);

    Task<Guid> ReplaceArticleMushroomsAsync(Guid articleId, IReadOnlyCollection<Guid> mushroomIds, CancellationToken ct);

    Task<List<Guid>> GetArticleMushroomIdsAsync(Guid articleId, CancellationToken ct);
}
