namespace BackendFungi.Contracts.Responses.MushroomsResponses;

public record ModerateMushroomResponse(
    Guid RevisionId,
    string Status,
    DateTime ReviewedAt,
    Guid? PublishedMushroomId
);
