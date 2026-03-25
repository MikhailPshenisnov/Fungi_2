using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses.ArticlesResponses;

public record GetModerationQueueResponse(
    List<ArticleDto> Articles
);
