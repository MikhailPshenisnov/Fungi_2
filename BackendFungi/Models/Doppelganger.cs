namespace BackendFungi.Models;

public class Doppelganger
{
    public const int MaxDoppelgangerNameLength = 100;

    private Doppelganger(Guid id, Guid mushroomId, string doppelgangerName)
    {
        Id = id;
        MushroomId = mushroomId;
        DoppelgangerName = doppelgangerName;
    }

    public Guid Id { get; }
    public Guid MushroomId { get; }
    public string DoppelgangerName { get; }

    private static string DoppelgangerBasicChecks(string doppelgangerName)
    {
        var error = string.Empty;

        if (string.IsNullOrEmpty(doppelgangerName) || doppelgangerName.Length > MaxDoppelgangerNameLength)
        {
            error = $"Doppelganger name can't be longer than {MaxDoppelgangerNameLength} characters or empty";
        }

        return error;
    }

    public static (Doppelganger Doppelganger, string Error)
        Create(Guid id, Guid mushroomId, string doppelgangerName)
    {
        var error = DoppelgangerBasicChecks(doppelgangerName);

        var article = new Doppelganger(id, mushroomId, doppelgangerName);

        return (article, error);
    }
}