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
}
