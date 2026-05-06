using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Nodes;
using BackendFungi.Contracts.Other;
using BackendFungi.IntegrationTests.Infrastructure;
using Xunit;

namespace BackendFungi.IntegrationTests.Tests;

[Collection(IntegrationTestCollection.Name)]
public sealed class FavoritesApiTests
{
    private readonly BackendFungiApiFactory _factory;

    public FavoritesApiTests(BackendFungiApiFactory factory)
    {
        _factory = factory;
    }

    [Theory]
    [InlineData("/ArticleLikes/GetMyFavoriteArticles")]
    [InlineData("/MushroomLikes/GetMyFavoriteMushrooms")]
    public async Task Favorites_endpoints_require_authentication(string path)
    {
        using var anonymousClient = _factory.CreateClient(new() { AllowAutoRedirect = false });

        var response = await anonymousClient.GetAsync(path);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Favorites_endpoints_return_empty_list_for_new_user()
    {
        using var client = await CreateRegisteredUserClientAsync("empty");

        var articlesResponse = await client.GetAsync("/ArticleLikes/GetMyFavoriteArticles");
        var mushroomsResponse = await client.GetAsync("/MushroomLikes/GetMyFavoriteMushrooms");

        Assert.Equal(HttpStatusCode.OK, articlesResponse.StatusCode);
        Assert.Equal(HttpStatusCode.OK, mushroomsResponse.StatusCode);

        var articlesJson = await ApiJson.ParseAsync(articlesResponse);
        var mushroomsJson = await ApiJson.ParseAsync(mushroomsResponse);

        Assert.Equal(0, RequiredInt(articlesJson, "data", "totalCount"));
        Assert.Equal(1, RequiredInt(articlesJson, "data", "page"));
        Assert.Equal(12, RequiredInt(articlesJson, "data", "pageSize"));
        Assert.Empty(RequiredArray(articlesJson, "data", "items"));

        Assert.Equal(0, RequiredInt(mushroomsJson, "data", "totalCount"));
        Assert.Equal(1, RequiredInt(mushroomsJson, "data", "page"));
        Assert.Equal(12, RequiredInt(mushroomsJson, "data", "pageSize"));
        Assert.Empty(RequiredArray(mushroomsJson, "data", "items"));
    }

    [Theory]
    [InlineData("/ArticleLikes/GetMyFavoriteArticles?Page=0")]
    [InlineData("/ArticleLikes/GetMyFavoriteArticles?PageSize=101")]
    [InlineData("/MushroomLikes/GetMyFavoriteMushrooms?Page=0")]
    [InlineData("/MushroomLikes/GetMyFavoriteMushrooms?PageSize=101")]
    public async Task Favorites_endpoints_validate_pagination_query(string path)
    {
        using var client = await CreateRegisteredUserClientAsync("validation");

        var response = await client.GetAsync(path);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var payload = await response.Content.ReadAsStringAsync();
        Assert.Contains("\"errorCode\":\"invalid_request\"", payload, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task GetMyFavoriteArticles_returns_like_date_desc_and_pagination()
    {
        using var editorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Editor);
        using var moderatorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Moderator);
        using var favoriteClient = await CreateRegisteredUserClientAsync("article-order");

        var articleId1 = await CreatePublishedArticleAsync(editorClient, moderatorClient, "FavA-1");
        var articleId2 = await CreatePublishedArticleAsync(editorClient, moderatorClient, "FavA-2");
        var articleId3 = await CreatePublishedArticleAsync(editorClient, moderatorClient, "FavA-3");

        (await favoriteClient.PostAsync($"/ArticleLikes/ToggleLike?articleId={articleId1}", null)).EnsureSuccessStatusCode();
        await Task.Delay(30);
        (await favoriteClient.PostAsync($"/ArticleLikes/ToggleLike?articleId={articleId2}", null)).EnsureSuccessStatusCode();
        await Task.Delay(30);
        (await favoriteClient.PostAsync($"/ArticleLikes/ToggleLike?articleId={articleId3}", null)).EnsureSuccessStatusCode();

        var page1Response = await favoriteClient.GetAsync("/ArticleLikes/GetMyFavoriteArticles?Page=1&PageSize=2");
        var page2Response = await favoriteClient.GetAsync("/ArticleLikes/GetMyFavoriteArticles?Page=2&PageSize=2");

        page1Response.EnsureSuccessStatusCode();
        page2Response.EnsureSuccessStatusCode();

        var page1Json = await ApiJson.ParseAsync(page1Response);
        var page2Json = await ApiJson.ParseAsync(page2Response);

        Assert.Equal(3, RequiredInt(page1Json, "data", "totalCount"));
        Assert.Equal(1, RequiredInt(page1Json, "data", "page"));
        Assert.Equal(2, RequiredInt(page1Json, "data", "pageSize"));

        var page1Items = RequiredArray(page1Json, "data", "items");
        var page2Items = RequiredArray(page2Json, "data", "items");

        Assert.Equal(2, page1Items.Count);
        Assert.Single(page2Items);

        Assert.Equal(articleId3.ToString(), page1Items[0]?["articleId"]?.GetValue<string>());
        Assert.Equal(articleId2.ToString(), page1Items[1]?["articleId"]?.GetValue<string>());
        Assert.Equal(articleId1.ToString(), page2Items[0]?["articleId"]?.GetValue<string>());
    }

    [Fact]
    public async Task GetMyFavoriteMushrooms_returns_like_date_desc()
    {
        using var editorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Editor);
        using var moderatorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Moderator);
        using var favoriteClient = await CreateRegisteredUserClientAsync("mushroom-order");

