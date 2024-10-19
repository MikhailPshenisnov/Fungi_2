using BackendFungi.Contracts.DTOs;

namespace BackendFungi.Contracts.Requests;

public record GetFilterArticleResponse(List<FilterArticleDto> FilterArticleDtos);