using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendFungi.DataBase.Entities;

public class Paragraph
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int ArticleId { get; set; }

    public string? ParagraphText { get; set; }

    public int SerialNumber { get; set; }
}