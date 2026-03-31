namespace BackendFungi.Contracts.Responses.MushroomsResponses;

public record UpdateMushroomDraftResponse(
    Guid UpdatedRevisionId,
    string Status
);
