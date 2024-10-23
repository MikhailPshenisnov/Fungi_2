using BackendFungi.Models;

namespace BackendFungi.Abstractions;

public interface IArticleService
{
    Task<Article> GetArticleAsync(string articleTitle, CancellationToken ct);
    // TODO Нужно как-то интегрировать фильтрацию статей в этот интерфейс и сервис
    // GetFilteredArticlesAsync
    Task<List<Article>> GetAllArticlesAsync(CancellationToken ct);
    Task<Guid> CreateArticleAsync(Article article, CancellationToken ct);
    // TODO BUG Нужно исправить исчезновение абзацев при изменении статьи
    Task<Guid> UpdateArticleAsync(string articleTitle, string newArticleTitle, DateTime? newPublishDate,
        List<Paragraph> newParagraphs, CancellationToken ct);
    Task<Guid> DeleteArticleAsync(string articleTitle, CancellationToken ct);
}