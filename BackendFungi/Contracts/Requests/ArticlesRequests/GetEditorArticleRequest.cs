using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record GetEditorArticleRequest
{
    [BindRequired]
    public Guid ArticleId { get; init; }
}
