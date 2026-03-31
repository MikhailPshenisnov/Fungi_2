using BackendFungi.Models;
using BackendFungi.Models.Filters;
using BackendFungi.Models.Other;

namespace BackendFungi.Abstractions.Repositories;

public interface IMushroomsRepository
{
    Task<Guid> CreateMushroom(Mushroom mushroom, CancellationToken ct);

    Task<List<Mushroom>> GetAllMushrooms(CancellationToken ct);

    Task<(Mushroom Mushroom, int LikesCount)> GetPublishedMushroom(Guid mushroomId, CancellationToken ct);

    Task<(List<(Mushroom Mushroom, int LikesCount)> Mushrooms, int TotalCount)> GetFilteredPublishedMushrooms(
        MushroomFilter? mushroomFilter,
        int page,
        int pageSize,
        MushroomSortMode sortMode,
        CancellationToken ct);

    Task<HashSet<string>> GetPublishedMushroomNames(CancellationToken ct);

    Task<bool> ExistsPublishedMushroom(Guid mushroomId, CancellationToken ct);

    Task<Guid> UpdateMushroom(Guid mushroomId, Mushroom newMushroom, CancellationToken ct);

    Task<Guid> DeleteMushroom(Guid mushroomId, CancellationToken ct);

    Task<Guid> CreateMushroomRevision(MushroomRevision revision, CancellationToken ct);

    Task<Guid> UpdateMushroomRevision(Guid revisionId, MushroomRevision newRevision, CancellationToken ct);

    Task<List<MushroomRevision>> GetAllMushroomRevisions(CancellationToken ct);

    Task<MushroomRevision?> GetMushroomRevisionById(Guid revisionId, CancellationToken ct);

    Task<List<MushroomRevision>> GetMushroomRevisionsByAuthor(
        Guid userId,
        IReadOnlyCollection<MushroomRevisionStatus> statuses,
        CancellationToken ct);

    Task<List<MushroomRevision>> GetMushroomRevisionsByStatuses(
        IReadOnlyCollection<MushroomRevisionStatus> statuses,
        CancellationToken ct);

    Task<Guid> UpsertPublishedMushroomFromRevision(MushroomRevision revision, CancellationToken ct);

    Task ArchivePublishedMushroom(Guid mushroomId, CancellationToken ct);
}
