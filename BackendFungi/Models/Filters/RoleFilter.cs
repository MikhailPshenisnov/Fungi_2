namespace BackendFungi.Models.Filters;

public class RoleFilter
{
    private RoleFilter(string? partOfName, int? accessLevelFrom, int? accessLevelTo)
    {
        PartOfName = partOfName;
        AccessLevelFrom = accessLevelFrom;
        AccessLevelTo = accessLevelTo;
    }

    public string? PartOfName { get; }
    public int? AccessLevelFrom { get; }
    public int? AccessLevelTo { get; }

    private string BasicChecks()
    {
        var error = string.Empty;

        if (AccessLevelFrom > AccessLevelTo)
        {
            error = "Wrong order of access level from and access level to";
        }

        return error;
    }

    public static (RoleFilter RoleFilter, string Error) Create(string? partOfName, int? accessLevelFrom,
        int? accessLevelTo)
    {
        var roleFilter = new RoleFilter(partOfName, accessLevelFrom, accessLevelTo);

        var error = roleFilter.BasicChecks();

        return (roleFilter, error);
    }
}