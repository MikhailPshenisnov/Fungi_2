namespace BackendFungi.Models;

public class Paragraph
{
    private Paragraph(int id, int articleId, string? paragraphText, int serialNumber)
    {
        Id = id;
        ArticleId = articleId;
        ParagraphText = paragraphText;
        SerialNumber = serialNumber;
    }
    
    public int Id { get; }
    public int ArticleId { get; }
    public string? ParagraphText { get; }
    public int SerialNumber { get; }
    
    public static (Paragraph Paragraph, string Error)
        Create(int id, int articleId, string? paragraphText, int serialNumber)
    {
        var error = string.Empty;

        if (id < 0)
        {
            error = "Id can't be less than 0";
        }
        else if (articleId < 0)
        {
            error = "Article id can't be less than 0";
        }
        else if (serialNumber < 0)
        {
            error = "Serial number can't be less than 0";
        }
        
        var paragraph = new Paragraph(id, articleId, paragraphText, serialNumber);
        
        return (paragraph, error);
    }
}