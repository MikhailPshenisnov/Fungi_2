using BackendFungi.Models;

namespace BackendFungi.Abstractions;

public interface IArticlesRepository
{
    Task<(Guid, List<Guid>)> CreateArticle(Article article);
    Task<List<Article>> GetAllArticles();
    Task<Guid> GetArticleId(string articleTitle);
    Task<Article> GetArticle(Guid articleId);
    Task<Guid> UpdateArticle(Guid articleId, string newArticleTitle, DateTime? newPublishDate,
        List<Paragraph> newParagraphs);
    Task<Guid> DeleteArticle(Guid id);
}