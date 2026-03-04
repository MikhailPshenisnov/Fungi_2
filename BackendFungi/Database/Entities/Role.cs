namespace BackendFungi.Database.Entities;

public partial class Role
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public int AccessLevel { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
    public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}
