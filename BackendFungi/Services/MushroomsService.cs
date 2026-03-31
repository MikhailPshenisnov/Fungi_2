using BackendFungi.Abstractions.Repositories;
using BackendFungi.Abstractions.Services;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using BackendFungi.Models.Filters;
using BackendFungi.Models.Other;

namespace BackendFungi.Services;

public class MushroomsService : IMushroomsService
{
    private readonly IMushroomsRepository _mushroomsRepository;

    public MushroomsService(IMushroomsRepository mushroomsRepository)
    {
        _mushroomsRepository = mushroomsRepository;
    }

    public async Task<Guid> CreateMushroomAsync(Mushroom mushroom, CancellationToken ct)
    {
        return await _mushroomsRepository.CreateMushroom(mushroom, ct);
    }

    public async Task<(Mushroom Mushroom, List<bool> DoppelgangersMap, int LikesCount)> GetMushroomAsync(
        Guid mushroomId,
        CancellationToken ct)
    {
        var (mushroom, likesCount) = await _mushroomsRepository.GetPublishedMushroom(mushroomId, ct);
        var allPublishedNames = await _mushroomsRepository.GetPublishedMushroomNames(ct);

        var doppelgangersMap = mushroom.Doppelgangers
            .Select(doppelganger => allPublishedNames.Contains(doppelganger.DoppelgangerName))
            .ToList();

        return (mushroom, doppelgangersMap, likesCount);
    }

    public async Task<(List<(Mushroom Mushroom, List<bool> DoppelgangersMap, int LikesCount)> Mushrooms, int TotalCount, int Page, int PageSize)>
        GetFilteredMushroomsAsync(
            MushroomFilter? mushroomFilter,
            int page,
            int pageSize,
            MushroomSortMode sortMode,
            CancellationToken ct)
    {
        var normalizedPage = Math.Max(1, page);
        var normalizedPageSize = Math.Clamp(pageSize, 1, 200);

        var (mushrooms, totalCount) = await _mushroomsRepository.GetFilteredPublishedMushrooms(
            mushroomFilter,
            normalizedPage,
            normalizedPageSize,
            sortMode,
            ct);

        var allPublishedNames = await _mushroomsRepository.GetPublishedMushroomNames(ct);

        var result = mushrooms
            .Select(x =>
            {
                var doppelgangersMap = x.Mushroom.Doppelgangers
                    .Select(doppelganger => allPublishedNames.Contains(doppelganger.DoppelgangerName))
                    .ToList();

                return (x.Mushroom, doppelgangersMap, x.LikesCount);
            })
            .ToList();

        return (result, totalCount, normalizedPage, normalizedPageSize);
    }

    public async Task<Guid> UpdateMushroomAsync(Guid mushroomId, Mushroom newMushroom, CancellationToken ct)
    {
        return await _mushroomsRepository.UpdateMushroom(mushroomId, newMushroom, ct);
    }

    public async Task<Guid> DeleteMushroomAsync(Guid mushroomId, CancellationToken ct)
    {
        return await _mushroomsRepository.DeleteMushroom(mushroomId, ct);
    }

    public async Task<Guid> CreateDraftAsync(MushroomRevision revision, CancellationToken ct)
    {
        if (revision.Status != MushroomRevisionStatus.Draft)
            throw new ConversionException("Incorrect data format: Draft mushroom revision must have Draft status");

        if (revision.SourceMushroomId is not null)
        {
            var sourceExists = await _mushroomsRepository.ExistsPublishedMushroom(revision.SourceMushroomId.Value, ct);
            if (!sourceExists)
                throw new UnknownIdentifierException("Unknown mushroom id");
        }

        return await _mushroomsRepository.CreateMushroomRevision(revision, ct);
    }

    public async Task<Guid> UpdateDraftAsync(Guid revisionId, MushroomRevision revision, CancellationToken ct)
    {
        var existingRevision = await GetEditorMushroomAsync(revisionId, ct);

        if (existingRevision.Status is not (MushroomRevisionStatus.Draft or MushroomRevisionStatus.Rejected))
            throw new ConversionException("Incorrect data format: Mushroom revision status does not allow draft update");

        return await _mushroomsRepository.UpdateMushroomRevision(revisionId, revision, ct);
    }

    public async Task<MushroomRevision> SubmitForReviewAsync(Guid revisionId, Guid actorUserId, CancellationToken ct)
    {
        var existingRevision = await GetEditorMushroomAsync(revisionId, ct);

        if (existingRevision.Status is not (MushroomRevisionStatus.Draft or MushroomRevisionStatus.Rejected))
            throw new ConversionException("Incorrect data format: Only Draft or Rejected mushroom revision can be submitted for review");

        if (string.IsNullOrWhiteSpace(existingRevision.HeaderPhotoLink))
            throw new ConversionException("Incorrect data format: Header photo is required before submitting mushroom revision for review");

        var submittedAt = DateTime.UtcNow;
        var updatedRevision = RebuildRevision(
            existingRevision,
            status: MushroomRevisionStatus.InReview,
            updatedByUserId: actorUserId,
            updatedAt: submittedAt,
            submittedAt: submittedAt,
            reviewedAt: null,
            reviewedByUserId: null,
            reviewNote: null,
            archivedAt: null,
            publishedAt: null);

        await _mushroomsRepository.UpdateMushroomRevision(revisionId, updatedRevision, ct);
        return updatedRevision;
    }

