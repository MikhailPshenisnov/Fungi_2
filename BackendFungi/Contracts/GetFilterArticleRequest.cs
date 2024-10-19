namespace BackendFungi.Contracts.Requests;

public record GetFilterArticleRequest(string? Search, string? SortBy, string? SortOrder);