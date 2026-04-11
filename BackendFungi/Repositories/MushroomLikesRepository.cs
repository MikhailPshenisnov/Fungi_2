using BackendFungi.Abstractions.Repositories;
using BackendFungi.Database.Context;
using BackendFungi.Database.Entities;
using BackendFungi.Exceptions.SpecificExceptions;
using Microsoft.EntityFrameworkCore;

namespace BackendFungi.Repositories;

public class MushroomLikesRepository : IMushroomLikesRepository
{
    private readonly FungiDbContext _context;

    public MushroomLikesRepository(FungiDbContext context)
    {
        _context = context;
    }

    public async Task EnsureMushroomExistsAsync(Guid mushroomId, CancellationToken ct)
    {
        var exists = await _context.Mushrooms
            .AsNoTracking()
            .AnyAsync(x => x.Id == mushroomId, ct);

        if (!exists)
            throw new UnknownIdentifierException("Unknown mushroom id");
    }

    public async Task<bool> ToggleLikeAsync(Guid mushroomId, Guid userId, CancellationToken ct)
    {
        await EnsureMushroomExistsAsync(mushroomId, ct);

        var existingLike = await _context.MushroomLikes
            .FirstOrDefaultAsync(x => x.MushroomId == mushroomId && x.UserId == userId, ct);

        if (existingLike != null)
        {
            _context.MushroomLikes.Remove(existingLike);
            await _context.SaveChangesAsync(ct);
            return false;
        }

        var newLike = new MushroomLike
        {
            Id = Guid.NewGuid(),
            MushroomId = mushroomId,
            UserId = userId,
            LikeDate = DateTime.UtcNow
        };

        await _context.MushroomLikes.AddAsync(newLike, ct);
        await _context.SaveChangesAsync(ct);
        return true; 
    }

    public async Task<int> GetLikesCountAsync(Guid mushroomId, CancellationToken ct)
    {
        await EnsureMushroomExistsAsync(mushroomId, ct);

        return await _context.MushroomLikes
            .CountAsync(x => x.MushroomId == mushroomId, ct);
    }

    public async Task<bool> HasUserLikedAsync(Guid mushroomId, Guid userId, CancellationToken ct)
    {
        await EnsureMushroomExistsAsync(mushroomId, ct);

        return await _context.MushroomLikes
            .AnyAsync(x => x.MushroomId == mushroomId && x.UserId == userId, ct);
    }

    public async Task<(List<FavoriteMushroomListItem> Items, int TotalCount)> GetMyFavoriteMushroomsAsync(
        Guid userId,
        int page,
        int pageSize,
        CancellationToken ct)
    {
        var favoritesQuery = _context.MushroomLikes
            .AsNoTracking()
            .Where(like => like.UserId == userId)
            .Join(
                _context.Mushrooms.AsNoTracking(),
                like => like.MushroomId,
                mushroom => mushroom.Id,
                (like, mushroom) => new { Like = like, Mushroom = mushroom })
            .Where(x => !x.Mushroom.IsArchived);

        var totalCount = await favoritesQuery.CountAsync(ct);
        if (totalCount == 0)
            return (new List<FavoriteMushroomListItem>(), 0);

        var items = await favoritesQuery
            .OrderByDescending(x => x.Like.LikeDate)
            .ThenByDescending(x => x.Like.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new FavoriteMushroomListItem(
                x.Mushroom.Id,
                x.Mushroom.Name,
                x.Mushroom.SynonymousName,
                x.Mushroom.LatinName,
                x.Mushroom.Family,
                x.Mushroom.HeaderPhotoLink,
                x.Like.LikeDate,
                _context.MushroomLikes.Count(l => l.MushroomId == x.Mushroom.Id)))
            .ToListAsync(ct);

        return (items, totalCount);
    }
}
