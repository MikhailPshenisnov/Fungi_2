namespace BackendFungi.Database.Entities;

public class ArticleLike
{
    public Guid Id { get; set; }
    public Guid ArticleId { get; set; }
    public Guid UserId { get; set; }
    public DateTime LikeDate { get; set; }
    
    public virtual Article Article { get; set; }
    public virtual User User { get; set; }
}