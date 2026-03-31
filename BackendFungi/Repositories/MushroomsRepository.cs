using BackendFungi.Abstractions.Repositories;
using BackendFungi.Database.Context;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using BackendFungi.Models.Filters;
using BackendFungi.Models.Other;
using Microsoft.EntityFrameworkCore;
using MushroomEntity = BackendFungi.Database.Entities.Mushroom;
using MushroomRevisionDoppelgangerEntity = BackendFungi.Database.Entities.MushroomRevisionDoppelganger;
using MushroomRevisionEntity = BackendFungi.Database.Entities.MushroomRevision;

namespace BackendFungi.Repositories;

public class MushroomsRepository : IMushroomsRepository
{
    private readonly FungiDbContext _context;

    public MushroomsRepository(FungiDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> CreateMushroom(Mushroom mushroom, CancellationToken cancellationToken)
    {
        var mushroomEntity = MapMushroomEntity(mushroom);
        var doppelgangerEntities = MapDoppelgangerEntities(mushroom);

        await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

        await _context.Mushrooms.AddAsync(mushroomEntity, cancellationToken);
        if (doppelgangerEntities.Count > 0)
            await _context.Doppelgangers.AddRangeAsync(doppelgangerEntities, cancellationToken);

        await _context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return mushroomEntity.Id;
    }

    public async Task<List<Mushroom>> GetAllMushrooms(CancellationToken cancellationToken)
    {
        var mushroomEntities = await _context.Mushrooms
            .Include(m => m.Doppelgangers)
            .AsNoTracking()
            .Where(m => !m.IsArchived)
            .ToListAsync(cancellationToken);

        return mushroomEntities
            .Select(MapMushroomModel)
            .ToList();
    }

    public async Task<(Mushroom Mushroom, int LikesCount)> GetPublishedMushroom(Guid mushroomId, CancellationToken ct)
    {
        var mushroomEntity = await _context.Mushrooms
            .Include(m => m.Doppelgangers)
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == mushroomId && !m.IsArchived, ct);

        if (mushroomEntity is null)
            throw new UnknownIdentifierException("Unknown mushroom id");

        var likesCount = await _context.MushroomLikes
            .AsNoTracking()
            .CountAsync(x => x.MushroomId == mushroomId, ct);

        return (MapMushroomModel(mushroomEntity), likesCount);
    }

    public async Task<(List<(Mushroom Mushroom, int LikesCount)> Mushrooms, int TotalCount)> GetFilteredPublishedMushrooms(
        MushroomFilter? mushroomFilter,
        int page,
        int pageSize,
        MushroomSortMode sortMode,
        CancellationToken ct)
    {
        var filteredQuery = ApplyFilter(
            _context.Mushrooms
                .AsNoTracking()
                .Where(m => !m.IsArchived),
            mushroomFilter);

        var totalCount = await filteredQuery.CountAsync(ct);
        if (totalCount == 0)
            return (new List<(Mushroom Mushroom, int LikesCount)>(), 0);

        IQueryable<Guid> orderedIdsQuery = sortMode switch
        {
            MushroomSortMode.Likes => filteredQuery
                .Select(m => new
                {
                    m.Id,
                    m.Name,
                    LikesCount = _context.MushroomLikes.Count(x => x.MushroomId == m.Id)
                })
                .OrderByDescending(x => x.LikesCount)
                .ThenBy(x => x.Name)
                .Select(x => x.Id),
            _ => filteredQuery
                .OrderBy(x => x.Name)
                .Select(x => x.Id)
        };

        var ids = await orderedIdsQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        if (ids.Count == 0)
            return (new List<(Mushroom Mushroom, int LikesCount)>(), totalCount);

        var mushroomEntities = await _context.Mushrooms
            .Include(m => m.Doppelgangers)
            .AsNoTracking()
            .Where(m => ids.Contains(m.Id))
            .ToListAsync(ct);

        var likesMap = await _context.MushroomLikes
            .AsNoTracking()
            .Where(x => ids.Contains(x.MushroomId))
            .GroupBy(x => x.MushroomId)
            .Select(group => new
            {
                MushroomId = group.Key,
                Count = group.Count()
            })
            .ToDictionaryAsync(x => x.MushroomId, x => x.Count, ct);

        var mushroomById = mushroomEntities.ToDictionary(x => x.Id);

        var orderedResult = new List<(Mushroom Mushroom, int LikesCount)>();
        foreach (var id in ids)
        {
            if (!mushroomById.TryGetValue(id, out var mushroomEntity))
                continue;

            orderedResult.Add((
                MapMushroomModel(mushroomEntity),
                likesMap.TryGetValue(id, out var count) ? count : 0));
        }

        return (orderedResult, totalCount);
    }

