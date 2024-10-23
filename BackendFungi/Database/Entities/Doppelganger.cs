namespace BackendFungi.Database.Entities;

public partial class Doppelganger
{
    public Guid Id { get; set; }
    public Guid MushroomId { get; set; }
    public string DoppelgangerName { get; set; } = null!;

    public virtual Mushroom Mushroom { get; set; } = null!;
}