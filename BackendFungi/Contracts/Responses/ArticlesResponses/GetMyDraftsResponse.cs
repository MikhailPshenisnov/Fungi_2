using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses.ArticlesResponses;

public record GetMyDraftsResponse(
    List<ArticleDto> Articles
);
