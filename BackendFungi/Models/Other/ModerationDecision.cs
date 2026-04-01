using System.Text.Json.Serialization;

namespace BackendFungi.Models.Other;

[JsonConverter(typeof(ModerationDecisionJsonConverter))]
public enum ModerationDecision
{
    Approve = 0,
    Reject = 1
}