    public async Task<HashSet<string>> GetPublishedMushroomNames(CancellationToken ct)
    {
        var names = await _context.Mushrooms
            .AsNoTracking()
            .Where(m => !m.IsArchived)
            .Select(m => m.Name)
            .ToListAsync(ct);

        return names.ToHashSet(StringComparer.OrdinalIgnoreCase);
    }

    public async Task<bool> ExistsPublishedMushroom(Guid mushroomId, CancellationToken ct)
    {
        return await _context.Mushrooms
            .AsNoTracking()
            .AnyAsync(x => x.Id == mushroomId && !x.IsArchived, ct);
    }

    public async Task<Guid> UpdateMushroom(Guid mushroomId, Mushroom newMushroom, CancellationToken cancellationToken)
    {
        var exists = await _context.Mushrooms
            .AsNoTracking()
            .AnyAsync(m => m.Id == mushroomId, cancellationToken);

        if (!exists)
            throw new UnknownIdentifierException("Unknown mushroom id");

        var newExtraPhotoLinksString = JoinPhotoLinks(newMushroom.ExtraPhotoLinks);

        await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

        await _context.Doppelgangers
            .Where(d => d.MushroomId == mushroomId)
            .ExecuteDeleteAsync(cancellationToken);

        await _context.Mushrooms
            .Where(m => m.Id == mushroomId)
            .ExecuteUpdateAsync(x => x
                    .SetProperty(m => m.Name, _ => newMushroom.Name)
                    .SetProperty(m => m.SynonymousName, _ => newMushroom.SynonymousName)
                    .SetProperty(m => m.LatinName, _ => newMushroom.LatinName)
                    .SetProperty(m => m.Family, _ => newMushroom.Family)
                    .SetProperty(m => m.RedBook, _ => newMushroom.RedBook)
                    .SetProperty(m => m.Eatable, _ => newMushroom.Eatable)
                    .SetProperty(m => m.HasStem, _ => newMushroom.HasStem)
                    .SetProperty(m => m.StemSizeFrom, _ => newMushroom.StemSizeFrom)
                    .SetProperty(m => m.StemSizeTo, _ => newMushroom.StemSizeTo)
                    .SetProperty(m => m.StemType, _ => newMushroom.StemType)
                    .SetProperty(m => m.StemColor, _ => newMushroom.StemColor)
                    .SetProperty(m => m.CapType, _ => newMushroom.CapType)
                    .SetProperty(m => m.CapColor, _ => newMushroom.CapColor)
                    .SetProperty(m => m.CapUndersideType, _ => newMushroom.CapUndersideType)
                    .SetProperty(m => m.Description, _ => newMushroom.Description)
                    .SetProperty(m => m.HeaderPhotoLink, _ => newMushroom.HeaderPhotoLink)
                    .SetProperty(m => m.ExtraPhotoLinks, _ => newExtraPhotoLinksString)
                    .SetProperty(m => m.IsArchived, _ => false),
                cancellationToken);

        var doppelgangerEntities = MapDoppelgangerEntities(newMushroom);
        if (doppelgangerEntities.Count > 0)
            await _context.Doppelgangers.AddRangeAsync(doppelgangerEntities, cancellationToken);

        await _context.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return mushroomId;
    }

    public async Task<Guid> DeleteMushroom(Guid mushroomId, CancellationToken cancellationToken)
    {
        var numDeleted = await _context.Mushrooms
            .Where(m => m.Id == mushroomId)
            .ExecuteDeleteAsync(cancellationToken);

        if (numDeleted == 0)
            throw new UnknownIdentifierException("Unknown mushroom id");

        return mushroomId;
    }

