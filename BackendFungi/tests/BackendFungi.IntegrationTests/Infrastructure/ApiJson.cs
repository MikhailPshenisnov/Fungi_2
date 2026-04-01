using System.Text.Json.Nodes;

namespace BackendFungi.IntegrationTests.Infrastructure;

public static class ApiJson
{
    public static async Task<JsonNode> ParseAsync(HttpResponseMessage response)
    {
        var content = await response.Content.ReadAsStringAsync();
        return JsonNode.Parse(content) ?? throw new InvalidOperationException("Response body is empty JSON.");
    }

    public static string RequiredString(JsonNode node, params string[] path)
    {
        var valueNode = Resolve(node, path);
        var value = valueNode?.GetValue<string>();
        return !string.IsNullOrWhiteSpace(value)
            ? value
            : throw new InvalidOperationException($"Expected non-empty string at '{string.Join('.', path)}'.");
    }

    public static Guid RequiredGuid(JsonNode node, params string[] path)
    {
        return Guid.Parse(RequiredString(node, path));
    }

    public static bool HasProperty(JsonNode node, params string[] path)
    {
        return Resolve(node, path) is not null;
    }

    private static JsonNode? Resolve(JsonNode node, IReadOnlyList<string> path)
    {
        JsonNode? current = node;

        foreach (var segment in path)
        {
            current = current?[segment];
            if (current is null)
                return null;
        }

        return current;
    }
}
