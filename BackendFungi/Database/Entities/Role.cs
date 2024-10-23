namespace BackendFungi.Database.Entities;

public partial class Role
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}