namespace BackendFungi.Contracts.Responses.MushroomsResponses;

public record SubmitMushroomForReviewResponse(
    Guid RevisionId,
    string Status,
    DateTime SubmittedAt
);
