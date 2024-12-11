namespace BackendFungi.Models;

public class ArticleFilter
{
    private ArticleFilter(string? partOfTitle, DateTime? publishDateFrom, DateTime? publishDateTo,
        string? partOfAuthorString)
    {
        PartOfTitle = partOfTitle;
        PublishDateFrom = publishDateFrom;
        PublishDateTo = publishDateTo;
        PartOfAuthorString = partOfAuthorString;
    }

    public string? PartOfTitle { get; }
    public DateTime? PublishDateFrom { get; }
    public DateTime? PublishDateTo { get; }
    public string? PartOfAuthorString { get; }

    private static string ArticleFilterBasicChecks(DateTime? publishDateFrom, DateTime? publishDateTo)
    {
        var error = string.Empty;

        if (publishDateFrom is not null && publishDateFrom > DateTime.Now)
        {
            error = "Publish date from can't be from the future";
        }
        else if (publishDateFrom is not null && publishDateTo is not null && publishDateFrom > publishDateTo)
        {
            error = "Wrong order of publish date from and publish date to";
        }

        return error;
    }

    public static (ArticleFilter ArticleFilter, string Error) Create(string? partOfTitle, DateTime? publishDateFrom,
        DateTime? publishDateTo, string? partOfAuthorString)
    {
        var error = ArticleFilterBasicChecks(publishDateFrom, publishDateTo);

        var articleFilter = new ArticleFilter(partOfTitle, publishDateFrom, publishDateTo, partOfAuthorString);

        return (articleFilter, error);
    }
}