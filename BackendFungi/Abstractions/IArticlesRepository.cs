using BackendFungi.Models;

namespace BackendFungi.Abstractions;

public interface IArticlesRepository
{
    Task<string> CreateArticle(Article article);
    Task<List<Article>> GetAllArticles();
    Task<string> UpdateArticle(string articleTitle, Article newArticleModel);
    Task<string> DeleteArticle(string articleTitle);
}