        var (_, mushroomId1) = await CreatePublishedMushroomAsync(editorClient, moderatorClient, "FavM-1");
        var (_, mushroomId2) = await CreatePublishedMushroomAsync(editorClient, moderatorClient, "FavM-2");

        (await favoriteClient.PostAsync($"/MushroomLikes/ToggleLike?mushroomId={mushroomId1}", null)).EnsureSuccessStatusCode();
        await Task.Delay(30);
        (await favoriteClient.PostAsync($"/MushroomLikes/ToggleLike?mushroomId={mushroomId2}", null)).EnsureSuccessStatusCode();

        var response = await favoriteClient.GetAsync("/MushroomLikes/GetMyFavoriteMushrooms?Page=1&PageSize=10");
        response.EnsureSuccessStatusCode();

        var json = await ApiJson.ParseAsync(response);
        var items = RequiredArray(json, "data", "items");

        Assert.Equal(2, RequiredInt(json, "data", "totalCount"));
        Assert.Equal(2, items.Count);
        Assert.Equal(mushroomId2.ToString(), items[0]?["mushroomId"]?.GetValue<string>());
        Assert.Equal(mushroomId1.ToString(), items[1]?["mushroomId"]?.GetValue<string>());
    }

    [Fact]
    public async Task Favorites_filter_out_non_public_articles()
    {
        using var editorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Editor);
        using var moderatorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Moderator);
        using var favoriteClient = await CreateRegisteredUserClientAsync("article-filter");

        var publishedArticleId = await CreatePublishedArticleAsync(editorClient, moderatorClient, "FavVisible");
        var draftArticleId = await CreateDraftArticleAsync(editorClient, "FavDraftOnly", DateTime.UtcNow.AddHours(2));

        (await favoriteClient.PostAsync($"/ArticleLikes/ToggleLike?articleId={publishedArticleId}", null)).EnsureSuccessStatusCode();
        (await favoriteClient.PostAsync($"/ArticleLikes/ToggleLike?articleId={draftArticleId}", null)).EnsureSuccessStatusCode();

        var response = await favoriteClient.GetAsync("/ArticleLikes/GetMyFavoriteArticles?Page=1&PageSize=20");
        response.EnsureSuccessStatusCode();

        var json = await ApiJson.ParseAsync(response);
        var items = RequiredArray(json, "data", "items");
        var articleIds = items
            .Select(item => item?["articleId"]?.GetValue<string>())
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        Assert.Equal(1, RequiredInt(json, "data", "totalCount"));
        Assert.Contains(publishedArticleId.ToString(), articleIds);
        Assert.DoesNotContain(draftArticleId.ToString(), articleIds);
    }

    [Fact]
    public async Task Favorites_filter_out_archived_mushrooms()
    {
        using var editorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Editor);
        using var moderatorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Moderator);
        using var favoriteClient = await CreateRegisteredUserClientAsync("mushroom-filter");

        var (revisionId, mushroomId) = await CreatePublishedMushroomAsync(editorClient, moderatorClient, "FavArchived");

        (await favoriteClient.PostAsync($"/MushroomLikes/ToggleLike?mushroomId={mushroomId}", null)).EnsureSuccessStatusCode();

        var beforeArchiveResponse = await favoriteClient.GetAsync("/MushroomLikes/GetMyFavoriteMushrooms");
        beforeArchiveResponse.EnsureSuccessStatusCode();
        Assert.Equal(1, RequiredInt(await ApiJson.ParseAsync(beforeArchiveResponse), "data", "totalCount"));

        var archiveResponse = await editorClient.PostAsJsonAsync("/Mushrooms/ArchiveMushroom", new
        {
            RevisionId = revisionId
        });
        archiveResponse.EnsureSuccessStatusCode();

        var afterArchiveResponse = await favoriteClient.GetAsync("/MushroomLikes/GetMyFavoriteMushrooms");
        afterArchiveResponse.EnsureSuccessStatusCode();
        Assert.Equal(0, RequiredInt(await ApiJson.ParseAsync(afterArchiveResponse), "data", "totalCount"));
    }

    [Fact]
    public async Task Favorites_articles_follow_like_unlike_consistency()
    {
        using var editorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Editor);
        using var moderatorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Moderator);
        using var favoriteClient = await CreateRegisteredUserClientAsync("article-consistency");

        var articleId = await CreatePublishedArticleAsync(editorClient, moderatorClient, "FavConsistency");

        var likeResponse = await favoriteClient.PostAsync($"/ArticleLikes/ToggleLike?articleId={articleId}", null);
        likeResponse.EnsureSuccessStatusCode();

        var afterLike = await favoriteClient.GetAsync("/ArticleLikes/GetMyFavoriteArticles");
        afterLike.EnsureSuccessStatusCode();

        var afterLikeJson = await ApiJson.ParseAsync(afterLike);
        var likedIds = RequiredArray(afterLikeJson, "data", "items")
            .Select(item => item?["articleId"]?.GetValue<string>())
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        Assert.Contains(articleId.ToString(), likedIds);

        var unlikeResponse = await favoriteClient.PostAsync($"/ArticleLikes/ToggleLike?articleId={articleId}", null);
        unlikeResponse.EnsureSuccessStatusCode();

        var afterUnlike = await favoriteClient.GetAsync("/ArticleLikes/GetMyFavoriteArticles");
        afterUnlike.EnsureSuccessStatusCode();

        var afterUnlikeJson = await ApiJson.ParseAsync(afterUnlike);
        var remainingIds = RequiredArray(afterUnlikeJson, "data", "items")
            .Select(item => item?["articleId"]?.GetValue<string>())
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        Assert.DoesNotContain(articleId.ToString(), remainingIds);
        Assert.Equal(0, RequiredInt(afterUnlikeJson, "data", "totalCount"));
    }

    private async Task<HttpClient> CreateRegisteredUserClientAsync(string marker)
    {
        var client = _factory.CreateClient(new() { AllowAutoRedirect = false });
        var suffix = Guid.NewGuid().ToString("N");
        var shortSuffix = suffix[..8];

        var registerResponse = await client.PostAsJsonAsync("/Authorization/RegisterUser", new
        {
            Name = $"fav_{marker}_{shortSuffix}",
            Email = $"fav_{marker}_{shortSuffix}@fungi.test",
            Password = "Aa1!aaaa",
            IsUserAgreementAccepted = true,
            IsPersonalDataProcessingConsentAccepted = true,
            UserAgreementVersion = LegalConsentConstants.UserAgreementVersion,
            PersonalDataProcessingConsentVersion = LegalConsentConstants.PersonalDataProcessingConsentVersion
        });
        registerResponse.EnsureSuccessStatusCode();

        var registerJson = await ApiJson.ParseAsync(registerResponse);
        var token = ApiJson.RequiredString(registerJson, "data", "token");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        return client;
    }

    private static async Task<Guid> CreateDraftArticleAsync(HttpClient editorClient, string titlePrefix, DateTime publishDate)
    {
        var createResponse = await editorClient.PostAsJsonAsync("/Articles/CreateDraft", BuildArticleDraftPayload(titlePrefix, publishDate));
        createResponse.EnsureSuccessStatusCode();

        var createJson = await ApiJson.ParseAsync(createResponse);
        return ApiJson.RequiredGuid(createJson, "data", "createdArticleId");
    }

    private static async Task<Guid> CreatePublishedArticleAsync(HttpClient editorClient, HttpClient moderatorClient, string titlePrefix)
    {
        var articleId = await CreateDraftArticleAsync(editorClient, titlePrefix, DateTime.UtcNow.AddMinutes(-5));

        var submitResponse = await editorClient.PostAsJsonAsync("/Articles/SubmitForReview", new
        {
            ArticleId = articleId
        });
        submitResponse.EnsureSuccessStatusCode();

        var approveResponse = await moderatorClient.PostAsJsonAsync("/Articles/ModerateArticle", new
        {
            ArticleId = articleId,
            Decision = "Approve",
            ReviewNote = "favorites test approval"
        });
        approveResponse.EnsureSuccessStatusCode();

        return articleId;
    }

    private static async Task<(Guid RevisionId, Guid MushroomId)> CreatePublishedMushroomAsync(
        HttpClient editorClient,
        HttpClient moderatorClient,
        string namePrefix)
    {
        var suffix = Guid.NewGuid().ToString("N")[..8];

        var createResponse = await editorClient.PostAsJsonAsync("/Mushrooms/CreateDraft", new
        {
            SourceMushroomId = (Guid?)null,
            Name = $"{namePrefix}-{suffix}",
            SynonymousName = (string?)null,
            LatinName = $"Agaricus {suffix}",
            Family = "Agaricaceae",
            RedBook = false,
            Eatable = "Съедобный",
            HasStem = true,
            StemSizeFrom = 3,
            StemSizeTo = 8,
            StemType = "solid",
            StemColor = "white",
            CapType = "convex",
            CapColor = "brown",
            CapUndersideType = "gills",
            Description = "Favorites integration test mushroom.",
            HeaderPhotoLink = "https://example.com/favorites-mushroom.jpg",
            ExtraPhotoLinks = Array.Empty<string>(),
            Doppelgangers = Array.Empty<string>()
        });
        createResponse.EnsureSuccessStatusCode();

        var createJson = await ApiJson.ParseAsync(createResponse);
        var revisionId = ApiJson.RequiredGuid(createJson, "data", "createdRevisionId");

        var submitResponse = await editorClient.PostAsJsonAsync("/Mushrooms/SubmitForReview", new
        {
            RevisionId = revisionId
        });
        submitResponse.EnsureSuccessStatusCode();

        var approveResponse = await moderatorClient.PostAsJsonAsync("/Mushrooms/ModerateMushroom", new
        {
            RevisionId = revisionId,
            Decision = "Approve",
            ReviewNote = "favorites test approval"
        });
        approveResponse.EnsureSuccessStatusCode();

        var approveJson = await ApiJson.ParseAsync(approveResponse);
        var mushroomId = ApiJson.RequiredGuid(approveJson, "data", "publishedMushroomId");

        return (revisionId, mushroomId);
    }

    private static object BuildArticleDraftPayload(string titlePrefix, DateTime publishDate)
    {
        var suffix = Guid.NewGuid().ToString("N")[..8];

        return new
        {
            Title = $"{titlePrefix}-{suffix}",
            PublishDate = publishDate,
            AuthorString = "Favorites integration author",
            HeaderPhotoLink = "https://example.com/favorites-article.jpg",
            ExtraPhotoLinks = Array.Empty<string>(),
            Paragraphs = new object[]
            {
                new { Text = "Favorites integration paragraph.", IsSubtitle = false }
            },
            LinkedMushroomIds = Array.Empty<Guid>()
        };
    }

    private static int RequiredInt(JsonNode node, params string[] path)
    {
        JsonNode? current = node;
        foreach (var segment in path)
        {
            current = current?[segment];
            if (current is null)
                throw new InvalidOperationException($"Expected integer at '{string.Join('.', path)}'.");
        }

        return current.GetValue<int>();
    }

    private static JsonArray RequiredArray(JsonNode node, params string[] path)
    {
        JsonNode? current = node;
        foreach (var segment in path)
        {
            current = current?[segment];
            if (current is null)
                throw new InvalidOperationException($"Expected array at '{string.Join('.', path)}'.");
        }

        return current.AsArray();
    }
}
