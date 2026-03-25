using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses.ArticlesResponses;

public record GetMyMaterialsResponse(
    List<ArticleDto> Articles
);
