using BackendFungi.DataBase.Context;
using BackendFungi.DataBase.Entities;
using BackendFungi.Models;

namespace BackendFungi.DataBase;

public static class DbApiFunctions
{
    public static int FindArticleId(string articleTitle)
    {
        using var dbContext = new FungiDbContext();

        var foundedArticle = (from article in dbContext.Articles
            where article.Title == articleTitle
            select article).FirstOrDefault();

        if (foundedArticle == null)
            throw new Exception("Unknown article title");

        return foundedArticle.Id;
    }

    public static List<ParagraphModel> GetArticleParagraphs(int articleId)
    {
        using var dbContext = new FungiDbContext();

        var articleParagraphs = (from paragraph in dbContext.Paragraphs
            where paragraph.ArticleId == articleId
            select paragraph).OrderBy(x => x.SerialNumber).ToList();

        if (articleParagraphs == null || articleParagraphs.Count == 0)
            throw new Exception("Incorrect article id or article is empty");

        var result = new List<ParagraphModel>();
        foreach (var paragraph in articleParagraphs)
        {
            result.Add(new ParagraphModel
            {
                ParagraphText = paragraph.ParagraphText
            });
        }

        return result;
    }

    public static ArticleModel GetArticle(int articleId)
    {
        using var dbContext = new FungiDbContext();

        var foundedArticle = (from article in dbContext.Articles
            where article.Id == articleId
            select article).FirstOrDefault();

        if (foundedArticle == null)
            throw new Exception("Incorrect article id");

        var result = new ArticleModel
        {
            Title = foundedArticle.Title,
            PublishDate = foundedArticle.PublishDate,
            Paragraphs = GetArticleParagraphs(foundedArticle.Id)
        };

        return result;
    }

    public static List<ArticleModel> GetAllArticles()
    {
        using var dbContext = new FungiDbContext();

        var allArticles = (from article in dbContext.Articles
            select article).ToList();

        var result = new List<ArticleModel>();

        foreach (var article in allArticles)
        {
            result.Add(new ArticleModel
            {
                Title = article.Title,
                PublishDate = article.PublishDate,
                Paragraphs = GetArticleParagraphs(article.Id)
            });
        }

        return result;
    }

    public static void CreateArticle(ArticleModel article)
    {
        using var dbContext = new FungiDbContext();

        var addedArticle = dbContext.Articles.Add(new Article
        {
            Title = article.Title,
            PublishDate = article.PublishDate
        });

        dbContext.SaveChanges();

        var counter = 0;

        foreach (var paragraph in article.Paragraphs)
        {
            dbContext.Paragraphs.Add(new Paragraph
            {
                ArticleId = addedArticle.Entity.Id,
                ParagraphText = paragraph.ParagraphText,
                SerialNumber = counter++
            });
        }

        dbContext.SaveChanges();
    }
}