using BackendFungi.Contracts.Other;

namespace BackendFungi.Contracts.Responses.ArticlesResponses;

public record GetEditorArticleResponse(
    EditorArticleDto Article
);
