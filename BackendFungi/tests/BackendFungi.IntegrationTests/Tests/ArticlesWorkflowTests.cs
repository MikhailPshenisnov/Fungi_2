using System.Net;
using System.Net.Http.Json;
using System.Text.Json.Nodes;
using BackendFungi.IntegrationTests.Infrastructure;
using Xunit;

namespace BackendFungi.IntegrationTests.Tests;

[Collection(IntegrationTestCollection.Name)]
public sealed class ArticlesWorkflowTests
{
    private readonly BackendFungiApiFactory _factory;

    public ArticlesWorkflowTests(BackendFungiApiFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Article_workflow_supports_approve_archive_and_rbac()
    {
        using var editorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Editor);
        using var moderatorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Moderator);
        using var outsiderClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Outsider);

        var createResponse = await editorClient.PostAsJsonAsync("/Articles/CreateDraft", BuildArticleDraftPayload());
        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);

        var createdJson = await ApiJson.ParseAsync(createResponse);
        var articleId = ApiJson.RequiredGuid(createdJson, "data", "createdArticleId");
        Assert.Equal("Draft", ApiJson.RequiredString(createdJson, "data", "status"));

        var outsiderReadResponse = await outsiderClient.GetAsync($"/Articles/GetEditorArticle?articleId={articleId}");
        Assert.Equal(HttpStatusCode.Forbidden, outsiderReadResponse.StatusCode);

        var submitResponse = await editorClient.PostAsJsonAsync("/Articles/SubmitForReview", new
        {
            ArticleId = articleId
        });
        Assert.Equal(HttpStatusCode.OK, submitResponse.StatusCode);
        Assert.Equal("InReview", ApiJson.RequiredString(await ApiJson.ParseAsync(submitResponse), "data", "status"));

        var editorModerationResponse = await editorClient.PostAsJsonAsync("/Articles/ModerateArticle", new
        {
            ArticleId = articleId,
            Decision = "Approve",
            ReviewNote = "owner cannot moderate"
        });
        Assert.Equal(HttpStatusCode.Forbidden, editorModerationResponse.StatusCode);

        var approveResponse = await moderatorClient.PostAsJsonAsync("/Articles/ModerateArticle", new
        {
            ArticleId = articleId,
            Decision = "Approve",
            ReviewNote = "looks good"
        });
        Assert.Equal(HttpStatusCode.OK, approveResponse.StatusCode);
        Assert.Equal("Published", ApiJson.RequiredString(await ApiJson.ParseAsync(approveResponse), "data", "status"));

        var archiveResponse = await editorClient.PostAsJsonAsync("/Articles/ArchiveArticle", new
        {
            ArticleId = articleId
        });
        Assert.Equal(HttpStatusCode.OK, archiveResponse.StatusCode);
        Assert.Equal("Archived", ApiJson.RequiredString(await ApiJson.ParseAsync(archiveResponse), "data", "status"));
    }

    [Fact]
    public async Task Article_workflow_supports_reject_transition()
    {
        using var editorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Editor);
        using var moderatorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Moderator);

        var createResponse = await editorClient.PostAsJsonAsync("/Articles/CreateDraft", BuildArticleDraftPayload());
        var articleId = ApiJson.RequiredGuid(await ApiJson.ParseAsync(createResponse), "data", "createdArticleId");

        var submitResponse = await editorClient.PostAsJsonAsync("/Articles/SubmitForReview", new
        {
            ArticleId = articleId
        });
        Assert.Equal(HttpStatusCode.OK, submitResponse.StatusCode);

        var rejectResponse = await moderatorClient.PostAsJsonAsync("/Articles/ModerateArticle", new
        {
            ArticleId = articleId,
            Decision = "Reject",
            ReviewNote = "needs revision"
        });
        Assert.Equal(HttpStatusCode.OK, rejectResponse.StatusCode);
        Assert.Equal("Rejected", ApiJson.RequiredString(await ApiJson.ParseAsync(rejectResponse), "data", "status"));
    }

    [Fact]
    public async Task GetFilteredArticles_returns_likesCount_for_published_articles()
    {
        using var editorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Editor);
        using var moderatorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Moderator);

        var marker = $"BulkLikes-{Guid.NewGuid():N}"[..17];
        var createResponse = await editorClient.PostAsJsonAsync("/Articles/CreateDraft", BuildArticleDraftPayload(marker));
        createResponse.EnsureSuccessStatusCode();
        var articleId = ApiJson.RequiredGuid(await ApiJson.ParseAsync(createResponse), "data", "createdArticleId");

        var submitResponse = await editorClient.PostAsJsonAsync("/Articles/SubmitForReview", new { ArticleId = articleId });
        submitResponse.EnsureSuccessStatusCode();

        var approveResponse = await moderatorClient.PostAsJsonAsync("/Articles/ModerateArticle", new
        {
            ArticleId = articleId,
            Decision = "Approve",
            ReviewNote = "publish for list likes test"
        });
        approveResponse.EnsureSuccessStatusCode();

        var likeByEditor = await editorClient.PostAsync($"/ArticleLikes/ToggleLike?articleId={articleId}", null);
        likeByEditor.EnsureSuccessStatusCode();
        var likeByModerator = await moderatorClient.PostAsync($"/ArticleLikes/ToggleLike?articleId={articleId}", null);
        likeByModerator.EnsureSuccessStatusCode();

        using var publicClient = _factory.CreateClient();
        var listResponse = await publicClient.GetAsync($"/Articles/GetFilteredArticles?PartOfTitle={Uri.EscapeDataString(marker)}");
        listResponse.EnsureSuccessStatusCode();

        var listJson = await ApiJson.ParseAsync(listResponse);
        var articles = listJson["data"]?["articles"]?.AsArray()
            ?? throw new InvalidOperationException("Expected data.articles array.");

        var targetArticle = articles.FirstOrDefault(node =>
            node?["id"]?.GetValue<string>()?.Equals(articleId.ToString(), StringComparison.OrdinalIgnoreCase) == true)
            ?? throw new InvalidOperationException("Expected created article in filtered response.");

        var likesCount = targetArticle["likesCount"]?.GetValue<int>()
            ?? throw new InvalidOperationException("Expected likesCount field in article dto.");

        Assert.Equal(2, likesCount);
        Assert.Equal("Published", targetArticle["status"]?.GetValue<string>());
    }

    private static object BuildArticleDraftPayload(string? titlePrefix = null)
    {
        var suffix = Guid.NewGuid().ToString("N")[..8];
        var safePrefix = string.IsNullOrWhiteSpace(titlePrefix) ? "Integration Article" : titlePrefix;

        return new
        {
            Title = $"{safePrefix} {suffix}",
            PublishDate = DateTime.UtcNow.AddMinutes(-5),
            AuthorString = "Integration test author",
            HeaderPhotoLink = "https://example.com/article-header.jpg",
            ExtraPhotoLinks = new[]
            {
                "https://example.com/article-extra.jpg"
            },
            Paragraphs = new object[]
            {
                new { Text = "Lead paragraph for integration test.", IsSubtitle = false },
                new { Text = "Details paragraph.", IsSubtitle = false }
            },
            LinkedMushroomIds = Array.Empty<Guid>()
        };
    }
}
