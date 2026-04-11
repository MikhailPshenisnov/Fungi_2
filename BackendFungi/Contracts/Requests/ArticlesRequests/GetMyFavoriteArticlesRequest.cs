using System.ComponentModel.DataAnnotations;

namespace BackendFungi.Contracts.Requests.ArticlesRequests;

public record GetMyFavoriteArticlesRequest
{
    private const int DefaultPage = 1;
    private const int DefaultPageSize = 12;
    private const int MaxPageSize = 100;

    [Range(1, int.MaxValue)]
    public int Page { get; init; } = DefaultPage;

    [Range(1, MaxPageSize)]
    public int PageSize { get; init; } = DefaultPageSize;
}
