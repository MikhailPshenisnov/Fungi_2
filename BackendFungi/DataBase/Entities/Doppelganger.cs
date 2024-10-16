using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendFungi.DataBase.Entities;

public class Doppelganger
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    public int MushroomId { get; set; }

    [MaxLength(100)]
    public string DoppelgangerName { get; set; } = null!;
}