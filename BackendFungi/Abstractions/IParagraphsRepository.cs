using BackendFungi.Models;

namespace BackendFungi.Abstractions;

public interface IParagraphsRepository
{
    Task<Guid> CreateParagraph(Paragraph paragraph);
    Task<List<Paragraph>> GetArticleParagraphs(Guid articleId);
    Task<Guid> DeleteParagraph(Guid paragraphId);
}