using BackendFungi.Contracts;

namespace BackendFungi.Abstractions;

public interface IFilterArticleService
{
    Task<List<FilterArticleDto>> GetFilterArticlesAsync(GetFilterArticleRequest request,
        CancellationToken ct);
}