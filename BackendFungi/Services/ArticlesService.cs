using BackendFungi.Abstractions.Repositories;
using BackendFungi.Abstractions.Services;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using BackendFungi.Models.Filters;
using BackendFungi.Models.Other;

namespace BackendFungi.Services;

public class ArticlesService : IArticlesService
{
    private readonly IArticlesRepository _articlesRepository;

    public ArticlesService(IArticlesRepository articlesRepository)
    {
        _articlesRepository = articlesRepository;
    }

    public async Task<Guid> CreateArticleAsync(Article article, CancellationToken cancellationToken)
    {
        return await _articlesRepository.CreateArticle(article, cancellationToken);
    }

    public async Task<Article> GetArticleAsync(Guid articleId, CancellationToken cancellationToken)
    {
        var allArticles = await _articlesRepository.GetAllArticles(cancellationToken);

        var article = allArticles.FirstOrDefault(a => a.Id == articleId);

        if (article is null || article.Status != ArticleStatus.Published || article.PublishDate > DateTime.UtcNow)
            throw new UnknownIdentifierException("Unknown article id");

        return article;
    }

    public async Task<(List<Article> Articles, int TotalCount)> GetFilteredArticlesAsync(
        ArticleFilter? articleFilter,
        int page,
        int pageSize,
        ArticleSortMode sortMode,
        CancellationToken cancellationToken)
    {
        return await _articlesRepository.GetFilteredPublishedArticles(articleFilter, page, pageSize, sortMode, cancellationToken);
    }

    public async Task<Guid> UpdateArticleAsync(Guid articleId, Article newArticle, CancellationToken cancellationToken)
    {
        return await _articlesRepository.UpdateArticle(articleId, newArticle, cancellationToken);
    }

    public async Task<Guid> DeleteArticleAsync(Guid articleId, CancellationToken cancellationToken)
    {
        return await _articlesRepository.DeleteArticle(articleId, cancellationToken);
    }

    public async Task<Guid> CreateDraftAsync(Article article, CancellationToken ct)
    {
        if (article.Status != ArticleStatus.Draft)
            throw new ConversionException("Incorrect data format: Draft article must have Draft status");

        return await _articlesRepository.CreateArticle(article, ct);
    }

    public async Task<Guid> UpdateDraftAsync(Guid articleId, Article article, CancellationToken ct)
    {
        var existing = await GetEditorArticleAsync(articleId, ct);

        if (existing.Status is not (ArticleStatus.Draft or ArticleStatus.Rejected or ArticleStatus.Published or ArticleStatus.Scheduled))
            throw new ConversionException("Incorrect data format: Article status does not allow draft update");

        return await _articlesRepository.UpdateArticle(articleId, article, ct);
    }

    public async Task<Article> SubmitForReviewAsync(Guid articleId, Guid actorUserId, CancellationToken ct)
    {
        var existing = await GetEditorArticleAsync(articleId, ct);

        if (existing.Status is not (ArticleStatus.Draft or ArticleStatus.Rejected))
            throw new ConversionException("Incorrect data format: Only Draft or Rejected article can be submitted for review");

        if (string.IsNullOrWhiteSpace(existing.HeaderPhotoLink))
            throw new ConversionException("Incorrect data format: Header photo is required before submitting article for review");

        var submittedAt = DateTime.UtcNow;
        var updatedArticle = RebuildArticle(
            existing,
            status: ArticleStatus.InReview,
            updatedByUserId: actorUserId,
            updatedAt: submittedAt,
            submittedAt: submittedAt,
            reviewedAt: null,
            reviewedByUserId: null,
            reviewNote: null,
            archivedAt: null,
            publishedAt: null);

        await _articlesRepository.UpdateArticle(articleId, updatedArticle, ct);
        return updatedArticle;
    }

    public async Task<Article> ModerateArticleAsync(Guid articleId, ModerationDecision decision, string? reviewNote,
        Guid actorUserId, CancellationToken ct)
    {
        var existing = await GetEditorArticleAsync(articleId, ct);

        if (existing.Status != ArticleStatus.InReview)
            throw new ConversionException("Incorrect data format: Only InReview article can be moderated");

        var now = DateTime.UtcNow;
        var normalizedReviewNote = string.IsNullOrWhiteSpace(reviewNote) ? null : reviewNote.Trim();

        ArticleStatus nextStatus;
        DateTime? nextPublishedAt;

        if (decision == ModerationDecision.Reject)
        {
            nextStatus = ArticleStatus.Rejected;
            nextPublishedAt = null;
        }
        else
        {
            if (string.IsNullOrWhiteSpace(existing.HeaderPhotoLink))
                throw new ConversionException("Incorrect data format: Header photo is required before approval");

            nextStatus = existing.PublishDate <= now ? ArticleStatus.Published : ArticleStatus.Scheduled;
            nextPublishedAt = nextStatus == ArticleStatus.Published ? now : null;
        }

        var updatedArticle = RebuildArticle(
            existing,
            status: nextStatus,
            updatedByUserId: actorUserId,
            updatedAt: now,
            reviewedAt: now,
            reviewedByUserId: actorUserId,
            reviewNote: normalizedReviewNote,
            publishedAt: nextPublishedAt,
            archivedAt: null);

        await _articlesRepository.UpdateArticle(articleId, updatedArticle, ct);
        return updatedArticle;
    }

