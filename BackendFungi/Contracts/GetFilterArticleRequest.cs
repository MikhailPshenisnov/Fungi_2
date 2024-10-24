namespace BackendFungi.Contracts;

public record GetFilterArticleRequest(string? Search, string? SortBy, string? SortOrder);