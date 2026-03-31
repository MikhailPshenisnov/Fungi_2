using BackendFungi.Models;
using BackendFungi.Models.Filters;
using BackendFungi.Models.Other;

namespace BackendFungi.Abstractions.Services;

public interface IMushroomsService
{
    Task<Guid> CreateMushroomAsync(Mushroom mushroom, CancellationToken ct);

    Task<(Mushroom Mushroom, List<bool> DoppelgangersMap, int LikesCount)> GetMushroomAsync(Guid mushroomId, CancellationToken ct);

    Task<(List<(Mushroom Mushroom, List<bool> DoppelgangersMap, int LikesCount)> Mushrooms, int TotalCount, int Page, int PageSize)>
        GetFilteredMushroomsAsync(
            MushroomFilter? mushroomFilter,
            int page,
            int pageSize,
            MushroomSortMode sortMode,
            CancellationToken ct);

    Task<Guid> UpdateMushroomAsync(Guid mushroomId, Mushroom newMushroom, CancellationToken ct);

    Task<Guid> DeleteMushroomAsync(Guid mushroomId, CancellationToken ct);

    Task<Guid> CreateDraftAsync(MushroomRevision revision, CancellationToken ct);

    Task<Guid> UpdateDraftAsync(Guid revisionId, MushroomRevision revision, CancellationToken ct);

    Task<MushroomRevision> SubmitForReviewAsync(Guid revisionId, Guid actorUserId, CancellationToken ct);

    Task<MushroomRevision> ModerateMushroomAsync(
        Guid revisionId,
        ModerationDecision decision,
        string? reviewNote,
        Guid actorUserId,
        CancellationToken ct);

    Task<MushroomRevision> ArchiveMushroomAsync(Guid revisionId, Guid actorUserId, CancellationToken ct);

    Task<List<MushroomRevision>> GetMyDraftsAsync(Guid userId, CancellationToken ct);

    Task<List<MushroomRevision>> GetMyMaterialsAsync(Guid userId, CancellationToken ct);

    Task<List<MushroomRevision>> GetModerationQueueAsync(CancellationToken ct);

    Task<MushroomRevision> GetEditorMushroomAsync(Guid revisionId, CancellationToken ct);
}
