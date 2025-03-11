using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses.ArticlesResponses;

public record GetArticleResponse(
    ArticleDto Article
);