namespace BackendFungi.Database.Entities;

public class MushroomLike
{
    public Guid Id { get; set; }
    public Guid MushroomId { get; set; }
    public Guid UserId { get; set; }
    public DateTime LikeDate { get; set; }
    
    public virtual Mushroom Mushroom { get; set; }
    public virtual User User { get; set; }
}