    public async Task<Guid> CreateMushroomRevision(MushroomRevision revision, CancellationToken ct)
    {
        var revisionEntity = MapMushroomRevisionEntity(revision);
        var doppelgangerEntities = MapMushroomRevisionDoppelgangerEntities(revision);

        await using var transaction = await _context.Database.BeginTransactionAsync(ct);

        await _context.MushroomRevisions.AddAsync(revisionEntity, ct);
        if (doppelgangerEntities.Count > 0)
            await _context.MushroomRevisionDoppelgangers.AddRangeAsync(doppelgangerEntities, ct);

        await _context.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);

        return revisionEntity.Id;
    }

    public async Task<Guid> UpdateMushroomRevision(Guid revisionId, MushroomRevision newRevision, CancellationToken ct)
    {
        var exists = await _context.MushroomRevisions
            .AsNoTracking()
            .AnyAsync(x => x.Id == revisionId, ct);

        if (!exists)
            throw new UnknownIdentifierException("Unknown mushroom revision id");

        await using var transaction = await _context.Database.BeginTransactionAsync(ct);

        await _context.MushroomRevisionDoppelgangers
            .Where(x => x.RevisionId == revisionId)
            .ExecuteDeleteAsync(ct);

        await _context.MushroomRevisions
            .Where(x => x.Id == revisionId)
            .ExecuteUpdateAsync(x => x
                    .SetProperty(m => m.SourceMushroomId, _ => newRevision.SourceMushroomId)
                    .SetProperty(m => m.Name, _ => newRevision.Name)
                    .SetProperty(m => m.SynonymousName, _ => newRevision.SynonymousName)
                    .SetProperty(m => m.LatinName, _ => newRevision.LatinName)
                    .SetProperty(m => m.Family, _ => newRevision.Family)
                    .SetProperty(m => m.RedBook, _ => newRevision.RedBook)
                    .SetProperty(m => m.Eatable, _ => newRevision.Eatable)
                    .SetProperty(m => m.HasStem, _ => newRevision.HasStem)
                    .SetProperty(m => m.StemSizeFrom, _ => newRevision.StemSizeFrom)
                    .SetProperty(m => m.StemSizeTo, _ => newRevision.StemSizeTo)
                    .SetProperty(m => m.StemType, _ => newRevision.StemType)
                    .SetProperty(m => m.StemColor, _ => newRevision.StemColor)
                    .SetProperty(m => m.CapType, _ => newRevision.CapType)
                    .SetProperty(m => m.CapColor, _ => newRevision.CapColor)
                    .SetProperty(m => m.CapUndersideType, _ => newRevision.CapUndersideType)
                    .SetProperty(m => m.Description, _ => newRevision.Description)
                    .SetProperty(m => m.HeaderPhotoLink, _ => newRevision.HeaderPhotoLink)
                    .SetProperty(m => m.ExtraPhotoLinks, _ => JoinPhotoLinks(newRevision.ExtraPhotoLinks))
                    .SetProperty(m => m.Status, _ => newRevision.Status.ToString())
                    .SetProperty(m => m.UpdatedByUserId, _ => newRevision.UpdatedByUserId)
                    .SetProperty(m => m.UpdatedAt, _ => newRevision.UpdatedAt)
                    .SetProperty(m => m.SubmittedAt, _ => newRevision.SubmittedAt)
                    .SetProperty(m => m.PublishedAt, _ => newRevision.PublishedAt)
                    .SetProperty(m => m.ReviewedAt, _ => newRevision.ReviewedAt)
                    .SetProperty(m => m.ReviewedByUserId, _ => newRevision.ReviewedByUserId)
                    .SetProperty(m => m.ReviewNote, _ => newRevision.ReviewNote)
                    .SetProperty(m => m.ArchivedAt, _ => newRevision.ArchivedAt),
                ct);

        var doppelgangerEntities = MapMushroomRevisionDoppelgangerEntities(newRevision);
        if (doppelgangerEntities.Count > 0)
            await _context.MushroomRevisionDoppelgangers.AddRangeAsync(doppelgangerEntities, ct);

        await _context.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);

        return revisionId;
    }

    public async Task<List<MushroomRevision>> GetAllMushroomRevisions(CancellationToken ct)
    {
        var revisionEntities = await _context.MushroomRevisions
            .Include(x => x.Doppelgangers)
            .AsNoTracking()
            .ToListAsync(ct);

        return revisionEntities
            .Select(MapMushroomRevisionModel)
            .ToList();
    }

    public async Task<MushroomRevision?> GetMushroomRevisionById(Guid revisionId, CancellationToken ct)
    {
        var revisionEntity = await _context.MushroomRevisions
            .Include(x => x.Doppelgangers)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == revisionId, ct);

        return revisionEntity is null ? null : MapMushroomRevisionModel(revisionEntity);
    }

    public async Task<List<MushroomRevision>> GetMushroomRevisionsByAuthor(
        Guid userId,
        IReadOnlyCollection<MushroomRevisionStatus> statuses,
        CancellationToken ct)
    {
        var statusStrings = statuses.Select(x => x.ToString()).Distinct().ToArray();

        var revisionEntities = await _context.MushroomRevisions
            .Include(x => x.Doppelgangers)
            .AsNoTracking()
            .Where(x => x.CreatedByUserId == userId && statusStrings.Contains(x.Status))
            .OrderByDescending(x => x.UpdatedAt)
            .ToListAsync(ct);

        return revisionEntities
            .Select(MapMushroomRevisionModel)
            .ToList();
    }

    public async Task<List<MushroomRevision>> GetMushroomRevisionsByStatuses(
        IReadOnlyCollection<MushroomRevisionStatus> statuses,
        CancellationToken ct)
    {
        var statusStrings = statuses.Select(x => x.ToString()).Distinct().ToArray();

        var revisionEntities = await _context.MushroomRevisions
            .Include(x => x.Doppelgangers)
            .AsNoTracking()
            .Where(x => statusStrings.Contains(x.Status))
            .OrderBy(x => x.SubmittedAt ?? x.UpdatedAt)
            .ToListAsync(ct);

        return revisionEntities
            .Select(MapMushroomRevisionModel)
            .ToList();
    }

    public async Task<Guid> UpsertPublishedMushroomFromRevision(MushroomRevision revision, CancellationToken ct)
    {
        var targetMushroomId = revision.SourceMushroomId ?? Guid.NewGuid();

        var (publishedMushroom, publishedMushroomError) = Mushroom.Create(
            targetMushroomId,
            revision.Name,
            revision.SynonymousName,
            revision.LatinName,
            revision.Family,
            revision.RedBook,
            revision.Eatable,
            revision.HasStem,
            revision.StemSizeFrom,
            revision.StemSizeTo,
            revision.StemType,
            revision.StemColor,
            revision.CapType,
            revision.CapColor,
            revision.CapUndersideType,
            revision.Description,
            revision.HeaderPhotoLink ?? string.Empty,
            revision.ExtraPhotoLinks,
            revision.DoppelgangerNames);

        if (!string.IsNullOrEmpty(publishedMushroomError))
            throw new ConversionException($"Incorrect data format: {publishedMushroomError}");

        var existingEntity = await _context.Mushrooms
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == targetMushroomId, ct);

        await using var transaction = await _context.Database.BeginTransactionAsync(ct);

        if (existingEntity is null)
        {
            var newEntity = MapMushroomEntity(publishedMushroom);
            await _context.Mushrooms.AddAsync(newEntity, ct);
        }
        else
        {
            await _context.Mushrooms
                .Where(x => x.Id == targetMushroomId)
                .ExecuteUpdateAsync(x => x
                        .SetProperty(m => m.Name, _ => publishedMushroom.Name)
                        .SetProperty(m => m.SynonymousName, _ => publishedMushroom.SynonymousName)
                        .SetProperty(m => m.LatinName, _ => publishedMushroom.LatinName)
                        .SetProperty(m => m.Family, _ => publishedMushroom.Family)
                        .SetProperty(m => m.RedBook, _ => publishedMushroom.RedBook)
                        .SetProperty(m => m.Eatable, _ => publishedMushroom.Eatable)
                        .SetProperty(m => m.HasStem, _ => publishedMushroom.HasStem)
                        .SetProperty(m => m.StemSizeFrom, _ => publishedMushroom.StemSizeFrom)
                        .SetProperty(m => m.StemSizeTo, _ => publishedMushroom.StemSizeTo)
                        .SetProperty(m => m.StemType, _ => publishedMushroom.StemType)
                        .SetProperty(m => m.StemColor, _ => publishedMushroom.StemColor)
                        .SetProperty(m => m.CapType, _ => publishedMushroom.CapType)
                        .SetProperty(m => m.CapColor, _ => publishedMushroom.CapColor)
                        .SetProperty(m => m.CapUndersideType, _ => publishedMushroom.CapUndersideType)
                        .SetProperty(m => m.Description, _ => publishedMushroom.Description)
                        .SetProperty(m => m.HeaderPhotoLink, _ => publishedMushroom.HeaderPhotoLink)
                        .SetProperty(m => m.ExtraPhotoLinks, _ => JoinPhotoLinks(publishedMushroom.ExtraPhotoLinks))
                        .SetProperty(m => m.IsArchived, _ => false),
                    ct);

            await _context.Doppelgangers
                .Where(x => x.MushroomId == targetMushroomId)
                .ExecuteDeleteAsync(ct);
        }

        var newDoppelgangers = MapDoppelgangerEntities(publishedMushroom);
        if (newDoppelgangers.Count > 0)
            await _context.Doppelgangers.AddRangeAsync(newDoppelgangers, ct);

        await _context.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);

        return targetMushroomId;
    }

    public async Task ArchivePublishedMushroom(Guid mushroomId, CancellationToken ct)
    {
        var updatedRows = await _context.Mushrooms
            .Where(x => x.Id == mushroomId)
            .ExecuteUpdateAsync(x => x.SetProperty(m => m.IsArchived, _ => true), ct);

        if (updatedRows == 0)
            throw new UnknownIdentifierException("Unknown mushroom id");
    }

    private static IQueryable<MushroomEntity> ApplyFilter(IQueryable<MushroomEntity> query, MushroomFilter? mushroomFilter)
    {
        if (mushroomFilter is null)
            return query;

        if (!string.IsNullOrWhiteSpace(mushroomFilter.PartOfName))
        {
            var pattern = $"%{mushroomFilter.PartOfName.Trim()}%";
            query = query.Where(m =>
                EF.Functions.ILike(m.Name, pattern)
                || (m.SynonymousName != null && EF.Functions.ILike(m.SynonymousName, pattern))
                || (m.LatinName != null && EF.Functions.ILike(m.LatinName, pattern)));
        }

        if (!string.IsNullOrWhiteSpace(mushroomFilter.Family))
        {
            var pattern = $"%{mushroomFilter.Family.Trim()}%";
            query = query.Where(m => EF.Functions.ILike(m.Family, pattern));
        }

        if (mushroomFilter.RedBook is not null)
            query = query.Where(m => m.RedBook == mushroomFilter.RedBook);

        if (!string.IsNullOrWhiteSpace(mushroomFilter.Eatable))
            query = query.Where(m => EF.Functions.ILike(m.Eatable, mushroomFilter.Eatable.Trim()));

        if (mushroomFilter.HasStem is not null)
        {
            query = query.Where(m => m.HasStem == mushroomFilter.HasStem);

            if (mushroomFilter.HasStem == true)
            {
                if (mushroomFilter.StemSizeFrom is not null)
                    query = query.Where(m => m.StemSizeFrom >= mushroomFilter.StemSizeFrom);

                if (mushroomFilter.StemSizeTo is not null)
                    query = query.Where(m => m.StemSizeTo <= mushroomFilter.StemSizeTo);

                if (!string.IsNullOrWhiteSpace(mushroomFilter.StemType))
                    query = query.Where(m => m.StemType != null && EF.Functions.ILike(m.StemType, mushroomFilter.StemType.Trim()));

                if (!string.IsNullOrWhiteSpace(mushroomFilter.StemColor))
                {
                    var pattern = $"%{mushroomFilter.StemColor.Trim()}%";
                    query = query.Where(m => m.StemColor != null && EF.Functions.ILike(m.StemColor, pattern));
                }
            }
        }

        if (!string.IsNullOrWhiteSpace(mushroomFilter.CapType))
            query = query.Where(m => EF.Functions.ILike(m.CapType, mushroomFilter.CapType.Trim()));

        if (!string.IsNullOrWhiteSpace(mushroomFilter.CapColor))
        {
            var pattern = $"%{mushroomFilter.CapColor.Trim()}%";
            query = query.Where(m => EF.Functions.ILike(m.CapColor, pattern));
        }

        if (!string.IsNullOrWhiteSpace(mushroomFilter.CapUndersideType))
            query = query.Where(m => EF.Functions.ILike(m.CapUndersideType, mushroomFilter.CapUndersideType.Trim()));

        return query;
    }

    private static MushroomEntity MapMushroomEntity(Mushroom mushroom)
    {
        return new MushroomEntity
        {
            Id = mushroom.Id,
            Name = mushroom.Name,
            SynonymousName = mushroom.SynonymousName,
            LatinName = mushroom.LatinName,
            Family = mushroom.Family,
            RedBook = mushroom.RedBook,
            Eatable = mushroom.Eatable,
            HasStem = mushroom.HasStem,
            StemSizeFrom = mushroom.StemSizeFrom,
            StemSizeTo = mushroom.StemSizeTo,
            StemType = mushroom.StemType,
            StemColor = mushroom.StemColor,
            CapType = mushroom.CapType,
            CapColor = mushroom.CapColor,
            CapUndersideType = mushroom.CapUndersideType,
            Description = mushroom.Description,
            HeaderPhotoLink = mushroom.HeaderPhotoLink,
            ExtraPhotoLinks = JoinPhotoLinks(mushroom.ExtraPhotoLinks),
            IsArchived = false
        };
    }

    private static List<Database.Entities.Doppelganger> MapDoppelgangerEntities(Mushroom mushroom)
    {
        return mushroom.Doppelgangers
            .Select(doppelganger => new Database.Entities.Doppelganger
            {
                Id = doppelganger.Id,
                MushroomId = doppelganger.MushroomId,
                DoppelgangerName = doppelganger.DoppelgangerName
            })
            .ToList();
    }

    private static Mushroom MapMushroomModel(MushroomEntity mushroomEntity)
    {
        var doppelgangers = mushroomEntity.Doppelgangers
            .Select(doppelgangerEntity =>
            {
                var (doppelganger, doppelgangerError) = Doppelganger.Create(
                    doppelgangerEntity.Id,
                    doppelgangerEntity.MushroomId,
                    doppelgangerEntity.DoppelgangerName);

                if (!string.IsNullOrEmpty(doppelgangerError))
                    throw new IntegrityException($"Incorrect data format in the database, unable to create a doppelganger model: {doppelgangerError}");

                return doppelganger;
            })
            .ToList();

        var (mushroom, mushroomError) = Mushroom.Create(
            mushroomEntity.Id,
            mushroomEntity.Name,
            mushroomEntity.SynonymousName,
            mushroomEntity.LatinName,
            mushroomEntity.Family,
            mushroomEntity.RedBook,
            mushroomEntity.Eatable,
            mushroomEntity.HasStem,
            mushroomEntity.StemSizeFrom,
            mushroomEntity.StemSizeTo,
            mushroomEntity.StemType,
            mushroomEntity.StemColor,
            mushroomEntity.CapType,
            mushroomEntity.CapColor,
            mushroomEntity.CapUndersideType,
            mushroomEntity.Description,
            mushroomEntity.HeaderPhotoLink,
            SplitPhotoLinks(mushroomEntity.ExtraPhotoLinks),
            doppelgangers);

        if (!string.IsNullOrEmpty(mushroomError))
            throw new IntegrityException($"Incorrect data format in the database, unable to create a mushroom model: {mushroomError}");

        return mushroom;
    }

    private static MushroomRevisionEntity MapMushroomRevisionEntity(MushroomRevision revision)
    {
        return new MushroomRevisionEntity
        {
            Id = revision.Id,
            SourceMushroomId = revision.SourceMushroomId,
            Name = revision.Name,
            SynonymousName = revision.SynonymousName,
            LatinName = revision.LatinName,
            Family = revision.Family,
            RedBook = revision.RedBook,
            Eatable = revision.Eatable,
            HasStem = revision.HasStem,
            StemSizeFrom = revision.StemSizeFrom,
            StemSizeTo = revision.StemSizeTo,
            StemType = revision.StemType,
            StemColor = revision.StemColor,
            CapType = revision.CapType,
            CapColor = revision.CapColor,
            CapUndersideType = revision.CapUndersideType,
            Description = revision.Description,
            HeaderPhotoLink = revision.HeaderPhotoLink,
            ExtraPhotoLinks = JoinPhotoLinks(revision.ExtraPhotoLinks),
            Status = revision.Status.ToString(),
            CreatedByUserId = revision.CreatedByUserId,
            UpdatedByUserId = revision.UpdatedByUserId,
            CreatedAt = revision.CreatedAt,
            UpdatedAt = revision.UpdatedAt,
            SubmittedAt = revision.SubmittedAt,
            PublishedAt = revision.PublishedAt,
            ReviewedAt = revision.ReviewedAt,
            ReviewedByUserId = revision.ReviewedByUserId,
            ReviewNote = revision.ReviewNote,
            ArchivedAt = revision.ArchivedAt
        };
    }

    private static List<MushroomRevisionDoppelgangerEntity> MapMushroomRevisionDoppelgangerEntities(MushroomRevision revision)
    {
        return revision.DoppelgangerNames
            .Select(name => new MushroomRevisionDoppelgangerEntity
            {
                Id = Guid.NewGuid(),
                RevisionId = revision.Id,
                DoppelgangerName = name
            })
            .ToList();
    }

    private static MushroomRevision MapMushroomRevisionModel(MushroomRevisionEntity entity)
    {
        if (!Enum.TryParse<MushroomRevisionStatus>(entity.Status, true, out var status))
            throw new IntegrityException($"Incorrect mushroom revision status in database: {entity.Status}");

        var (revision, revisionError) = MushroomRevision.Create(
            entity.Id,
            entity.SourceMushroomId,
            entity.Name,
            entity.SynonymousName,
            entity.LatinName,
            entity.Family,
            entity.RedBook,
            entity.Eatable,
            entity.HasStem,
            entity.StemSizeFrom,
            entity.StemSizeTo,
            entity.StemType,
            entity.StemColor,
            entity.CapType,
            entity.CapColor,
            entity.CapUndersideType,
            entity.Description,
            entity.HeaderPhotoLink,
            SplitPhotoLinks(entity.ExtraPhotoLinks),
            entity.Doppelgangers.Select(x => x.DoppelgangerName).ToList(),
            status,
            entity.CreatedByUserId,
            entity.UpdatedByUserId,
            entity.CreatedAt,
            entity.UpdatedAt,
            entity.SubmittedAt,
            entity.PublishedAt,
            entity.ReviewedAt,
            entity.ReviewedByUserId,
            entity.ReviewNote,
            entity.ArchivedAt);

        if (!string.IsNullOrEmpty(revisionError))
            throw new IntegrityException($"Incorrect data format in the database, unable to create a mushroom revision model: {revisionError}");

        return revision;
    }

    private static string? JoinPhotoLinks(List<string>? links)
    {
        return links is null || links.Count == 0 ? null : string.Join(";", links);
    }

    private static List<string>? SplitPhotoLinks(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        var links = value.Split(';', StringSplitOptions.RemoveEmptyEntries)
            .Select(x => x.Trim())
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .ToList();

        return links.Count == 0 ? null : links;
    }
}
