namespace BackendFungi.Models;

public class Paragraph
{
    private Paragraph(Guid id, Guid articleId, string paragraphText, int serialNumber, bool isSubtitle)
    {
        Id = id;
        ArticleId = articleId;
        ParagraphText = paragraphText;
        SerialNumber = serialNumber;
        IsSubtitle = isSubtitle;
    }

    public Guid Id { get; }
    public Guid ArticleId { get; }
    public string ParagraphText { get; }
    public int SerialNumber { get; }
    public bool IsSubtitle { get; }

    private string ParagraphBasicChecks()
    {
        var error = string.Empty;

        if (SerialNumber < 0)
        {
            error = "Serial number can't be less than 0";
        }

        return error;
    }

    public static (Paragraph Paragraph, string Error)
        Create(Guid id, Guid articleId, string paragraphText, int serialNumber, bool isSubtitle)
    {
        var paragraph = new Paragraph(id, articleId, paragraphText, serialNumber, isSubtitle);

        var error = paragraph.ParagraphBasicChecks();

        return (paragraph, error);
    }
}