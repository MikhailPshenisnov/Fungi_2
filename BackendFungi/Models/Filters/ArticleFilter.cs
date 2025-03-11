namespace BackendFungi.Models.Filters;

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

    private string BasicChecks()
    {
        var error = string.Empty;

        if (PublishDateFrom > DateTime.Now)
        {
            error = "Publish date from can't be from the future";
        }
        else if (PublishDateFrom > PublishDateTo)
        {
            error = "Wrong order of publish date from and publish date to";
        }

        return error;
    }

    public static (ArticleFilter ArticleFilter, string Error) Create(string? partOfTitle, DateTime? publishDateFrom,
        DateTime? publishDateTo, string? partOfAuthorString)
    {
        var articleFilter = new ArticleFilter(partOfTitle, publishDateFrom, publishDateTo, partOfAuthorString);

        var error = articleFilter.BasicChecks();

        return (articleFilter, error);
    }
}