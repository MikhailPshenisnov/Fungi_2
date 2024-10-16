using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendFungi.DataBase.Entities;

public class Article
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [MaxLength(255)]
    public string Title { get; set; } = null!;

    public DateTime? PublishDate { get; set; }
}