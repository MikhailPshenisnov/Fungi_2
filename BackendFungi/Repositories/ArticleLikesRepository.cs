using BackendFungi.Abstractions.Repositories;
using BackendFungi.Database.Context;
using BackendFungi.Database.Entities;
using BackendFungi.Models.Other;
using Microsoft.EntityFrameworkCore;

namespace BackendFungi.Repositories;

public class ArticleLikesRepository : IArticleLikesRepository
{
    private readonly FungiDbContext _context;

    public ArticleLikesRepository(FungiDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ToggleLikeAsync(Guid articleId, Guid userId, CancellationToken ct)
    {
        var existingLike = await _context.ArticleLikes
            .FirstOrDefaultAsync(x => x.ArticleId == articleId && x.UserId == userId, ct);

        if (existingLike != null)
        {
            _context.ArticleLikes.Remove(existingLike);
            await _context.SaveChangesAsync(ct);
            return false;
        }

        var newLike = new ArticleLike
        {
            Id = Guid.NewGuid(),
            ArticleId = articleId,
            UserId = userId,
            LikeDate = DateTime.UtcNow
        };

        await _context.ArticleLikes.AddAsync(newLike, ct);
        await _context.SaveChangesAsync(ct);
        return true; 
    }

    public async Task<int> GetLikesCountAsync(Guid articleId, CancellationToken ct)
    {
        return await _context.ArticleLikes
            .CountAsync(x => x.ArticleId == articleId, ct);
    }

    public async Task<Dictionary<Guid, int>> GetLikesCountsByArticleIdsAsync(
        IReadOnlyCollection<Guid> articleIds,
        CancellationToken ct)
    {
        var normalizedArticleIds = articleIds
            .Where(x => x != Guid.Empty)
            .Distinct()
            .ToList();

        if (normalizedArticleIds.Count == 0)
            return new Dictionary<Guid, int>();

        return await _context.ArticleLikes
            .AsNoTracking()
            .Where(x => normalizedArticleIds.Contains(x.ArticleId))
            .GroupBy(x => x.ArticleId)
            .Select(x => new { ArticleId = x.Key, LikesCount = x.Count() })
            .ToDictionaryAsync(x => x.ArticleId, x => x.LikesCount, ct);
    }

    public async Task<bool> HasUserLikedAsync(Guid articleId, Guid userId, CancellationToken ct)
    {
        return await _context.ArticleLikes
            .AnyAsync(x => x.ArticleId == articleId && x.UserId == userId, ct);
    }

    public async Task<(List<FavoriteArticleListItem> Items, int TotalCount)> GetMyFavoriteArticlesAsync(
        Guid userId,
        int page,
        int pageSize,
        CancellationToken ct)
    {
        var utcNow = DateTime.UtcNow;

        var favoritesQuery = _context.ArticleLikes
            .AsNoTracking()
            .Where(like => like.UserId == userId)
            .Join(
                _context.Articles.AsNoTracking(),
                like => like.ArticleId,
                article => article.Id,
                (like, article) => new { Like = like, Article = article })
            .Where(x =>
                x.Article.Status == ArticleStatus.Published.ToString()
                && x.Article.PublishDate <= utcNow);

        var totalCount = await favoritesQuery.CountAsync(ct);
        if (totalCount == 0)
            return (new List<FavoriteArticleListItem>(), 0);

        var items = await favoritesQuery
            .OrderByDescending(x => x.Like.LikeDate)
            .ThenByDescending(x => x.Like.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new FavoriteArticleListItem(
                x.Article.Id,
                x.Article.Title,
                x.Article.AuthorString,
                x.Article.PublishDate,
                x.Article.HeaderPhotoLink,
                x.Like.LikeDate,
                _context.ArticleLikes.Count(l => l.ArticleId == x.Article.Id)))
            .ToListAsync(ct);

        return (items, totalCount);
    }
}
