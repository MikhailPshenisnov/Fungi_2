using BackendFungi.Abstractions.Repositories;
using BackendFungi.Database.Context;
using BackendFungi.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendFungi.Repositories;

public class ArticleMushroomsRepository : IArticleMushroomsRepository
{
    private readonly FungiDbContext _context;

    public ArticleMushroomsRepository(FungiDbContext context)
    {
        _context = context;
    }
    public async Task<Guid> AddMushroomToArticleAsync(Guid articleId, Guid mushroomId, CancellationToken ct)
    {
        var existingArticleMushroom = await _context.ArticleMushrooms.
            FirstOrDefaultAsync(x => x.ArticleId == articleId && x.MushroomId == mushroomId, ct);

        if (existingArticleMushroom != null)
        {
            throw new InvalidOperationException("The record already exists!");
        }

        var NewArticleMushroom = new ArticleMushroom
        {
            Id = Guid.NewGuid(),
            ArticleId = articleId,
            MushroomId = mushroomId
        };

        await _context.ArticleMushrooms.AddAsync(NewArticleMushroom);
        await _context.SaveChangesAsync();

        return articleId;
    }

    public async Task<Guid> DeleteMushroomFromArticle(Guid articleId, Guid mushroomId, CancellationToken ct)
    {
        var countDeleted = await _context.ArticleMushrooms
            .Where(x => x.ArticleId == articleId && x.MushroomId == mushroomId)
            .ExecuteDeleteAsync(ct);

        if (countDeleted == 0)
        {
            throw new InvalidOperationException("The record does not exist!");
        }
        return articleId;
    }

    public async Task<List<ArticleMushroom>> GetAllMushroomsAsync(Guid articleId, CancellationToken ct)
    {
        return await _context.ArticleMushrooms
            .Where(x => x.ArticleId == articleId)
            .Include(x => x.Mushroom)
            .ToListAsync(ct);
    }
}
