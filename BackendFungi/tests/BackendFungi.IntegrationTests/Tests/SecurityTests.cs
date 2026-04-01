using System.Net;
using BackendFungi.IntegrationTests.Infrastructure;
using Xunit;

namespace BackendFungi.IntegrationTests.Tests;

[Collection(IntegrationTestCollection.Name)]
public sealed class SecurityTests
{
    private readonly BackendFungiApiFactory _factory;

    public SecurityTests(BackendFungiApiFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetUser_allows_owner_to_read_self()
    {
        using var editorClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Editor);
        var editor = _factory.GetUser(TestUserKey.Editor);

        var response = await editorClient.GetAsync($"/Users/GetUser?userId={editor.Id}");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var json = await ApiJson.ParseAsync(response);
        Assert.Equal(editor.Id, ApiJson.RequiredGuid(json, "data", "user", "id"));
        Assert.Equal(editor.Email, ApiJson.RequiredString(json, "data", "user", "email"));
    }

    [Fact]
    public async Task GetUser_requires_ownership_or_users_read_permission_for_other_profiles()
    {
        using var outsiderClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Outsider);
        using var readerClient = await AuthHelper.CreateAuthenticatedClientAsync(_factory, TestUserKey.Reader);

        var editor = _factory.GetUser(TestUserKey.Editor);

        var outsiderResponse = await outsiderClient.GetAsync($"/Users/GetUser?userId={editor.Id}");
        Assert.Equal(HttpStatusCode.Forbidden, outsiderResponse.StatusCode);

        var readerResponse = await readerClient.GetAsync($"/Users/GetUser?userId={editor.Id}");
        Assert.Equal(HttpStatusCode.OK, readerResponse.StatusCode);
    }

    [Theory]
    [InlineData("/Users/TestGetUsers")]
    [InlineData("/Roles/TestGetRoles")]
    public async Task Test_endpoints_are_not_public(string path)
    {
        using var anonymousClient = _factory.CreateClient(new() { AllowAutoRedirect = false });

        var response = await anonymousClient.GetAsync(path);

        Assert.Contains(response.StatusCode, new[]
        {
            HttpStatusCode.Unauthorized,
            HttpStatusCode.Forbidden,
            HttpStatusCode.NotFound
        });
    }
}
