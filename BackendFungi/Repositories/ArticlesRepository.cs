using BackendFungi.Abstractions.Repositories;
using BackendFungi.Database.Context;
using BackendFungi.Exceptions.SpecificExceptions;
using BackendFungi.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendFungi.Repositories;

public class ArticlesRepository : IArticlesRepository
{
    private readonly FungiDbContext _context;

    public ArticlesRepository(FungiDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> CreateArticle(Article article, CancellationToken cancellationToken)
    {
        var extraPhotoLinksString = article.ExtraPhotoLinks is null ? null : string.Join(";", article.ExtraPhotoLinks);

        var articleEntity = new Database.Entities.Article
        {
            Id = article.Id,
            Title = article.Title,
            PublishDate = article.PublishDate,
            AuthorString = article.AuthorString,
            HeaderPhotoLink = article.HeaderPhotoLink,
            ExtraPhotoLinks = extraPhotoLinksString
        };

        await _context.Articles.AddAsync(articleEntity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        foreach (var paragraphEntity in article.Paragraphs
                     .Select(paragraph => new Database.Entities.Paragraph
                     {
                         Id = paragraph.Id,
                         ArticleId = paragraph.ArticleId,
                         ParagraphText = paragraph.ParagraphText,
                         SerialNumber = paragraph.SerialNumber,
                         IsSubtitle = paragraph.IsSubtitle
                     })
                     .ToList())
        {
            await _context.Paragraphs.AddAsync(paragraphEntity, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        return articleEntity.Id;
    }

    public async Task<List<Article>> GetAllArticles(CancellationToken cancellationToken)
    {
        var articleEntities = await _context.Articles
            .Include(a => a.Paragraphs)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var articles = articleEntities
            .Select(articleEntity =>
            {
                var paragraphs = articleEntity.Paragraphs
                    .Select(paragraphEntity =>
                    {
                        var (paragraph, paragraphError) = Paragraph
                            .Create(paragraphEntity.Id,
                                paragraphEntity.ArticleId,
                                paragraphEntity.ParagraphText,
                                paragraphEntity.SerialNumber,
                                paragraphEntity.IsSubtitle);

                        if (!string.IsNullOrEmpty(paragraphError))
                            throw new IntegrityException($"Incorrect data format in the database, unable to create " +
                                                         $"a paragraph model: {paragraphError}");

                        return paragraph;
                    })
                    .ToList();

                var (article, articleError) = Article
                    .Create(articleEntity.Id,
                        articleEntity.Title,
                        articleEntity.PublishDate,
                        articleEntity.AuthorString,
                        articleEntity.HeaderPhotoLink,
                        articleEntity.ExtraPhotoLinks?.Split(';').ToList(),
                        paragraphs);

                if (!string.IsNullOrEmpty(articleError))
                    throw new IntegrityException($"Incorrect data format in the database, unable to create an " +
                                                 $"article model: {articleError}");

                return article;
            })
            .ToList();

        return articles;
    }

    public async Task<Guid> UpdateArticle(Guid articleId, Article newArticle, CancellationToken cancellationToken)
    {
        var oldArticleEntity = await _context.Articles
            .Include(a => a.Paragraphs)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == articleId, cancellationToken);

        if (oldArticleEntity is null)
            throw new UnknownIdentifierException("Unknown article id");

        await _context.Paragraphs
            .Where(p => oldArticleEntity.Paragraphs
                .Select(x => x.Id)
                .Contains(p.Id))
            .ExecuteDeleteAsync(cancellationToken);

        var newExtraPhotoLinksString =
            newArticle.ExtraPhotoLinks is null ? null : string.Join(";", newArticle.ExtraPhotoLinks);

        await _context.Articles
            .Where(a => a.Id == articleId)
            .ExecuteUpdateAsync(x => x
                    .SetProperty(a => a.Title, a => newArticle.Title)
                    .SetProperty(a => a.PublishDate, a => newArticle.PublishDate)
                    .SetProperty(a => a.AuthorString, a => newArticle.AuthorString)
                    .SetProperty(a => a.HeaderPhotoLink, a => newArticle.HeaderPhotoLink)
                    .SetProperty(a => a.ExtraPhotoLinks, a => newExtraPhotoLinksString),
                cancellationToken);

        foreach (var paragraphEntity in newArticle.Paragraphs
                     .Select(paragraph => new Database.Entities.Paragraph
                     {
                         Id = paragraph.Id,
                         ArticleId = paragraph.ArticleId,
                         ParagraphText = paragraph.ParagraphText,
                         SerialNumber = paragraph.SerialNumber,
                         IsSubtitle = paragraph.IsSubtitle
                     })
                     .ToList())
        {
            await _context.Paragraphs.AddAsync(paragraphEntity, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        return oldArticleEntity.Id;
    }

    public async Task<Guid> DeleteArticle(Guid articleId, CancellationToken cancellationToken)
    {
        var numDeleted = await _context.Articles
            .Where(a => a.Id == articleId)
            .ExecuteDeleteAsync(cancellationToken);

        if (numDeleted == 0)
            throw new UnknownIdentifierException("Unknown article id");

        return articleId;
    }
}