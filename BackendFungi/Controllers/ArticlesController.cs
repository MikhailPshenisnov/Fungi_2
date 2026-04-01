using BackendFungi.Abstractions.Services;
using BackendFungi.Contracts.Other;
using BackendFungi.Contracts.Requests.ArticlesRequests;
using BackendFungi.Contracts.Responses;
using BackendFungi.Contracts.Responses.ArticlesResponses;
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
public class ArticlesController : ControllerBase
{
    private const int DefaultPage = 1;
    private const int DefaultPageSize = 12;
    private const int MaxPageSize = 100;

    private readonly IAccessCheckService _accessCheckService;
    private readonly IArticlesService _articlesService;
    private readonly IArticleLikesService _articleLikesService;
    private readonly IArticleMediaStorageService _articleMediaStorageService;

    public ArticlesController(
        IAccessCheckService accessCheckService,
        IArticlesService articlesService,
        IArticleLikesService articleLikesService,
        IArticleMediaStorageService articleMediaStorageService)
    {
        _accessCheckService = accessCheckService;
        _articlesService = articlesService;
        _articleLikesService = articleLikesService;
        _articleMediaStorageService = articleMediaStorageService;
    }

    [HttpGet]
    [SwaggerOperation(OperationId = "GetArticle", Summary = "Get article",
        Description = "Receives published article information by id")]
    public async Task<ActionResult<BaseResponse<GetArticleResponse>>> GetArticle(
        [FromQuery] GetArticleRequest request,
        CancellationToken cancellationToken)
    {
        var article = await _articlesService.GetArticleAsync(request.ArticleId, cancellationToken);
        var response = new BaseResponse<GetArticleResponse>(
            new GetArticleResponse(await MapArticleToDtoAsync(article, cancellationToken)),
            null);

        return Ok(response);
    }

