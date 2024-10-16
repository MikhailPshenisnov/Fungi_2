using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendFungi.DataBase.Entities;

public class Mushroom
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [MaxLength(100)]
    public string Name { get; set; } = null!;

    [MaxLength(100)]
    public string? SynonymousName { get; set; }

    public bool RedBook { get; set; }

    [MaxLength(15)]
    public string Eatable { get; set; } = null!;

    public bool HasStem { get; set; }

    public int? StemSizeFrom { get; set; }

    public int? StemSizeTo { get; set; }

    [MaxLength(30)]
    public string? StemType { get; set; }

    [MaxLength(100)]
    public string? SteamColor { get; set; }

    public string? Description { get; set; }
}