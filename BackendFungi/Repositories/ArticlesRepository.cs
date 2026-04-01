using BackendFungi.Abstractions.Repositories;
using BackendFungi.Database.Context;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using BackendFungi.Models.Filters;
using BackendFungi.Models.Other;
using Microsoft.EntityFrameworkCore;
using ArticleEntity = BackendFungi.Database.Entities.Article;
using ParagraphEntity = BackendFungi.Database.Entities.Paragraph;

namespace BackendFungi.Repositories;

public class ArticlesRepository : IArticlesRepository
{
    private readonly FungiDbContext _context;

    public ArticlesRepository(FungiDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> CreateArticle(Article article, CancellationToken cancellationToken)
    {
        var extraPhotoLinksString = article.ExtraPhotoLinks is null ? null : string.Join(";", article.ExtraPhotoLinks);

        var articleEntity = new Database.Entities.Article
        {
            Id = article.Id,
            Title = article.Title,
            PublishDate = article.PublishDate,
            AuthorString = article.AuthorString,
            HeaderPhotoLink = article.HeaderPhotoLink,
            ExtraPhotoLinks = extraPhotoLinksString,
            Status = article.Status.ToString(),
            CreatedByUserId = article.CreatedByUserId,
            UpdatedByUserId = article.UpdatedByUserId,
            CreatedAt = article.CreatedAt,
            UpdatedAt = article.UpdatedAt,
            SubmittedAt = article.SubmittedAt,
            PublishedAt = article.PublishedAt,
            ReviewedAt = article.ReviewedAt,
            ReviewedByUserId = article.ReviewedByUserId,
            ReviewNote = article.ReviewNote,
            ArchivedAt = article.ArchivedAt
        };

        await _context.Articles.AddAsync(articleEntity, cancellationToken);

        var paragraphEntities = article.Paragraphs
            .Select(paragraph => new Database.Entities.Paragraph
            {
                Id = paragraph.Id,
                ArticleId = paragraph.ArticleId,
                ParagraphText = paragraph.ParagraphText,
                SerialNumber = paragraph.SerialNumber,
                IsSubtitle = paragraph.IsSubtitle
            })
            .ToList();

        if (paragraphEntities.Count > 0)
            await _context.Paragraphs.AddRangeAsync(paragraphEntities, cancellationToken);

        await _context.SaveChangesAsync(cancellationToken);

        return articleEntity.Id;
    }

    public async Task<List<Article>> GetAllArticles(CancellationToken cancellationToken)
    {
        var articleEntities = await _context.Articles
            .Include(a => a.Paragraphs)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return articleEntities
            .Select(MapArticleModel)
            .ToList();
    }

    public async Task<List<Article>> GetFilteredPublishedArticles(ArticleFilter? articleFilter, CancellationToken ct)
    {
        var utcNow = DateTime.UtcNow;

        var query = _context.Articles
            .Include(a => a.Paragraphs)
            .AsNoTracking()
            .Where(a => a.Status == ArticleStatus.Published.ToString() && a.PublishDate <= utcNow);

        query = ApplyPublishedArticleFilter(query, articleFilter);

        var articleEntities = await query
            .OrderByDescending(a => a.PublishDate)
            .ThenBy(a => a.Title)
            .ToListAsync(ct);

        return articleEntities
            .Select(MapArticleModel)
            .ToList();
    }

    public async Task<Guid> UpdateArticle(Guid articleId, Article newArticle, CancellationToken cancellationToken)
    {
        var oldArticleEntity = await _context.Articles
            .Include(a => a.Paragraphs)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == articleId, cancellationToken);

        if (oldArticleEntity is null)
            throw new UnknownIdentifierException("Unknown article id");

        var paragraphIds = oldArticleEntity.Paragraphs
            .Select(x => x.Id)
            .ToList();

        if (paragraphIds.Count > 0)
        {
            await _context.Paragraphs
                .Where(p => paragraphIds.Contains(p.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }

        var newExtraPhotoLinksString =
            newArticle.ExtraPhotoLinks is null ? null : string.Join(";", newArticle.ExtraPhotoLinks);

        await _context.Articles
            .Where(a => a.Id == articleId)
            .ExecuteUpdateAsync(x => x
                    .SetProperty(a => a.Title, _ => newArticle.Title)
                    .SetProperty(a => a.PublishDate, _ => newArticle.PublishDate)
                    .SetProperty(a => a.AuthorString, _ => newArticle.AuthorString)
                    .SetProperty(a => a.HeaderPhotoLink, _ => newArticle.HeaderPhotoLink)
                    .SetProperty(a => a.ExtraPhotoLinks, _ => newExtraPhotoLinksString)
                    .SetProperty(a => a.Status, _ => newArticle.Status.ToString())
                    .SetProperty(a => a.UpdatedByUserId, _ => newArticle.UpdatedByUserId)
                    .SetProperty(a => a.UpdatedAt, _ => newArticle.UpdatedAt)
                    .SetProperty(a => a.SubmittedAt, _ => newArticle.SubmittedAt)
                    .SetProperty(a => a.PublishedAt, _ => newArticle.PublishedAt)
                    .SetProperty(a => a.ReviewedAt, _ => newArticle.ReviewedAt)
                    .SetProperty(a => a.ReviewedByUserId, _ => newArticle.ReviewedByUserId)
                    .SetProperty(a => a.ReviewNote, _ => newArticle.ReviewNote)
                    .SetProperty(a => a.ArchivedAt, _ => newArticle.ArchivedAt),
                cancellationToken);

        var paragraphEntities = newArticle.Paragraphs
            .Select(paragraph => new Database.Entities.Paragraph
            {
                Id = paragraph.Id,
                ArticleId = paragraph.ArticleId,
                ParagraphText = paragraph.ParagraphText,
                SerialNumber = paragraph.SerialNumber,
                IsSubtitle = paragraph.IsSubtitle
            })
            .ToList();

        if (paragraphEntities.Count > 0)
            await _context.Paragraphs.AddRangeAsync(paragraphEntities, cancellationToken);

        await _context.SaveChangesAsync(cancellationToken);

        return oldArticleEntity.Id;
    }

    public async Task<Guid> DeleteArticle(Guid articleId, CancellationToken cancellationToken)
    {
        var numDeleted = await _context.Articles
            .Where(a => a.Id == articleId)
            .ExecuteDeleteAsync(cancellationToken);

        if (numDeleted == 0)
            throw new UnknownIdentifierException("Unknown article id");

        return articleId;
    }

    public async Task<List<Guid>> GetArticleMushroomIds(Guid articleId, CancellationToken ct)
    {
        var articleExists = await _context.Articles
            .AsNoTracking()
            .AnyAsync(a => a.Id == articleId, ct);

        if (!articleExists)
            throw new UnknownIdentifierException("Unknown article id");

        return await _context.ArticleMushrooms
            .AsNoTracking()
            .Where(x => x.ArticleId == articleId)
            .Select(x => x.MushroomId)
            .OrderBy(x => x)
            .ToListAsync(ct);
    }

    public async Task<Guid> ReplaceArticleMushrooms(Guid articleId, IReadOnlyCollection<Guid> mushroomIds, CancellationToken ct)
    {
        var articleExists = await _context.Articles
            .AsNoTracking()
            .AnyAsync(a => a.Id == articleId, ct);

        if (!articleExists)
            throw new UnknownIdentifierException("Unknown article id");

        var normalizedIds = mushroomIds
            .Where(x => x != Guid.Empty)
            .Distinct()
            .ToList();

        if (normalizedIds.Count > 0)
        {
            var existingMushrooms = await _context.Mushrooms
                .AsNoTracking()
                .Where(x => normalizedIds.Contains(x.Id))
                .Select(x => x.Id)
                .ToListAsync(ct);

            if (existingMushrooms.Count != normalizedIds.Count)
                throw new UnknownIdentifierException("Unknown mushroom id");
        }

        await using var transaction = await _context.Database.BeginTransactionAsync(ct);

        await _context.ArticleMushrooms
            .Where(x => x.ArticleId == articleId)
            .ExecuteDeleteAsync(ct);

        if (normalizedIds.Count > 0)
        {
            var entities = normalizedIds
                .Select(mushroomId => new Database.Entities.ArticleMushroom
                {
                    Id = Guid.NewGuid(),
                    ArticleId = articleId,
                    MushroomId = mushroomId
                })
                .ToList();

            await _context.ArticleMushrooms.AddRangeAsync(entities, ct);
            await _context.SaveChangesAsync(ct);
        }

        await transaction.CommitAsync(ct);

        return articleId;
    }

    private static IQueryable<ArticleEntity> ApplyPublishedArticleFilter(
        IQueryable<ArticleEntity> query,
        ArticleFilter? articleFilter)
    {
        if (articleFilter is null)
            return query;

        if (articleFilter.PartOfTitle is not null)
        {
            var titlePattern = $"%{articleFilter.PartOfTitle}%";
            query = query.Where(a => EF.Functions.ILike(a.Title, titlePattern));
        }

        if (articleFilter.PublishDateFrom is not null)
            query = query.Where(a => a.PublishDate >= articleFilter.PublishDateFrom);

        if (articleFilter.PublishDateTo is not null)
            query = query.Where(a => a.PublishDate <= articleFilter.PublishDateTo);

        if (articleFilter.PartOfAuthorString is not null)
        {
            var authorPattern = $"%{articleFilter.PartOfAuthorString}%";
            query = query.Where(a => EF.Functions.ILike(a.AuthorString, authorPattern));
        }

        return query;
    }

    private static Article MapArticleModel(ArticleEntity articleEntity)
    {
        var paragraphs = articleEntity.Paragraphs
            .Select(MapParagraphModel)
            .OrderBy(paragraph => paragraph.SerialNumber)
            .ToList();

        if (!Enum.TryParse<ArticleStatus>(articleEntity.Status, true, out var status))
            throw new IntegrityException($"Incorrect article status in database: {articleEntity.Status}");

        var (article, articleError) = Article
            .Create(articleEntity.Id,
                articleEntity.Title,
                articleEntity.PublishDate,
                articleEntity.AuthorString,
                articleEntity.HeaderPhotoLink,
                articleEntity.ExtraPhotoLinks?.Split(';', StringSplitOptions.RemoveEmptyEntries).ToList(),
                paragraphs,
                status,
                articleEntity.CreatedByUserId,
                articleEntity.UpdatedByUserId,
                articleEntity.CreatedAt,
                articleEntity.UpdatedAt,
                articleEntity.SubmittedAt,
                articleEntity.PublishedAt,
                articleEntity.ReviewedAt,
                articleEntity.ReviewedByUserId,
                articleEntity.ReviewNote,
                articleEntity.ArchivedAt);

        if (!string.IsNullOrEmpty(articleError))
            throw new IntegrityException($"Incorrect data format in the database, unable to create an article model: {articleError}");

        return article;
    }

    private static Paragraph MapParagraphModel(ParagraphEntity paragraphEntity)
    {
        var (paragraph, paragraphError) = Paragraph
            .Create(paragraphEntity.Id,
                paragraphEntity.ArticleId,
                paragraphEntity.ParagraphText,
                paragraphEntity.SerialNumber,
                paragraphEntity.IsSubtitle);

        if (!string.IsNullOrEmpty(paragraphError))
            throw new IntegrityException($"Incorrect data format in the database, unable to create a paragraph model: {paragraphError}");

        return paragraph;
    }
}
