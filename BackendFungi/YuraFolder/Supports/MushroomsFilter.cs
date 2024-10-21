using BackendFungi.Database.Context;
using BackendFungi.Database.Entities;
using BackendFungi.YuraFolder.Models;

namespace BackendFungi.YuraFolder.Supports;

public static class MushroomsFilter
{
    public static Mushroom[] Filter(MushroomsModel model, FungiDbContext dbContext)
    {
        var mushrooms = dbContext.Mushrooms.ToArray();

        if (model.Redbook is not null)
        {
            mushrooms = mushrooms.Where(p => p.RedBook == model.Redbook).ToArray();
        }

        if (model.Eatable is not null)
        {
            mushrooms = mushrooms.Where(p => p.Eatable == model.Eatable).ToArray();
        }

        if (model.HasStem is not null)
        {
            mushrooms = mushrooms.Where(p => p.HasStem == model.HasStem).ToArray();
        }

        if (model.StemSizeFrom is not null)
        {
            mushrooms = mushrooms.Where(p => p.StemSizeFrom >= model.StemSizeFrom).ToArray();
        }

        if (model.StemSizeTo is not null)
        {
            mushrooms = mushrooms.Where(p => p.StemSizeTo <= model.StemSizeTo).ToArray();
        }

        if (model.StemType is not null)
        {
            mushrooms = mushrooms.Where(p => p.StemType == model.StemType).ToArray();
        }

        if (model.SteamColor is not null)
        {
            mushrooms = mushrooms.Where(p => p.SteamColor == model.SteamColor).ToArray();
        }

        return mushrooms;
    }
}