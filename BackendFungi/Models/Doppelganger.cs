namespace BackendFungi.Models;

public class Doppelganger
{
    public const int MaxDoppelgangerNameLength = 100;

    private Doppelganger(int id, int mushroomId, string doppelgangerName)
    {
        Id = id;
        MushroomId = mushroomId;
        DoppelgangerName = doppelgangerName;
    }

    public int Id { get; }
    public int MushroomId { get; }
    public string DoppelgangerName { get; }

    public static (Doppelganger Doppelganger, string Error)
        Create(int id, int mushroomId, string doppelgangerName)
    {
        var error = string.Empty;

        if (id < 0)
        {
            error = "Id can't be less than 0";
        }
        else if (mushroomId < 0)
        {
            error = "Mushroom id can't be less than 0";
        }
        else if (string.IsNullOrEmpty(doppelgangerName) || doppelgangerName.Length > MaxDoppelgangerNameLength)
        {
            error = $"Doppelganger name can't be longer than {MaxDoppelgangerNameLength} characters or empty";
        }

        var article = new Doppelganger(id, mushroomId, doppelgangerName);

        return (article, error);
    }
}