namespace BackendFungi.Models;

public class Role
{
    public const int MaxNameLength = 30;
    
    private Role(Guid id, string name)
    {
        Id = id;
        Name = name;
    }
    
    public Guid Id { get; }
    public string Name { get; }

    public static (Role Role, string Error) Create(Guid id, string name)
    {
        var error = string.Empty;

        if (string.IsNullOrEmpty(name) || name.Length > MaxNameLength)
        {
            error = $"Role name can't be longer than {MaxNameLength} characters or empty";
        }
        
        var role = new Role(id, name);
        
        return (role, error);
    }
}