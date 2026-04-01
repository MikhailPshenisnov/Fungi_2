using System.Text.Json;
using System.Text.Json.Serialization;

namespace BackendFungi.Models.Other;

public class ModerationDecisionJsonConverter : JsonConverter<ModerationDecision>
{
    private static readonly string[] AllowedValues = Enum.GetNames<ModerationDecision>();
    private static readonly string ValidationMessage =
        $"Invalid moderation decision. Expected one of: {string.Join(", ", AllowedValues)}.";

    public override ModerationDecision Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType != JsonTokenType.String)
            throw new JsonException(ValidationMessage);

        var rawValue = reader.GetString();

        if (string.IsNullOrWhiteSpace(rawValue) ||
            !Enum.TryParse<ModerationDecision>(rawValue, ignoreCase: true, out var parsedValue) ||
            !Enum.IsDefined(parsedValue))
        {
            throw new JsonException(ValidationMessage);
        }

        return parsedValue;
    }

    public override void Write(Utf8JsonWriter writer, ModerationDecision value, JsonSerializerOptions options)
    {
        if (!Enum.IsDefined(value))
            throw new JsonException(ValidationMessage);

        writer.WriteStringValue(value.ToString());
    }
}