    public async Task<Article> ArchiveArticleAsync(Guid articleId, Guid actorUserId, CancellationToken ct)
    {
        var existing = await GetEditorArticleAsync(articleId, ct);

        if (existing.Status == ArticleStatus.Archived)
            return existing;

        if (!Article.CanTransitionStatus(existing.Status, ArticleStatus.Archived))
            throw new ConversionException("Incorrect data format: Unable to archive article from current status");

        var now = DateTime.UtcNow;
        var updatedArticle = RebuildArticle(
            existing,
            status: ArticleStatus.Archived,
            updatedByUserId: actorUserId,
            updatedAt: now,
            archivedAt: now);

        await _articlesRepository.UpdateArticle(articleId, updatedArticle, ct);
        return updatedArticle;
    }

    public async Task<List<Article>> GetMyDraftsAsync(Guid userId, CancellationToken ct)
    {
        var allArticles = await _articlesRepository.GetAllArticles(ct);

        return allArticles
            .Where(a => a.CreatedByUserId == userId && a.Status is ArticleStatus.Draft or ArticleStatus.Rejected or ArticleStatus.InReview)
            .OrderByDescending(a => a.UpdatedAt)
            .ToList();
    }

    public async Task<List<Article>> GetMyMaterialsAsync(Guid userId, CancellationToken ct)
    {
        var allArticles = await _articlesRepository.GetAllArticles(ct);

        return allArticles
            .Where(a => a.CreatedByUserId == userId && a.Status is ArticleStatus.Published or ArticleStatus.Scheduled or ArticleStatus.Archived)
            .OrderByDescending(a => a.UpdatedAt)
            .ToList();
    }

    public async Task<List<Article>> GetModerationQueueAsync(CancellationToken ct)
    {
        var allArticles = await _articlesRepository.GetAllArticles(ct);

        return allArticles
            .Where(a => a.Status == ArticleStatus.InReview)
            .OrderBy(a => a.SubmittedAt ?? a.UpdatedAt)
            .ToList();
    }

    public async Task<Article> GetEditorArticleAsync(Guid articleId, CancellationToken ct)
    {
        var allArticles = await _articlesRepository.GetAllArticles(ct);

        var article = allArticles.FirstOrDefault(a => a.Id == articleId);
        if (article is null)
            throw new UnknownIdentifierException("Unknown article id");

        return article;
    }

    public async Task PublishDueScheduledArticlesAsync(CancellationToken ct)
    {
        var allArticles = await _articlesRepository.GetAllArticles(ct);

        var dueArticles = allArticles
            .Where(a => a.Status == ArticleStatus.Scheduled && a.PublishDate <= DateTime.UtcNow)
            .ToList();

        foreach (var article in dueArticles)
        {
            var now = DateTime.UtcNow;
            var updatedArticle = RebuildArticle(
                article,
                status: ArticleStatus.Published,
                updatedAt: now,
                publishedAt: now);

            await _articlesRepository.UpdateArticle(article.Id, updatedArticle, ct);
        }
    }

    public async Task<Guid> ReplaceArticleMushroomsAsync(Guid articleId, IReadOnlyCollection<Guid> mushroomIds,
        CancellationToken ct)
    {
        return await _articlesRepository.ReplaceArticleMushrooms(articleId, mushroomIds, ct);
    }

    public async Task<List<Guid>> GetArticleMushroomIdsAsync(Guid articleId, CancellationToken ct)
    {
        return await _articlesRepository.GetArticleMushroomIds(articleId, ct);
    }

    private static Article RebuildArticle(
        Article source,
        ArticleStatus? status = null,
        string? title = null,
        DateTime? publishDate = null,
        string? authorString = null,
        string? headerPhotoLink = null,
        List<string>? extraPhotoLinks = null,
        List<Paragraph>? paragraphs = null,
        Guid? updatedByUserId = null,
        DateTime? updatedAt = null,
        DateTime? submittedAt = null,
        DateTime? publishedAt = null,
        DateTime? reviewedAt = null,
        Guid? reviewedByUserId = null,
        string? reviewNote = null,
        DateTime? archivedAt = null)
    {
        var (article, articleError) = Article.Create(
            source.Id,
            title ?? source.Title,
            publishDate ?? source.PublishDate,
            authorString ?? source.AuthorString,
            headerPhotoLink ?? source.HeaderPhotoLink,
            extraPhotoLinks ?? source.ExtraPhotoLinks,
            paragraphs ?? source.Paragraphs,
            status ?? source.Status,
            source.CreatedByUserId,
            updatedByUserId ?? source.UpdatedByUserId,
            source.CreatedAt,
            updatedAt ?? source.UpdatedAt,
            submittedAt ?? source.SubmittedAt,
            publishedAt ?? source.PublishedAt,
            reviewedAt ?? source.ReviewedAt,
            reviewedByUserId ?? source.ReviewedByUserId,
            reviewNote ?? source.ReviewNote,
            archivedAt ?? source.ArchivedAt);

        if (!string.IsNullOrEmpty(articleError))
            throw new ConversionException($"Incorrect data format: {articleError}");

        return article;
    }
}
