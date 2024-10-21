namespace BackendFungi.Models;

public class Role
{
    public const int MaxNameLength = 30;
    
    private Role(int id, string name)
    {
        Id = id;
        Name = name;
    }
    
    public int Id { get; }
    public string Name { get; }

    public static (Role Role, string Error) Create(int id, string name)
    {
        var error = string.Empty;

        if (id < 0)
        {
            error = "Id can't be less than 0";
        }
        else if (string.IsNullOrEmpty(name) || name.Length > MaxNameLength)
        {
            error = $"Role name can't be longer than {MaxNameLength} characters or empty";
        }
        
        var role = new Role(id, name);
        
        return (role, error);
    }
}