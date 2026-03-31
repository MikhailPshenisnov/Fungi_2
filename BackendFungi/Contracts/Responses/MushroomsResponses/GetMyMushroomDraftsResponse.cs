using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses.MushroomsResponses;

public record GetMyMushroomDraftsResponse(
    List<EditorMushroomDto> Mushrooms
);
