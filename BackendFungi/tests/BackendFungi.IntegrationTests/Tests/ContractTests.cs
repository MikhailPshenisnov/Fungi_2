using System.Net;
using System.Net.Http.Json;
using System.Text;
using BackendFungi.IntegrationTests.Infrastructure;
using Xunit;

namespace BackendFungi.IntegrationTests.Tests;

[Collection(IntegrationTestCollection.Name)]
public sealed class ContractTests
{
    private readonly BackendFungiApiFactory _factory;

    public ContractTests(BackendFungiApiFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task ModerateArticle_accepts_string_decision()
    {
        using var editorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Editor);
        using var moderatorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Moderator);

        var articleId = await CreateInReviewArticleAsync(editorClient);

        var response = await moderatorClient.PostAsync(
            "/Articles/ModerateArticle",
            new StringContent($"{{\"articleId\":\"{articleId}\",\"decision\":\"Approve\",\"reviewNote\":\"string enum path\"}}", Encoding.UTF8, "application/json"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("Published", ApiJson.RequiredString(await ApiJson.ParseAsync(response), "data", "status"));
    }

    [Fact]
    public async Task ModerateArticle_rejects_numeric_decision_with_400()
    {
        using var editorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Editor);
        using var moderatorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Moderator);

        var articleId = await CreateInReviewArticleAsync(editorClient);

        var response = await moderatorClient.PostAsync(
            "/Articles/ModerateArticle",
            new StringContent($"{{\"articleId\":\"{articleId}\",\"decision\":1,\"reviewNote\":\"numeric enum path\"}}", Encoding.UTF8, "application/json"));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var payload = await response.Content.ReadAsStringAsync();
        Assert.Contains("\"errorCode\":\"invalid_request\"", payload, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task ModerateArticle_rejects_missing_decision_with_400()
    {
        using var editorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Editor);
        using var moderatorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Moderator);

        var articleId = await CreateInReviewArticleAsync(editorClient);

        var response = await moderatorClient.PostAsync(
            "/Articles/ModerateArticle",
            new StringContent($"{{\"articleId\":\"{articleId}\",\"reviewNote\":\"missing decision\"}}", Encoding.UTF8, "application/json"));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var payload = await response.Content.ReadAsStringAsync();
        Assert.Contains("\"errorCode\":\"invalid_request\"", payload, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task BadRequest_payload_contains_errorCode()
    {
        using var editorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Editor);
        using var moderatorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Moderator);

        var articleId = await CreateInReviewArticleAsync(editorClient);

        var response = await moderatorClient.PostAsync(
            "/Articles/ModerateArticle",
            new StringContent($"{{\"articleId\":\"{articleId}\",\"decision\":1,\"reviewNote\":\"missing error code check\"}}", Encoding.UTF8, "application/json"));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var payload = await response.Content.ReadAsStringAsync();
        Assert.Contains("\"errorCode\"", payload, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task ModerateMushroom_rejects_numeric_decision_with_400()
    {
        using var editorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Editor);
        using var moderatorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Moderator);

        var revisionId = await CreateInReviewMushroomAsync(editorClient);

        var response = await moderatorClient.PostAsync(
            "/Mushrooms/ModerateMushroom",
            new StringContent($"{{\"revisionId\":\"{revisionId}\",\"decision\":1,\"reviewNote\":\"numeric enum path\"}}", Encoding.UTF8, "application/json"));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var payload = await response.Content.ReadAsStringAsync();
        Assert.Contains("\"errorCode\":\"invalid_request\"", payload, StringComparison.OrdinalIgnoreCase);
    }

    private static async Task<Guid> CreateInReviewArticleAsync(HttpClient editorClient)
    {
        var createResponse = await editorClient.PostAsJsonAsync("/Articles/CreateDraft", new
        {
            Title = $"Contract Article {Guid.NewGuid():N}"[..25],
            PublishDate = DateTime.UtcNow.AddMinutes(-5),
            AuthorString = "Contract test author",
            HeaderPhotoLink = "https://example.com/contract-header.jpg",
            ExtraPhotoLinks = Array.Empty<string>(),
            Paragraphs = new object[]
            {
                new { Text = "Contract paragraph.", IsSubtitle = false }
            },
            LinkedMushroomIds = Array.Empty<Guid>()
        });
        createResponse.EnsureSuccessStatusCode();

        var articleId = ApiJson.RequiredGuid(await ApiJson.ParseAsync(createResponse), "data", "createdArticleId");

        var submitResponse = await editorClient.PostAsJsonAsync("/Articles/SubmitForReview", new
        {
            ArticleId = articleId
        });
        submitResponse.EnsureSuccessStatusCode();

        return articleId;
    }

    private static async Task<Guid> CreateInReviewMushroomAsync(HttpClient editorClient)
    {
        var createResponse = await editorClient.PostAsJsonAsync("/Mushrooms/CreateDraft", new
        {
            SourceMushroomId = (Guid?)null,
            Name = $"Contract Mushroom {Guid.NewGuid():N}"[..24],
            SynonymousName = (string?)null,
            LatinName = $"Agaricus {Guid.NewGuid():N}"[..20],
            Family = "Agaricaceae",
            RedBook = false,
            Eatable = "Съедобный",
            HasStem = true,
            StemSizeFrom = 4,
            StemSizeTo = 9,
            StemType = "solid",
            StemColor = "white",
            CapType = "convex",
            CapColor = "brown",
            CapUndersideType = "gills",
            Description = "Contract mushroom paragraph.",
            HeaderPhotoLink = "https://example.com/contract-mushroom.jpg",
            ExtraPhotoLinks = Array.Empty<string>(),
            Doppelgangers = Array.Empty<string>()
        });
        createResponse.EnsureSuccessStatusCode();

        var revisionId = ApiJson.RequiredGuid(await ApiJson.ParseAsync(createResponse), "data", "createdRevisionId");

        var submitResponse = await editorClient.PostAsJsonAsync("/Mushrooms/SubmitForReview", new
        {
            RevisionId = revisionId
        });
        submitResponse.EnsureSuccessStatusCode();

        return revisionId;
    }
}
