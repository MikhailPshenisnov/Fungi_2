namespace BackendFungi.Database.Entities;

public partial class MushroomRevisionDoppelganger
{
    public Guid Id { get; set; }
    public Guid RevisionId { get; set; }
    public string DoppelgangerName { get; set; } = null!;

    public virtual MushroomRevision Revision { get; set; } = null!;
}
