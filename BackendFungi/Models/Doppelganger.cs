namespace BackendFungi.Models;

public class Doppelganger
{
    public const int MaxDoppelgangerNameLength = 128;

    private Doppelganger(Guid id, Guid mushroomId, string doppelgangerName)
    {
        Id = id;
        MushroomId = mushroomId;
        DoppelgangerName = doppelgangerName;
    }

    public Guid Id { get; }
    public Guid MushroomId { get; }
    public string DoppelgangerName { get; }

    private string BasicChecks()
    {
        var error = string.Empty;

        if (string.IsNullOrEmpty(DoppelgangerName) || DoppelgangerName.Length > MaxDoppelgangerNameLength)
        {
            error = $"Doppelganger name can't be longer than {MaxDoppelgangerNameLength} characters or empty";
        }

        return error;
    }

    public static (Doppelganger Doppelganger, string Error) Create(Guid id, Guid mushroomId, string doppelgangerName)
    {
        var doppelganger = new Doppelganger(id, mushroomId, doppelgangerName);

        var error = doppelganger.BasicChecks();

        return (doppelganger, error);
    }
}