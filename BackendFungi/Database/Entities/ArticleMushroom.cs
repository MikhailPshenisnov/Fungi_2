namespace BackendFungi.Database.Entities;

public class ArticleMushroom
{
    public Guid Id { get; set; }
    public Guid ArticleId { get; set; }
    public Guid MushroomId { get; set; }
    public virtual Article Article { get; set; }
    public virtual Mushroom Mushroom { get; set; }
}