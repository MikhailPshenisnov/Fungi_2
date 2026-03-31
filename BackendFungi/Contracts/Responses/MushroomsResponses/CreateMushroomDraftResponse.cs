namespace BackendFungi.Contracts.Responses.MushroomsResponses;

public record CreateMushroomDraftResponse(
    Guid CreatedRevisionId,
    string Status
);
