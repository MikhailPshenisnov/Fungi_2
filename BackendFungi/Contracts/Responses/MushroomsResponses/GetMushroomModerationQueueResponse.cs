using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses.MushroomsResponses;

public record GetMushroomModerationQueueResponse(
    List<EditorMushroomDto> Mushrooms
);
