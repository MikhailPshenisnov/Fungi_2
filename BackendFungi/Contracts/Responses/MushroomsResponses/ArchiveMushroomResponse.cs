namespace BackendFungi.Contracts.Responses.MushroomsResponses;

public record ArchiveMushroomResponse(
    Guid RevisionId,
    string Status,
    DateTime ArchivedAt
);
