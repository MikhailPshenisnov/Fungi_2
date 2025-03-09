namespace BackendFungi.Models.Filters;

public class UserFilter
{
    private UserFilter(string? partOfUsername, string? partOfEmail, Guid? roleId)
    {
        PartOfUsername = partOfUsername;
        PartOfEmail = partOfEmail;
        RoleId = roleId;
    }

    public string? PartOfUsername { get; }
    public string? PartOfEmail { get; }
    public Guid? RoleId { get; }

    private string BasicChecks()
    {
        var error = string.Empty;

        return error;
    }

    public static (UserFilter UserFilter, string Error) Create(string? partOfUsername, string? partOfEmail,
        Guid? roleId)
    {
        var userFilter = new UserFilter(partOfUsername, partOfEmail, roleId);

        var error = userFilter.BasicChecks();

        return (userFilter, error);
    }
}