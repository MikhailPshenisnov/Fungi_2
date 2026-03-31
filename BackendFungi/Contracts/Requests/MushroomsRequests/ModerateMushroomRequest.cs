using BackendFungi.Models.Other;

namespace BackendFungi.Contracts.Requests.MushroomsRequests;

public record ModerateMushroomRequest(
    Guid RevisionId,
    ModerationDecision Decision,
    string? ReviewNote
);
