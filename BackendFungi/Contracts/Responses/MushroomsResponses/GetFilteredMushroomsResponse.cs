using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses.MushroomsResponses;

public record GetFilteredMushroomsResponse(
    List<MushroomDto> Mushrooms,
    int TotalCount,
    int Page,
    int PageSize
);
