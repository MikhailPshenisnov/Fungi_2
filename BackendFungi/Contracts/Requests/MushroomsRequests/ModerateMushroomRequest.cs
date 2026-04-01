using System.ComponentModel.DataAnnotations;
using BackendFungi.Models.Other;

namespace BackendFungi.Contracts.Requests.MushroomsRequests;

public record ModerateMushroomRequest(
    Guid RevisionId,
    [Required] ModerationDecision? Decision,
    string? ReviewNote
);
