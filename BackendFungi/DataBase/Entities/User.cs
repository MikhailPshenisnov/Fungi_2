using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendFungi.DataBase.Entities;

public class User
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [MaxLength(128)] 
    public string Username { get; set; } = null!;

    [MaxLength(128)] 
    public string PasswordHash { get; set; } = null!;

    public int Role { get; set; }

    [MaxLength(128)] 
    public string? Email { get; set; }
}