namespace BackendFungi.Database.Entities;

public partial class User
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string? Email { get; set; }
    public string PasswordHash { get; set; } = null!;
    public Guid RoleId { get; set; }

    public virtual Role Role { get; set; } = null!;
}