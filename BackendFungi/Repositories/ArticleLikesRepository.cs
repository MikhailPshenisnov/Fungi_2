using BackendFungi.Abstractions.Repositories;
using BackendFungi.Database.Context;
using BackendFungi.Database.Entities;
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

    public async Task<bool> HasUserLikedAsync(Guid articleId, Guid userId, CancellationToken ct)
    {
        return await _context.ArticleLikes
            .AnyAsync(x => x.ArticleId == articleId && x.UserId == userId, ct);
    }
}