    [HttpGet]
    [SwaggerOperation(OperationId = "GetFilteredArticles", Summary = "Get filtered articles",
        Description = "Gets a list of published articles with filters")]
    public async Task<ActionResult<BaseResponse<GetFilteredArticlesResponse>>> GetFilteredArticles(
        [FromQuery] GetFilteredArticlesRequest request,
        CancellationToken cancellationToken)
    {
        var (articleFilter, articleFilterError) = ArticleFilter
            .Create(request.PartOfTitle,
                request.PublishDateFrom,
                request.PublishDateTo,
                request.PartOfAuthorString);

        if (!string.IsNullOrEmpty(articleFilterError))
            throw new ConversionException($"Incorrect data format: {articleFilterError}");

        var page = request.Page ?? DefaultPage;
        var pageSize = request.PageSize ?? DefaultPageSize;

        if (page < 1)
            throw new ConversionException("Incorrect data format: page must be greater than or equal to 1");

        if (pageSize < 1 || pageSize > MaxPageSize)
            throw new ConversionException($"Incorrect data format: pageSize must be in range [1; {MaxPageSize}]");

        var sortMode = ParseSortMode(request.Sort);

        var (filteredArticles, totalCount) = await _articlesService.GetFilteredArticlesAsync(
            articleFilter,
            page,
            pageSize,
            sortMode,
            cancellationToken);

        var totalPages = Math.Max(1, (int)Math.Ceiling(totalCount / (double)pageSize));
        var resolvedPage = totalCount == 0 ? DefaultPage : Math.Min(page, totalPages);

        var response = new BaseResponse<GetFilteredArticlesResponse>(
            new GetFilteredArticlesResponse(
                await MapArticlesToDtoAsync(filteredArticles, cancellationToken),
                totalCount,
                resolvedPage,
                pageSize),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpGet]
    [SwaggerOperation(OperationId = "GetEditorArticle", Summary = "Get editor article",
        Description = "Returns full article data for editor and moderation flow")]
    public async Task<ActionResult<BaseResponse<GetEditorArticleResponse>>> GetEditorArticle(
        [FromQuery] GetEditorArticleRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.ArticlesWrite,
            cancellationToken);

        var article = await _articlesService.GetEditorArticleAsync(request.ArticleId, cancellationToken);

        var canManageAny = HasPermission(user, PermissionCodes.ArticlesManageAny);
        var canReview = HasPermission(user, PermissionCodes.ArticlesReview);

        if (article.CreatedByUserId != user.Id && !canManageAny && !canReview)
            throw new AccessException("The user does not have sufficient access rights");

        var linkedMushroomIds = await _articlesService.GetArticleMushroomIdsAsync(article.Id, cancellationToken);
        var likesCount = await _articleLikesService.GetLikesCountAsync(article.Id, cancellationToken);

        var response = new BaseResponse<GetEditorArticleResponse>(
            new GetEditorArticleResponse(MapEditorArticleToDto(article, linkedMushroomIds, likesCount)),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpGet]
    [SwaggerOperation(OperationId = "GetMyDrafts", Summary = "Get my drafts",
        Description = "Returns current user drafts, rejected and in-review articles")]
    public async Task<ActionResult<BaseResponse<GetMyDraftsResponse>>> GetMyDrafts(CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.ArticlesWrite,
            cancellationToken);

        var articles = await _articlesService.GetMyDraftsAsync(user.Id, cancellationToken);

        var response = new BaseResponse<GetMyDraftsResponse>(
            new GetMyDraftsResponse(await MapArticlesToDtoAsync(articles, cancellationToken)),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpGet]
    [SwaggerOperation(OperationId = "GetMyMaterials", Summary = "Get my materials",
        Description = "Returns current user published, scheduled and archived articles")]
    public async Task<ActionResult<BaseResponse<GetMyMaterialsResponse>>> GetMyMaterials(CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.ArticlesWrite,
            cancellationToken);

        var articles = await _articlesService.GetMyMaterialsAsync(user.Id, cancellationToken);

        var response = new BaseResponse<GetMyMaterialsResponse>(
            new GetMyMaterialsResponse(await MapArticlesToDtoAsync(articles, cancellationToken)),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpGet]
    [SwaggerOperation(OperationId = "GetModerationQueue", Summary = "Get moderation queue",
        Description = "Returns articles waiting for moderation")]
    public async Task<ActionResult<BaseResponse<GetModerationQueueResponse>>> GetModerationQueue(
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.ArticlesReview,
            cancellationToken);

        var articles = await _articlesService.GetModerationQueueAsync(cancellationToken);

        var response = new BaseResponse<GetModerationQueueResponse>(
            new GetModerationQueueResponse(await MapArticlesToDtoAsync(articles, cancellationToken)),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    [SwaggerOperation(OperationId = "CreateDraft", Summary = "Create draft",
        Description = "Creates draft article for current editor")]
    public async Task<ActionResult<BaseResponse<CreateDraftResponse>>> CreateDraft(
        [FromBody] CreateDraftRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.ArticlesWrite,
            cancellationToken);

        var articleId = Guid.NewGuid();
        var now = DateTime.UtcNow;
        var paragraphs = MapParagraphInputs(articleId, request.Paragraphs);

        var (article, articleError) = Article.Create(
            articleId,
            request.Title,
            request.PublishDate,
            request.AuthorString,
            request.HeaderPhotoLink,
            request.ExtraPhotoLinks,
            paragraphs,
            ArticleStatus.Draft,
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

        if (!string.IsNullOrEmpty(articleError))
            throw new ConversionException($"Incorrect data format: {articleError}");

        var createdArticleId = await _articlesService.CreateDraftAsync(article, cancellationToken);

        if (request.LinkedMushroomIds is not null)
            await _articlesService.ReplaceArticleMushroomsAsync(createdArticleId, request.LinkedMushroomIds, cancellationToken);

        var response = new BaseResponse<CreateDraftResponse>(
            new CreateDraftResponse(createdArticleId, ArticleStatus.Draft.ToString()),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPut]
    [SwaggerOperation(OperationId = "UpdateDraft", Summary = "Update draft",
        Description = "Updates draft/rejected article content")]
    public async Task<ActionResult<BaseResponse<UpdateDraftResponse>>> UpdateDraft(
        [FromBody] UpdateDraftRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.ArticlesWrite,
            cancellationToken);

        var existingArticle = await _articlesService.GetEditorArticleAsync(request.ArticleId, cancellationToken);
        var canManageAny = HasPermission(user, PermissionCodes.ArticlesManageAny);

        if (existingArticle.CreatedByUserId != user.Id && !canManageAny)
            throw new AccessException("The user does not have sufficient access rights");

        if (existingArticle.Status == ArticleStatus.Published && !canManageAny)
            throw new AccessException("The user does not have sufficient access rights");

        var now = DateTime.UtcNow;
        var paragraphs = MapParagraphInputs(request.ArticleId, request.Paragraphs);

        var (newArticle, newArticleError) = Article.Create(
            request.ArticleId,
            request.Title,
            request.PublishDate,
            request.AuthorString,
            request.HeaderPhotoLink,
            request.ExtraPhotoLinks,
            paragraphs,
            existingArticle.Status,
            existingArticle.CreatedByUserId,
            user.Id,
            existingArticle.CreatedAt,
            now,
            existingArticle.SubmittedAt,
            existingArticle.PublishedAt,
            existingArticle.ReviewedAt,
            existingArticle.ReviewedByUserId,
            existingArticle.ReviewNote,
            existingArticle.ArchivedAt);

        if (!string.IsNullOrEmpty(newArticleError))
            throw new ConversionException($"Incorrect data format: {newArticleError}");

        var updatedArticleId = await _articlesService.UpdateDraftAsync(request.ArticleId, newArticle, cancellationToken);

        if (request.LinkedMushroomIds is not null)
            await _articlesService.ReplaceArticleMushroomsAsync(updatedArticleId, request.LinkedMushroomIds, cancellationToken);

        var updatedArticle = await _articlesService.GetEditorArticleAsync(updatedArticleId, cancellationToken);

        var response = new BaseResponse<UpdateDraftResponse>(
            new UpdateDraftResponse(updatedArticleId, updatedArticle.Status.ToString()),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    [SwaggerOperation(OperationId = "SubmitForReview", Summary = "Submit for review",
        Description = "Moves draft/rejected article to moderation queue")]
    public async Task<ActionResult<BaseResponse<SubmitForReviewResponse>>> SubmitForReview(
        [FromBody] SubmitForReviewRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.ArticlesWrite,
            cancellationToken);

        var existingArticle = await _articlesService.GetEditorArticleAsync(request.ArticleId, cancellationToken);
        var canManageAny = HasPermission(user, PermissionCodes.ArticlesManageAny);

        if (existingArticle.CreatedByUserId != user.Id && !canManageAny)
            throw new AccessException("The user does not have sufficient access rights");

        var article = await _articlesService.SubmitForReviewAsync(request.ArticleId, user.Id, cancellationToken);

        var response = new BaseResponse<SubmitForReviewResponse>(
            new SubmitForReviewResponse(
                article.Id,
                article.Status.ToString(),
                article.SubmittedAt ?? DateTime.UtcNow),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    [SwaggerOperation(OperationId = "ModerateArticle", Summary = "Moderate article",
        Description = "Approves or rejects article from moderation queue")]
    public async Task<ActionResult<BaseResponse<ModerateArticleResponse>>> ModerateArticle(
        [FromBody] ModerateArticleRequest request,
        CancellationToken cancellationToken)
    {
        var decision = request.Decision!.Value;

        var user = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.ArticlesReview,
            cancellationToken);

        var article = await _articlesService.ModerateArticleAsync(
            request.ArticleId,
            decision,
            request.ReviewNote,
            user.Id,
            cancellationToken);

        var response = new BaseResponse<ModerateArticleResponse>(
            new ModerateArticleResponse(
                article.Id,
                article.Status.ToString(),
                article.ReviewedAt ?? DateTime.UtcNow),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    [SwaggerOperation(OperationId = "ArchiveArticle", Summary = "Archive article",
        Description = "Archives article instead of deleting it")]
    public async Task<ActionResult<BaseResponse<ArchiveArticleResponse>>> ArchiveArticle(
        [FromBody] ArchiveArticleRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.ArticlesArchive,
            cancellationToken);

        var existingArticle = await _articlesService.GetEditorArticleAsync(request.ArticleId, cancellationToken);
        var canManageAny = HasPermission(user, PermissionCodes.ArticlesManageAny);

        if (existingArticle.CreatedByUserId != user.Id && !canManageAny)
            throw new AccessException("The user does not have sufficient access rights");

        var article = await _articlesService.ArchiveArticleAsync(request.ArticleId, user.Id, cancellationToken);

        var response = new BaseResponse<ArchiveArticleResponse>(
            new ArchiveArticleResponse(
                article.Id,
                article.Status.ToString(),
                article.ArchivedAt ?? DateTime.UtcNow),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    [Consumes("multipart/form-data")]
    [SwaggerOperation(OperationId = "UploadArticleImage", Summary = "Upload article image",
        Description = "Uploads image for article content and returns media url/path")]
    public async Task<ActionResult<BaseResponse<UploadArticleImageResponse>>> UploadArticleImage(
        [FromForm] UploadArticleImageRequest request,
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.ArticleMediaWrite,
            cancellationToken);

        var mediaPath = await _articleMediaStorageService.SaveArticleImageAsync(request.Image, cancellationToken);
        var mediaUrl = _articleMediaStorageService.BuildPublicUrl(mediaPath) ?? string.Empty;

        var response = new BaseResponse<UploadArticleImageResponse>(
            new UploadArticleImageResponse(mediaUrl, mediaPath),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpDelete]
    [SwaggerOperation(OperationId = "DeleteArticleImage", Summary = "Delete article image",
        Description = "Deletes uploaded article image by relative path")]
    public async Task<ActionResult<BaseResponse<DeleteArticleImageResponse>>> DeleteArticleImage(
        [FromQuery] DeleteArticleImageRequest request,
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.ArticleMediaWrite,
            cancellationToken);

        var isDeleted = await _articleMediaStorageService.DeleteArticleImageAsync(request.MediaPath, cancellationToken);

        var response = new BaseResponse<DeleteArticleImageResponse>(
            new DeleteArticleImageResponse(isDeleted),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    [SwaggerOperation(OperationId = "CreateArticle", Summary = "Create article (legacy)",
        Description = "Legacy endpoint. Prefer CreateDraft/SubmitForReview workflow")]
    public async Task<ActionResult<BaseResponse<CreateArticleResponse>>> CreateArticle(
        [FromBody] CreateArticleRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.ArticlesWrite,
            cancellationToken);

        var now = DateTime.UtcNow;
        var targetStatus = request.PublishDate.ToUniversalTime() <= now
            ? ArticleStatus.Published
            : ArticleStatus.Scheduled;

        var publishedAt = targetStatus == ArticleStatus.Published ? now : (DateTime?)null;

        var (article, articleError) = Article.Create(
            Guid.NewGuid(),
            request.Title,
            request.PublishDate,
            request.AuthorString,
            request.HeaderPhotoLink,
            request.ExtraPhotoLinks,
            request.ArticleText.Split('\n').ToList(),
            targetStatus,
            user.Id,
            user.Id,
            now,
            now,
            null,
            publishedAt,
            null,
            null,
            null,
            null);

        if (!string.IsNullOrEmpty(articleError))
            throw new ConversionException($"Incorrect data format: {articleError}");

        var createdArticleId = await _articlesService.CreateArticleAsync(article, cancellationToken);

        var response = new BaseResponse<CreateArticleResponse>(
            new CreateArticleResponse(createdArticleId),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpPut]
    [SwaggerOperation(OperationId = "UpdateArticle", Summary = "Update article (legacy)",
        Description = "Legacy endpoint. Prefer UpdateDraft")]
    public async Task<ActionResult<BaseResponse<UpdateArticleResponse>>> UpdateArticle(
        [FromBody] UpdateArticleRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.ArticlesWrite,
            cancellationToken);

        var existingArticle = await _articlesService.GetEditorArticleAsync(request.ArticleId, cancellationToken);
        var canManageAny = HasPermission(user, PermissionCodes.ArticlesManageAny);

        if (existingArticle.CreatedByUserId != user.Id && !canManageAny)
            throw new AccessException("The user does not have sufficient access rights");

        var now = DateTime.UtcNow;

        var (newArticle, newArticleError) = Article.Create(
            request.ArticleId,
            request.NewTitle,
            request.NewPublishDate,
            request.NewAuthorString,
            request.NewHeaderPhotoLink,
            request.NewExtraPhotoLinks,
            request.NewArticleText.Split('\n').ToList(),
            existingArticle.Status,
            existingArticle.CreatedByUserId,
            user.Id,
            existingArticle.CreatedAt,
            now,
            existingArticle.SubmittedAt,
            existingArticle.PublishedAt,
            existingArticle.ReviewedAt,
            existingArticle.ReviewedByUserId,
            existingArticle.ReviewNote,
            existingArticle.ArchivedAt);

        if (!string.IsNullOrEmpty(newArticleError))
            throw new ConversionException($"Incorrect data format: {newArticleError}");

        var updatedArticleId = await _articlesService.UpdateArticleAsync(request.ArticleId, newArticle, cancellationToken);

        var response = new BaseResponse<UpdateArticleResponse>(
            new UpdateArticleResponse(updatedArticleId),
            null);

        return Ok(response);
    }

    [Authorize]
    [HttpDelete]
    [Obsolete("Use ArchiveArticle for business workflow. Hard delete is reserved for purge operations.")]
    [SwaggerOperation(OperationId = "DeleteArticle", Summary = "Delete article (deprecated)",
        Description = "Hard delete endpoint. Deprecated, use ArchiveArticle")]
    public async Task<ActionResult<BaseResponse<DeleteArticleResponse>>> DeleteArticle(
        [FromQuery] DeleteArticleRequest request,
        CancellationToken cancellationToken)
    {
        await _accessCheckService.CheckPermission(
            HttpContext,
            PermissionCodes.ArticlesPurge,
            cancellationToken);

        var deletedArticleId = await _articlesService.DeleteArticleAsync(request.ArticleId, cancellationToken);

        var response = new BaseResponse<DeleteArticleResponse>(
            new DeleteArticleResponse(deletedArticleId),
            null);

        return Ok(response);
    }

    private static ArticleSortMode ParseSortMode(string? sort)
    {
        if (string.IsNullOrWhiteSpace(sort))
            return ArticleSortMode.Newest;

        return sort.Trim().ToLowerInvariant() switch
        {
            "newest" => ArticleSortMode.Newest,
            "oldest" => ArticleSortMode.Oldest,
            "likes" => ArticleSortMode.Likes,
            _ => throw new ConversionException("Incorrect data format: sort must be one of [newest, oldest, likes]")
        };
    }

    private static List<Paragraph> MapParagraphInputs(Guid articleId, List<ArticleParagraphInput> paragraphInputs)
    {
        if (paragraphInputs.Count == 0)
            throw new ConversionException("Incorrect data format: The article must contain paragraphs");

        var paragraphs = new List<Paragraph>();

        for (var index = 0; index < paragraphInputs.Count; index++)
        {
            var paragraphInput = paragraphInputs[index];
            var (paragraph, paragraphError) = Paragraph.Create(
                Guid.NewGuid(),
                articleId,
                paragraphInput.Text,
                index,
                paragraphInput.IsSubtitle);

            if (!string.IsNullOrEmpty(paragraphError))
                throw new ConversionException($"Incorrect data format: {paragraphError}");

            paragraphs.Add(paragraph);
        }

        return paragraphs;
    }

    private async Task<List<ArticleDto>> MapArticlesToDtoAsync(List<Article> articles, CancellationToken cancellationToken)
    {
        if (articles.Count == 0)
            return new List<ArticleDto>();

        var likesCountsByArticleId = await _articleLikesService.GetLikesCountsByArticleIdsAsync(
            articles.Select(x => x.Id).ToList(),
            cancellationToken);

        return articles
            .Select(article => MapArticleToDto(
                article,
                likesCountsByArticleId.GetValueOrDefault(article.Id)))
            .ToList();
    }

    private async Task<ArticleDto> MapArticleToDtoAsync(Article article, CancellationToken cancellationToken)
    {
        var likesCount = await _articleLikesService.GetLikesCountAsync(article.Id, cancellationToken);
        return MapArticleToDto(article, likesCount);
    }

    private static ArticleDto MapArticleToDto(Article article, int likesCount)
    {
        return new ArticleDto(
            article.Id,
            article.Title,
            article.PublishDate,
            article.AuthorString,
            article.HeaderPhotoLink,
            article.ExtraPhotoLinks,
            article.Status.ToString(),
            article.CreatedByUserId,
            article.UpdatedByUserId,
            article.CreatedAt,
            article.UpdatedAt,
            article.SubmittedAt,
            article.PublishedAt,
            article.ReviewedAt,
            article.ReviewedByUserId,
            article.ReviewNote,
            article.ArchivedAt,
            likesCount,
            article.Paragraphs
                .OrderBy(paragraph => paragraph.SerialNumber)
                .Select(paragraph => new ParagraphDto(
                    paragraph.Id,
                    paragraph.ArticleId,
                    paragraph.ParagraphText,
                    paragraph.SerialNumber,
                    paragraph.IsSubtitle))
                .ToList());
    }

    private static EditorArticleDto MapEditorArticleToDto(Article article, List<Guid> linkedMushroomIds, int likesCount)
    {
        return new EditorArticleDto(
            article.Id,
            article.Title,
            article.PublishDate,
            article.AuthorString,
            article.HeaderPhotoLink,
            article.ExtraPhotoLinks,
            article.Status.ToString(),
            article.CreatedByUserId,
            article.UpdatedByUserId,
            article.CreatedAt,
            article.UpdatedAt,
            article.SubmittedAt,
            article.PublishedAt,
            article.ReviewedAt,
            article.ReviewedByUserId,
            article.ReviewNote,
            article.ArchivedAt,
            likesCount,
            linkedMushroomIds,
            article.Paragraphs
                .OrderBy(paragraph => paragraph.SerialNumber)
                .Select(paragraph => new ParagraphDto(
                    paragraph.Id,
                    paragraph.ArticleId,
                    paragraph.ParagraphText,
                    paragraph.SerialNumber,
                    paragraph.IsSubtitle))
                .ToList());
    }

    private static bool HasPermission(User user, string permissionCode)
    {
        return user.Role.PermissionCodes.Contains(permissionCode, StringComparer.OrdinalIgnoreCase);
    }
}
