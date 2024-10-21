using BackendFungi.Contracts.DTOs;
using BackendFungi.Contracts.Requests;
using BackendFungi.Database.Entities;

namespace BackendFungi.Services;

public interface IFilterArticleService
{
    Task<List<FilterArticleDto>> GetFilterArticlesAsync(GetFilterArticleRequest request,
        CancellationToken ct);
}