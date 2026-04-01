using BackendFungi.Abstractions.Services;
using BackendFungi.Contracts.Other;
using BackendFungi.Contracts.Requests.MushroomsRequests;
using BackendFungi.Contracts.Responses;
using BackendFungi.Contracts.Responses.MushroomsResponses;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using BackendFungi.Models.Filters;
using BackendFungi.Models.Other;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace BackendFungi.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class MushroomsController : ControllerBase
{
    private const int DefaultPage = 1;
    private const int DefaultPageSize = 12;
    private const int MaxPageSize = 100;

    private readonly IAccessCheckService _accessCheckService;
    private readonly IMushroomsService _mushroomsService;
    private readonly IMushroomLikesService _mushroomLikesService;
    private readonly IMushroomMediaStorageService _mushroomMediaStorageService;

    public MushroomsController(
        IAccessCheckService accessCheckService,
        IMushroomsService mushroomsService,
        IMushroomLikesService mushroomLikesService,
        IMushroomMediaStorageService mushroomMediaStorageService)
    {
        _accessCheckService = accessCheckService;
        _mushroomsService = mushroomsService;
        _mushroomLikesService = mushroomLikesService;
        _mushroomMediaStorageService = mushroomMediaStorageService;
    }

    [HttpGet]
    [SwaggerOperation(OperationId = "GetMushroom", Summary = "Get mushroom",
        Description = "Receives information about the published mushroom by id")]
    public async Task<ActionResult<BaseResponse<GetMushroomResponse>>> GetMushroom(
        [FromQuery] GetMushroomRequest request,
        CancellationToken cancellationToken)
    {
        var (mushroom, doppelgangersMap, likesCount) = await _mushroomsService
            .GetMushroomAsync(request.MushroomId, cancellationToken);

        if (mushroom.Doppelgangers.Count != doppelgangersMap.Count)
            throw new IntegrityException("Length of doppelgangers is not equal to doppelgangers map length");

        var response = new BaseResponse<GetMushroomResponse>(
            new GetMushroomResponse(MapMushroomToDto(mushroom, doppelgangersMap, likesCount)),
            null);

        return Ok(response);
    }

    [HttpGet]
    [SwaggerOperation(OperationId = "GetFilteredMushrooms", Summary = "Get filtered mushrooms",
        Description = "Gets a list of published mushrooms with filters, sorting and pagination")]
    public async Task<ActionResult<BaseResponse<GetFilteredMushroomsResponse>>> GetFilteredMushrooms(
        [FromQuery] GetFilteredMushroomsRequest request,
        CancellationToken cancellationToken)
    {
        var (mushroomFilter, mushroomFilterError) = MushroomFilter
            .Create(request.PartOfName,
                request.Family,
                request.RedBook,
                request.Eatable,
                request.HasStem,
                request.StemSizeFrom,
                request.StemSizeTo,
                request.StemType,
                request.StemColor,
                request.CapType,
                request.CapColor,
                request.CapUndersideType);

        if (!string.IsNullOrEmpty(mushroomFilterError))
            throw new ConversionException($"Incorrect data format: {mushroomFilterError}");

        var page = request.Page ?? DefaultPage;
        var pageSize = request.PageSize ?? DefaultPageSize;

        if (page < 1)
            throw new ConversionException("Incorrect data format: page must be greater than or equal to 1");

        if (pageSize < 1 || pageSize > MaxPageSize)
            throw new ConversionException($"Incorrect data format: pageSize must be in range [1; {MaxPageSize}]");

        var sortMode = ParseSortMode(request.Sort);

        var (filteredMushrooms, totalCount, resolvedPage, resolvedPageSize) = await _mushroomsService
            .GetFilteredMushroomsAsync(mushroomFilter, page, pageSize, sortMode, cancellationToken);

        var response = new BaseResponse<GetFilteredMushroomsResponse>(
            new GetFilteredMushroomsResponse(
                filteredMushrooms
                    .Select(x => MapMushroomToDto(x.Mushroom, x.DoppelgangersMap, x.LikesCount))
                    .ToList(),
                totalCount,
                resolvedPage,
                resolvedPageSize),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpGet]
    [SwaggerOperation(OperationId = "GetEditorMushroom", Summary = "Get editor mushroom revision",
        Description = "Returns full mushroom revision data for editor and moderation flow")]
    public async Task<ActionResult<BaseResponse<GetEditorMushroomResponse>>> GetEditorMushroom(
        [FromQuery] GetEditorMushroomRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.GetCurrentUser(HttpContext, cancellationToken);
        var canWrite = HasPermission(user, PermissionCodes.MushroomsWrite);
        var canManageAny = HasPermission(user, PermissionCodes.MushroomsManageAny);
        var canReview = HasPermission(user, PermissionCodes.MushroomsReview);

        var revision = await _mushroomsService.GetEditorMushroomAsync(request.RevisionId, cancellationToken);

        if (!canWrite && !canManageAny && !canReview)
            throw new AccessException("The user does not have sufficient access rights");

        if (revision.CreatedByUserId != user.Id && !canManageAny && !canReview)
            throw new AccessException("The user does not have sufficient access rights");

        var response = new BaseResponse<GetEditorMushroomResponse>(
            new GetEditorMushroomResponse(await MapRevisionToDtoAsync(revision, cancellationToken)),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpGet]
    [SwaggerOperation(OperationId = "GetMyDrafts", Summary = "Get my mushroom drafts",
        Description = "Returns current user mushroom drafts, rejected and in-review revisions")]
    public async Task<ActionResult<BaseResponse<GetMyMushroomDraftsResponse>>> GetMyDrafts(CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.MushroomsWrite,
            cancellationToken);

        var revisions = await _mushroomsService.GetMyDraftsAsync(user.Id, cancellationToken);

        var response = new BaseResponse<GetMyMushroomDraftsResponse>(
            new GetMyMushroomDraftsResponse(await MapRevisionsToDtoAsync(revisions, cancellationToken)),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpGet]
    [SwaggerOperation(OperationId = "GetMyMaterials", Summary = "Get my mushroom materials",
        Description = "Returns current user published and archived mushroom revisions")]
    public async Task<ActionResult<BaseResponse<GetMyMushroomMaterialsResponse>>> GetMyMaterials(CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.MushroomsWrite,
            cancellationToken);

        var revisions = await _mushroomsService.GetMyMaterialsAsync(user.Id, cancellationToken);

        var response = new BaseResponse<GetMyMushroomMaterialsResponse>(
            new GetMyMushroomMaterialsResponse(await MapRevisionsToDtoAsync(revisions, cancellationToken)),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpGet]
    [SwaggerOperation(OperationId = "GetModerationQueue", Summary = "Get mushroom moderation queue",
        Description = "Returns mushroom revisions waiting for moderation")]
    public async Task<ActionResult<BaseResponse<GetMushroomModerationQueueResponse>>> GetModerationQueue(
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.MushroomsReview,
            cancellationToken);

        var revisions = await _mushroomsService.GetModerationQueueAsync(cancellationToken);

        var response = new BaseResponse<GetMushroomModerationQueueResponse>(
            new GetMushroomModerationQueueResponse(await MapRevisionsToDtoAsync(revisions, cancellationToken)),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    [SwaggerOperation(OperationId = "CreateDraft", Summary = "Create mushroom draft",
        Description = "Creates draft mushroom revision for current editor")]
    public async Task<ActionResult<BaseResponse<CreateMushroomDraftResponse>>> CreateDraft(
        [FromBody] CreateMushroomDraftRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.MushroomsWrite,
            cancellationToken);

        var now = DateTime.UtcNow;
        var (revision, revisionError) = MushroomRevision.Create(
            Guid.NewGuid(),
            request.SourceMushroomId,
            request.Name,
            request.SynonymousName,
            request.LatinName,
            request.Family,
            request.RedBook,
            request.Eatable,
            request.HasStem,
            request.StemSizeFrom,
            request.StemSizeTo,
            request.StemType,
            request.StemColor,
            request.CapType,
            request.CapColor,
            request.CapUndersideType,
            request.Description,
            request.HeaderPhotoLink,
            request.ExtraPhotoLinks,
            request.Doppelgangers,
            MushroomRevisionStatus.Draft,
            user.Id,
            user.Id,
            now,
            now,
            null,
            null,
            null,
            null,
            null,
            null);

        if (!string.IsNullOrEmpty(revisionError))
            throw new ConversionException($"Incorrect data format: {revisionError}");

        var createdRevisionId = await _mushroomsService.CreateDraftAsync(revision, cancellationToken);

        var response = new BaseResponse<CreateMushroomDraftResponse>(
            new CreateMushroomDraftResponse(createdRevisionId, MushroomRevisionStatus.Draft.ToString()),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPut]
    [SwaggerOperation(OperationId = "UpdateDraft", Summary = "Update mushroom draft",
        Description = "Updates draft/rejected mushroom revision content")]
    public async Task<ActionResult<BaseResponse<UpdateMushroomDraftResponse>>> UpdateDraft(
        [FromBody] UpdateMushroomDraftRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.MushroomsWrite,
            cancellationToken);

        var existingRevision = await _mushroomsService.GetEditorMushroomAsync(request.RevisionId, cancellationToken);
        var canManageAny = HasPermission(user, PermissionCodes.MushroomsManageAny);

        if (existingRevision.CreatedByUserId != user.Id && !canManageAny)
            throw new AccessException("The user does not have sufficient access rights");

        var now = DateTime.UtcNow;
        var (revision, revisionError) = MushroomRevision.Create(
            request.RevisionId,
            existingRevision.SourceMushroomId,
            request.Name,
            request.SynonymousName,
            request.LatinName,
            request.Family,
            request.RedBook,
            request.Eatable,
            request.HasStem,
            request.StemSizeFrom,
            request.StemSizeTo,
            request.StemType,
            request.StemColor,
            request.CapType,
            request.CapColor,
            request.CapUndersideType,
            request.Description,
            request.HeaderPhotoLink,
            request.ExtraPhotoLinks,
            request.Doppelgangers,
            existingRevision.Status,
            existingRevision.CreatedByUserId,
            user.Id,
            existingRevision.CreatedAt,
            now,
            existingRevision.SubmittedAt,
            existingRevision.PublishedAt,
            existingRevision.ReviewedAt,
            existingRevision.ReviewedByUserId,
            existingRevision.ReviewNote,
            existingRevision.ArchivedAt);

        if (!string.IsNullOrEmpty(revisionError))
            throw new ConversionException($"Incorrect data format: {revisionError}");

        var updatedRevisionId = await _mushroomsService.UpdateDraftAsync(request.RevisionId, revision, cancellationToken);
        var updatedRevision = await _mushroomsService.GetEditorMushroomAsync(updatedRevisionId, cancellationToken);

        var response = new BaseResponse<UpdateMushroomDraftResponse>(
            new UpdateMushroomDraftResponse(updatedRevisionId, updatedRevision.Status.ToString()),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    [SwaggerOperation(OperationId = "SubmitForReview", Summary = "Submit mushroom for review",
        Description = "Moves draft/rejected mushroom revision to moderation queue")]
    public async Task<ActionResult<BaseResponse<SubmitMushroomForReviewResponse>>> SubmitForReview(
        [FromBody] SubmitMushroomForReviewRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.MushroomsWrite,
            cancellationToken);

        var existingRevision = await _mushroomsService.GetEditorMushroomAsync(request.RevisionId, cancellationToken);
        var canManageAny = HasPermission(user, PermissionCodes.MushroomsManageAny);

        if (existingRevision.CreatedByUserId != user.Id && !canManageAny)
            throw new AccessException("The user does not have sufficient access rights");

        var submittedRevision = await _mushroomsService.SubmitForReviewAsync(
            request.RevisionId,
            user.Id,
            cancellationToken);

        var response = new BaseResponse<SubmitMushroomForReviewResponse>(
            new SubmitMushroomForReviewResponse(
                submittedRevision.Id,
                submittedRevision.Status.ToString(),
                submittedRevision.SubmittedAt ?? DateTime.UtcNow),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    [SwaggerOperation(OperationId = "ModerateMushroom", Summary = "Moderate mushroom revision",
        Description = "Approves or rejects mushroom revision from moderation queue")]
    public async Task<ActionResult<BaseResponse<ModerateMushroomResponse>>> ModerateMushroom(
        [FromBody] ModerateMushroomRequest request,
        CancellationToken cancellationToken)
    {
        var decision = request.Decision!.Value;

        var user = decision == ModerationDecision.Approve
            ? await _accessCheckService.CheckPermission(HttpContext, PermissionCodes.MushroomsPublish, cancellationToken)
            : await _accessCheckService.CheckPermission(HttpContext, PermissionCodes.MushroomsReview, cancellationToken);

        var revision = await _mushroomsService.ModerateMushroomAsync(
            request.RevisionId,
            decision,
            request.ReviewNote,
            user.Id,
            cancellationToken);

        var response = new BaseResponse<ModerateMushroomResponse>(
            new ModerateMushroomResponse(
                revision.Id,
                revision.Status.ToString(),
                revision.ReviewedAt ?? DateTime.UtcNow,
                revision.SourceMushroomId),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    [SwaggerOperation(OperationId = "ArchiveMushroom", Summary = "Archive mushroom revision",
        Description = "Archives mushroom revision and hides published mushroom snapshot")]
    public async Task<ActionResult<BaseResponse<ArchiveMushroomResponse>>> ArchiveMushroom(
        [FromBody] ArchiveMushroomRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.GetCurrentUser(HttpContext, cancellationToken);
        var canArchive = HasPermission(user, PermissionCodes.MushroomsArchive);
        var canManageAny = HasPermission(user, PermissionCodes.MushroomsManageAny);

        if (!canArchive && !canManageAny)
            throw new AccessException("The user does not have sufficient access rights");

        var revision = await _mushroomsService.GetEditorMushroomAsync(request.RevisionId, cancellationToken);

        if (revision.CreatedByUserId != user.Id && !canManageAny)
            throw new AccessException("The user does not have sufficient access rights");

        var archivedRevision = await _mushroomsService.ArchiveMushroomAsync(
            request.RevisionId,
            user.Id,
            cancellationToken);

        var response = new BaseResponse<ArchiveMushroomResponse>(
            new ArchiveMushroomResponse(
                archivedRevision.Id,
                archivedRevision.Status.ToString(),
                archivedRevision.ArchivedAt ?? DateTime.UtcNow),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    [Consumes("multipart/form-data")]
    [SwaggerOperation(OperationId = "UploadMushroomImage", Summary = "Upload mushroom image",
        Description = "Uploads image for mushroom content and returns media url/path")]
    public async Task<ActionResult<BaseResponse<UploadMushroomImageResponse>>> UploadMushroomImage(
        [FromForm] UploadMushroomImageRequest request,
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.MushroomMediaWrite,
            cancellationToken);

        var mediaPath = await _mushroomMediaStorageService.SaveMushroomImageAsync(request.Image, cancellationToken);
        var mediaUrl = _mushroomMediaStorageService.BuildPublicUrl(mediaPath) ?? string.Empty;

        var response = new BaseResponse<UploadMushroomImageResponse>(
            new UploadMushroomImageResponse(mediaUrl, mediaPath),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpDelete]
    [SwaggerOperation(OperationId = "DeleteMushroomImage", Summary = "Delete mushroom image",
        Description = "Deletes uploaded mushroom image by relative path")]
    public async Task<ActionResult<BaseResponse<DeleteMushroomImageResponse>>> DeleteMushroomImage(
        [FromQuery] DeleteMushroomImageRequest request,
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.MushroomMediaWrite,
            cancellationToken);

        var isDeleted = await _mushroomMediaStorageService.DeleteMushroomImageAsync(request.MediaPath, cancellationToken);

        var response = new BaseResponse<DeleteMushroomImageResponse>(
            new DeleteMushroomImageResponse(isDeleted),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    [Obsolete("Use CreateDraft/SubmitForReview workflow. Legacy hard publish path is reserved for purge operations.")]
    [SwaggerOperation(OperationId = "CreateMushroom", Summary = "Create mushroom (legacy)",
        Description = "Legacy endpoint. Prefer CreateDraft/SubmitForReview workflow")]
    public async Task<ActionResult<BaseResponse<CreateMushroomResponse>>> CreateMushroom(
        [FromBody] CreateMushroomRequest request,
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.MushroomsPurge,
            cancellationToken);

        var (mushroom, mushroomError) = Mushroom.Create(
            Guid.NewGuid(),
            request.Name,
            request.SynonymousName,
            request.LatinName,
            request.Family,
            request.RedBook,
            request.Eatable,
            request.HasStem,
            request.StemSizeFrom,
            request.StemSizeTo,
            request.StemType,
            request.StemColor,
            request.CapType,
            request.CapColor,
            request.CapUndersideType,
            request.Description,
            request.HeaderPhotoLink,
            request.ExtraPhotoLinks,
            request.Doppelgangers);

        if (!string.IsNullOrEmpty(mushroomError))
            throw new ConversionException($"Incorrect data format: {mushroomError}");

        var createdMushroomId = await _mushroomsService.CreateMushroomAsync(mushroom, cancellationToken);

        var response = new BaseResponse<CreateMushroomResponse>(
            new CreateMushroomResponse(createdMushroomId),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPut]
    [Obsolete("Use UpdateDraft workflow. Legacy hard update path is reserved for purge operations.")]
    [SwaggerOperation(OperationId = "UpdateMushroom", Summary = "Update mushroom (legacy)",
        Description = "Legacy endpoint. Prefer UpdateDraft")]
    public async Task<ActionResult<BaseResponse<UpdateMushroomResponse>>> UpdateMushroom(
        [FromBody] UpdateMushroomRequest request,
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.MushroomsPurge,
            cancellationToken);

        var (newMushroom, newMushroomError) = Mushroom.Create(
            request.MushroomId,
            request.NewName,
            request.NewSynonymousName,
            request.NewLatinName,
            request.NewFamily,
            request.NewRedBook,
            request.NewEatable,
            request.NewHasStem,
            request.NewStemSizeFrom,
            request.NewStemSizeTo,
            request.NewStemType,
            request.NewStemColor,
            request.NewCapType,
            request.NewCapColor,
            request.NewCapUndersideType,
            request.NewDescription,
            request.NewHeaderPhotoLink,
            request.NewExtraPhotoLinks,
            request.NewDoppelgangers);

        if (!string.IsNullOrEmpty(newMushroomError))
            throw new ConversionException($"Incorrect data format: {newMushroomError}");

        var updatedMushroomId = await _mushroomsService.UpdateMushroomAsync(
            request.MushroomId,
            newMushroom,
            cancellationToken);

        var response = new BaseResponse<UpdateMushroomResponse>(
            new UpdateMushroomResponse(updatedMushroomId),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpDelete]
    [Obsolete("Use ArchiveMushroom for business workflow. Hard delete is reserved for purge operations.")]
    [SwaggerOperation(OperationId = "DeleteMushroom", Summary = "Delete mushroom (deprecated)",
        Description = "Hard delete endpoint. Deprecated, use ArchiveMushroom")]
    public async Task<ActionResult<BaseResponse<DeleteMushroomResponse>>> DeleteMushroom(
        [FromQuery] DeleteMushroomRequest request,
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.MushroomsPurge,
            cancellationToken);

        var deletedMushroomId = await _mushroomsService.DeleteMushroomAsync(request.MushroomId, cancellationToken);

        var response = new BaseResponse<DeleteMushroomResponse>(
            new DeleteMushroomResponse(deletedMushroomId),
            null);

        return Ok(response);
    }

    private async Task<List<EditorMushroomDto>> MapRevisionsToDtoAsync(
        List<MushroomRevision> revisions,
        CancellationToken cancellationToken)
    {
        var dtoList = new List<EditorMushroomDto>(revisions.Count);
        foreach (var revision in revisions)
            dtoList.Add(await MapRevisionToDtoAsync(revision, cancellationToken));

        return dtoList;
    }

    private async Task<EditorMushroomDto> MapRevisionToDtoAsync(MushroomRevision revision, CancellationToken cancellationToken)
    {
        var likesCount = await GetLikesCountSafeAsync(revision.SourceMushroomId, cancellationToken);

        return new EditorMushroomDto(
            revision.Id,
            revision.SourceMushroomId,
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
            revision.HeaderPhotoLink,
            revision.ExtraPhotoLinks,
            revision.DoppelgangerNames,
            revision.Status.ToString(),
            revision.CreatedByUserId,
            revision.UpdatedByUserId,
            revision.CreatedAt,
            revision.UpdatedAt,
            revision.SubmittedAt,
            revision.PublishedAt,
            revision.ReviewedAt,
            revision.ReviewedByUserId,
            revision.ReviewNote,
            revision.ArchivedAt,
            likesCount);
    }

    private async Task<int> GetLikesCountSafeAsync(Guid? sourceMushroomId, CancellationToken cancellationToken)
    {
        if (sourceMushroomId is null)
            return 0;

        try
        {
            return await _mushroomLikesService.GetLikesCountAsync(sourceMushroomId.Value, cancellationToken);
        }
        catch (UnknownIdentifierException)
        {
            return 0;
        }
    }

    private static MushroomSortMode ParseSortMode(string? sort)
    {
        if (string.IsNullOrWhiteSpace(sort))
            return MushroomSortMode.Name;

        return sort.Trim().ToLowerInvariant() switch
        {
            "likes" => MushroomSortMode.Likes,
            "name" => MushroomSortMode.Name,
            _ => throw new ConversionException("Incorrect data format: Unknown sort mode")
        };
    }

    private static MushroomDto MapMushroomToDto(Mushroom mushroom, List<bool> doppelgangersMap, int likesCount)
    {
        return new MushroomDto(
            mushroom.Id,
            mushroom.Name,
            mushroom.SynonymousName,
            mushroom.LatinName,
            mushroom.Family,
            mushroom.RedBook,
            mushroom.Eatable,
            mushroom.HasStem,
            mushroom.StemSizeFrom,
            mushroom.StemSizeTo,
            mushroom.StemType,
            mushroom.StemColor,
            mushroom.CapType,
            mushroom.CapColor,
            mushroom.CapUndersideType,
            mushroom.Description,
            mushroom.HeaderPhotoLink,
            mushroom.ExtraPhotoLinks,
            mushroom.Doppelgangers
                .Select((doppelganger, index) =>
                    new DoppelgangerDto(
                        doppelganger.Id,
                        doppelganger.MushroomId,
                        doppelganger.DoppelgangerName,
                        doppelgangersMap[index]))
                .ToList(),
            likesCount);
    }

    private static bool HasPermission(User user, string permissionCode)
    {
        return user.Role.PermissionCodes.Contains(permissionCode, StringComparer.OrdinalIgnoreCase);
    }
}
