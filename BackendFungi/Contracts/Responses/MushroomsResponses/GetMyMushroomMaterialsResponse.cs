using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses.MushroomsResponses;

public record GetMyMushroomMaterialsResponse(
    List<EditorMushroomDto> Mushrooms
);
