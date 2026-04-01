using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace BackendFungi.IntegrationTests.Infrastructure;

public static class AuthHelper
{
    public static async Task<string> LoginAndGetBearerAsync(HttpClient client, SeedUser user)
    {
        var response = await client.PostAsJsonAsync("/Authorization/LoginUser", new
        {
            Email = user.Email,
            Password = user.Password
        });

        response.EnsureSuccessStatusCode();

        var json = await ApiJson.ParseAsync(response);
        return ApiJson.RequiredString(json, "data", "token");
    }

    public static async Task<HttpClient> CreateAuthenticatedClientAsync(BackendFungiApiFactory factory, TestUserKey userKey)
    {
        var client = factory.CreateClient(new() { AllowAutoRedirect = false });
        var user = factory.GetUser(userKey);
        var token = await LoginAndGetBearerAsync(client, user);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    }
}
