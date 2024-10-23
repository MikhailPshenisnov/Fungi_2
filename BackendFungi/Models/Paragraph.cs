namespace BackendFungi.Models;

public class Paragraph
{
    private Paragraph(Guid id, Guid articleId, string? paragraphText, int serialNumber)
    {
        Id = id;
        ArticleId = articleId;
        ParagraphText = paragraphText;
        SerialNumber = serialNumber;
    }
    
    public Guid Id { get; }
    public Guid ArticleId { get; }
    public string? ParagraphText { get; }
    public int SerialNumber { get; }
    
    public static (Paragraph Paragraph, string Error)
        Create(Guid id, Guid articleId, string? paragraphText, int serialNumber)
    {
        var error = string.Empty;

        if (serialNumber < 0)
        {
            error = "Serial number can't be less than 0";
        }
        
        var paragraph = new Paragraph(id, articleId, paragraphText, serialNumber);
        
        return (paragraph, error);
    }
}