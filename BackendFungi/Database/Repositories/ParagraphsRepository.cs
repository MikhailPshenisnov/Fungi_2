using BackendFungi.Abstractions;
using BackendFungi.Database.Context;
using BackendFungi.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendFungi.Database.Repositories;

public class ParagraphsRepository : IParagraphsRepository
{
    private readonly FungiDbContext _context;

    public ParagraphsRepository(FungiDbContext context)
    {
        _context = context;
    }

    // Creating a paragraph in the paragraph table, returns the id of the created paragraph
    public async Task<Guid> CreateParagraph(Paragraph paragraph)
    {
        var paragraphEntity = new Entities.Paragraph
        {
            Id = paragraph.Id,
            ArticleId = paragraph.ArticleId,
            ParagraphText = paragraph.ParagraphText,
            SerialNumber = paragraph.SerialNumber
        };

        await _context.Paragraphs.AddAsync(paragraphEntity);
        await _context.SaveChangesAsync();

        return paragraphEntity.Id;
    }

    // Gets a list of article paragraphs, replaces getting a single paragraph,
    // because we only need to get a set of article paragraphs
    public async Task<List<Paragraph>> GetArticleParagraphs(Guid articleId)
    {
        var paragraphEntities = await (from paragraph in _context.Paragraphs
                where paragraph.ArticleId == articleId
                select paragraph)
            .OrderBy(x => x.SerialNumber)
            .AsNoTracking()
            .ToListAsync();

        var paragraphs = paragraphEntities
            .Select(p => Paragraph.Create(p.Id, p.ArticleId, p.ParagraphText, p.SerialNumber).Paragraph)
            .ToList();

        if (paragraphs.Count == 0)
        {
            throw new Exception("Unknown article id");
        }

        return paragraphs;
    }

    // The Update function is not needed, because when the article is changed,
    // paragraphs should be deleted and recreated

    // Deleting a paragraph in the paragraph table, returns the id of the deleted paragraph
    public async Task<Guid> DeleteParagraph(Guid paragraphId)
    {
        var numUpdated = await _context.Paragraphs
            .Where(p => p.Id == paragraphId)
            .ExecuteDeleteAsync();
        
        if (numUpdated == 0)
        {
            throw new Exception("Unknown paragraph id");
        }

        return paragraphId;
    }
}