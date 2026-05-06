using System.Net;
using System.Net.Http.Json;
using System.Text;
using BackendFungi.Contracts.Other;
using BackendFungi.Database.Context;
using BackendFungi.IntegrationTests.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
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
    public async Task RegisterUser_without_legal_consent_fields_returns_400()
    {
        using var client = _factory.CreateClient(new() { AllowAutoRedirect = false });
        var suffix = Guid.NewGuid().ToString("N")[..8];

        var response = await client.PostAsJsonAsync("/Authorization/RegisterUser", new
        {
            Name = $"consent_missing_{suffix}",
            Email = $"consent_missing_{suffix}@fungi.test",
            Password = "Aa1!aaaa"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var payload = await response.Content.ReadAsStringAsync();
        Assert.Contains("\"errorCode\":\"invalid_request\"", payload, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task RegisterUser_with_false_legal_consent_returns_400()
    {
        using var client = _factory.CreateClient(new() { AllowAutoRedirect = false });
        var suffix = Guid.NewGuid().ToString("N")[..8];

        var response = await client.PostAsJsonAsync("/Authorization/RegisterUser", new
        {
            Name = $"consent_false_{suffix}",
            Email = $"consent_false_{suffix}@fungi.test",
            Password = "Aa1!aaaa",
            IsUserAgreementAccepted = false,
            IsPersonalDataProcessingConsentAccepted = true,
            UserAgreementVersion = LegalConsentConstants.UserAgreementVersion,
            PersonalDataProcessingConsentVersion = LegalConsentConstants.PersonalDataProcessingConsentVersion
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var payload = await response.Content.ReadAsStringAsync();
        Assert.Contains("\"errorCode\":\"invalid_request\"", payload, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task RegisterUser_with_wrong_document_version_returns_400()
    {
        using var client = _factory.CreateClient(new() { AllowAutoRedirect = false });
        var suffix = Guid.NewGuid().ToString("N")[..8];

        var response = await client.PostAsJsonAsync("/Authorization/RegisterUser", new
        {
            Name = $"consent_version_{suffix}",
            Email = $"consent_version_{suffix}@fungi.test",
            Password = "Aa1!aaaa",
            IsUserAgreementAccepted = true,
            IsPersonalDataProcessingConsentAccepted = true,
            UserAgreementVersion = "2026-04-20-v1",
            PersonalDataProcessingConsentVersion = LegalConsentConstants.PersonalDataProcessingConsentVersion
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var payload = await response.Content.ReadAsStringAsync();
        Assert.Contains("\"errorCode\":\"invalid_request\"", payload, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task RegisterUser_creates_two_user_consents()
    {
        using var client = _factory.CreateClient(new() { AllowAutoRedirect = false });
        var suffix = Guid.NewGuid().ToString("N")[..8];
        var email = $"consent_success_{suffix}@fungi.test";

        var response = await client.PostAsJsonAsync("/Authorization/RegisterUser", new
        {
            Name = $"consent_success_{suffix}",
            Email = email,
            Password = "Aa1!aaaa",
            IsUserAgreementAccepted = true,
            IsPersonalDataProcessingConsentAccepted = true,
            UserAgreementVersion = LegalConsentConstants.UserAgreementVersion,
            PersonalDataProcessingConsentVersion = LegalConsentConstants.PersonalDataProcessingConsentVersion
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var json = await ApiJson.ParseAsync(response);
        Assert.False(string.IsNullOrWhiteSpace(ApiJson.RequiredString(json, "data", "token")));

        await using var scope = _factory.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<FungiDbContext>();

        var createdUser = await dbContext.Users
            .AsNoTracking()
            .SingleAsync(user => user.Email == email);

        var consents = await dbContext.UserConsents
            .AsNoTracking()
            .Where(consent => consent.UserId == createdUser.Id)
            .ToListAsync();

        Assert.Equal(2, consents.Count);
        Assert.Contains(consents, consent =>
            consent.ConsentType == LegalConsentConstants.UserAgreementConsentType &&
            consent.DocumentVersion == LegalConsentConstants.UserAgreementVersion);
        Assert.Contains(consents, consent =>
            consent.ConsentType == LegalConsentConstants.PersonalDataProcessingConsentType &&
            consent.DocumentVersion == LegalConsentConstants.PersonalDataProcessingConsentVersion);
        Assert.All(consents, consent => Assert.Equal(LegalConsentConstants.SourceWeb, consent.Source));
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
