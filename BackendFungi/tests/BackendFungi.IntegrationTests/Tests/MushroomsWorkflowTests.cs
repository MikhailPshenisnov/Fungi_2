using System.Net;
using System.Net.Http.Json;
using BackendFungi.IntegrationTests.Infrastructure;
using Xunit;

namespace BackendFungi.IntegrationTests.Tests;

[Collection(IntegrationTestCollection.Name)]
public sealed class MushroomsWorkflowTests
{
    private readonly BackendFungiApiFactory _factory;

    public MushroomsWorkflowTests(BackendFungiApiFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Mushroom_workflow_supports_approve_archive_and_rbac()
    {
        using var editorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Editor);
        using var moderatorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Moderator);
        using var outsiderClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Outsider);

        var createResponse = await editorClient.PostAsJsonAsync("/Mushrooms/CreateDraft", BuildMushroomDraftPayload());
        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);

        var createdJson = await ApiJson.ParseAsync(createResponse);
        var revisionId = ApiJson.RequiredGuid(createdJson, "data", "createdRevisionId");
        Assert.Equal("Draft", ApiJson.RequiredString(createdJson, "data", "status"));

        var outsiderReadResponse = await outsiderClient.GetAsync($"/Mushrooms/GetEditorMushroom?revisionId={revisionId}");
        Assert.Equal(HttpStatusCode.Forbidden, outsiderReadResponse.StatusCode);

        var submitResponse = await editorClient.PostAsJsonAsync("/Mushrooms/SubmitForReview", new
        {
            RevisionId = revisionId
        });
        Assert.Equal(HttpStatusCode.OK, submitResponse.StatusCode);
        Assert.Equal("InReview", ApiJson.RequiredString(await ApiJson.ParseAsync(submitResponse), "data", "status"));

        var editorApproveResponse = await editorClient.PostAsJsonAsync("/Mushrooms/ModerateMushroom", new
        {
            RevisionId = revisionId,
            Decision = "Approve",
            ReviewNote = "owner cannot publish"
        });
        Assert.Equal(HttpStatusCode.Forbidden, editorApproveResponse.StatusCode);

        var approveResponse = await moderatorClient.PostAsJsonAsync("/Mushrooms/ModerateMushroom", new
        {
            RevisionId = revisionId,
            Decision = "Approve",
            ReviewNote = "approved"
        });
        Assert.Equal(HttpStatusCode.OK, approveResponse.StatusCode);

        var approvedJson = await ApiJson.ParseAsync(approveResponse);
        Assert.Equal("Published", ApiJson.RequiredString(approvedJson, "data", "status"));
        Assert.NotEqual(Guid.Empty, ApiJson.RequiredGuid(approvedJson, "data", "publishedMushroomId"));

        var archiveResponse = await editorClient.PostAsJsonAsync("/Mushrooms/ArchiveMushroom", new
        {
            RevisionId = revisionId
        });
        Assert.Equal(HttpStatusCode.OK, archiveResponse.StatusCode);
        Assert.Equal("Archived", ApiJson.RequiredString(await ApiJson.ParseAsync(archiveResponse), "data", "status"));
    }

    [Fact]
    public async Task Mushroom_workflow_supports_reject_transition()
    {
        using var editorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Editor);
        using var moderatorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Moderator);

        var createResponse = await editorClient.PostAsJsonAsync("/Mushrooms/CreateDraft", BuildMushroomDraftPayload());
        var revisionId = ApiJson.RequiredGuid(await ApiJson.ParseAsync(createResponse), "data", "createdRevisionId");

        var submitResponse = await editorClient.PostAsJsonAsync("/Mushrooms/SubmitForReview", new
        {
            RevisionId = revisionId
        });
        Assert.Equal(HttpStatusCode.OK, submitResponse.StatusCode);

        var rejectResponse = await moderatorClient.PostAsJsonAsync("/Mushrooms/ModerateMushroom", new
        {
            RevisionId = revisionId,
            Decision = "Reject",
            ReviewNote = "needs more detail"
        });
        Assert.Equal(HttpStatusCode.OK, rejectResponse.StatusCode);
        Assert.Equal("Rejected", ApiJson.RequiredString(await ApiJson.ParseAsync(rejectResponse), "data", "status"));
    }

    private static object BuildMushroomDraftPayload()
    {
        var suffix = Guid.NewGuid().ToString("N")[..8];

        return new
        {
            SourceMushroomId = (Guid?)null,
            Name = $"Integration Mushroom {suffix}",
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
            Description = "Integration test mushroom description.",
            HeaderPhotoLink = "https://example.com/mushroom-header.jpg",
            ExtraPhotoLinks = new[]
            {
                "https://example.com/mushroom-extra.jpg"
            },
            Doppelgangers = Array.Empty<string>()
        };
    }
}
