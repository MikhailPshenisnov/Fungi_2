using System.Linq.Expressions;
using BackendFungi.Abstractions;
using BackendFungi.Contracts;
using BackendFungi.Database.Context;
using BackendFungi.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendFungi.Services;

public class FilterArticleService : IFilterArticleService
{
    private readonly FungiDbContext _context;

    public FilterArticleService(FungiDbContext context)
    {
        _context = context;
    }

    public async Task<List<FilterArticleDto>> GetFilterArticlesAsync(GetFilterArticleRequest request,
        CancellationToken ct)
    {
        var filterArticleQuery = _context.Articles
            .Where(a => string.IsNullOrEmpty(request.Search) || a.Title.ToLower().Contains(request.Search.ToLower()));

        Expression<Func<Article, object>> selectorKey = request.SortBy?.ToLower() switch
        {
            "id" => article => article.Id,
            "title" => article => article.Title,
            _ => article => article.PublishDate!
        };

        filterArticleQuery = request.SortOrder == "desc"
            ? filterArticleQuery.OrderByDescending(selectorKey)
            : filterArticleQuery.OrderBy(selectorKey);
        
        return await filterArticleQuery
            .Select(a => new FilterArticleDto(a.Id, a.Title, a.PublishDate))
            .ToListAsync(ct);
    }
}