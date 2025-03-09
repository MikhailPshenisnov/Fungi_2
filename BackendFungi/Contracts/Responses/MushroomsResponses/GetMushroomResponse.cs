using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses.MushroomsResponses;

public record GetMushroomResponse(
    MushroomDto Mushroom
);