    public async Task<MushroomRevision> ModerateMushroomAsync(
        Guid revisionId,
        ModerationDecision decision,
        string? reviewNote,
        Guid actorUserId,
        CancellationToken ct)
    {
        var existingRevision = await GetEditorMushroomAsync(revisionId, ct);

        if (existingRevision.Status != MushroomRevisionStatus.InReview)
            throw new ConversionException("Incorrect data format: Only InReview mushroom revision can be moderated");

        var now = DateTime.UtcNow;
        var normalizedReviewNote = string.IsNullOrWhiteSpace(reviewNote) ? null : reviewNote.Trim();

        if (decision == ModerationDecision.Reject)
        {
            var rejectedRevision = RebuildRevision(
                existingRevision,
                status: MushroomRevisionStatus.Rejected,
                updatedByUserId: actorUserId,
                updatedAt: now,
                reviewedAt: now,
                reviewedByUserId: actorUserId,
                reviewNote: normalizedReviewNote,
                publishedAt: null);

            await _mushroomsRepository.UpdateMushroomRevision(revisionId, rejectedRevision, ct);
            return rejectedRevision;
        }

        if (string.IsNullOrWhiteSpace(existingRevision.HeaderPhotoLink))
            throw new ConversionException("Incorrect data format: Header photo is required before approval");

        var publishedMushroomId = await _mushroomsRepository.UpsertPublishedMushroomFromRevision(existingRevision, ct);

        var approvedRevision = RebuildRevision(
            existingRevision,
            sourceMushroomId: publishedMushroomId,
            status: MushroomRevisionStatus.Published,
            updatedByUserId: actorUserId,
            updatedAt: now,
            reviewedAt: now,
            reviewedByUserId: actorUserId,
            reviewNote: normalizedReviewNote,
            publishedAt: now,
            archivedAt: null);

        await _mushroomsRepository.UpdateMushroomRevision(revisionId, approvedRevision, ct);
        return approvedRevision;
    }

    public async Task<MushroomRevision> ArchiveMushroomAsync(Guid revisionId, Guid actorUserId, CancellationToken ct)
    {
        var existingRevision = await GetEditorMushroomAsync(revisionId, ct);

        if (existingRevision.Status == MushroomRevisionStatus.Archived)
            return existingRevision;

        if (!MushroomRevision.CanTransitionStatus(existingRevision.Status, MushroomRevisionStatus.Archived))
            throw new ConversionException("Incorrect data format: Unable to archive mushroom revision from current status");

        var now = DateTime.UtcNow;
        var archivedRevision = RebuildRevision(
            existingRevision,
            status: MushroomRevisionStatus.Archived,
            updatedByUserId: actorUserId,
            updatedAt: now,
            archivedAt: now);

        await _mushroomsRepository.UpdateMushroomRevision(revisionId, archivedRevision, ct);

        if (archivedRevision.SourceMushroomId is not null)
            await _mushroomsRepository.ArchivePublishedMushroom(archivedRevision.SourceMushroomId.Value, ct);

        return archivedRevision;
    }

    public async Task<List<MushroomRevision>> GetMyDraftsAsync(Guid userId, CancellationToken ct)
    {
        return await _mushroomsRepository.GetMushroomRevisionsByAuthor(
            userId,
            new[]
            {
                MushroomRevisionStatus.Draft,
                MushroomRevisionStatus.Rejected,
                MushroomRevisionStatus.InReview
            },
            ct);
    }

    public async Task<List<MushroomRevision>> GetMyMaterialsAsync(Guid userId, CancellationToken ct)
    {
        return await _mushroomsRepository.GetMushroomRevisionsByAuthor(
            userId,
            new[]
            {
                MushroomRevisionStatus.Published,
                MushroomRevisionStatus.Archived
            },
            ct);
    }

    public async Task<List<MushroomRevision>> GetModerationQueueAsync(CancellationToken ct)
    {
        return await _mushroomsRepository.GetMushroomRevisionsByStatuses(
            new[]
            {
                MushroomRevisionStatus.InReview
            },
            ct);
    }

    public async Task<MushroomRevision> GetEditorMushroomAsync(Guid revisionId, CancellationToken ct)
    {
        var revision = await _mushroomsRepository.GetMushroomRevisionById(revisionId, ct);
        if (revision is null)
            throw new UnknownIdentifierException("Unknown mushroom revision id");

        return revision;
    }

    private static MushroomRevision RebuildRevision(
        MushroomRevision source,
        Guid? sourceMushroomId = null,
        MushroomRevisionStatus? status = null,
        Guid? updatedByUserId = null,
        DateTime? updatedAt = null,
        DateTime? submittedAt = null,
        DateTime? publishedAt = null,
        DateTime? reviewedAt = null,
        Guid? reviewedByUserId = null,
        string? reviewNote = null,
        DateTime? archivedAt = null,
        string? headerPhotoLink = null,
        List<string>? extraPhotoLinks = null,
        List<string>? doppelgangerNames = null)
    {
        var (revision, revisionError) = MushroomRevision.Create(
            source.Id,
            sourceMushroomId ?? source.SourceMushroomId,
            source.Name,
            source.SynonymousName,
            source.LatinName,
            source.Family,
            source.RedBook,
            source.Eatable,
            source.HasStem,
            source.StemSizeFrom,
            source.StemSizeTo,
            source.StemType,
            source.StemColor,
            source.CapType,
            source.CapColor,
            source.CapUndersideType,
            source.Description,
            headerPhotoLink ?? source.HeaderPhotoLink,
            extraPhotoLinks ?? source.ExtraPhotoLinks,
            doppelgangerNames ?? source.DoppelgangerNames,
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

        if (!string.IsNullOrEmpty(revisionError))
            throw new ConversionException($"Incorrect data format: {revisionError}");

        return revision;
    }
}
