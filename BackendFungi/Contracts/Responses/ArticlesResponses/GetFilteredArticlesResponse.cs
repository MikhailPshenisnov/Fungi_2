using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses.ArticlesResponses;

public record GetFilteredArticlesResponse(
    List<ArticleDto> Articles
);