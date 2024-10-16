using BackendFungi.DataBase.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendFungi.DataBase.Context;

public partial class FungiDbContext : DbContext
{
    public FungiDbContext()
    {
    }

    public FungiDbContext(DbContextOptions<FungiDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Article> Articles { get; set; }

    public virtual DbSet<Doppelganger> Doppelgangers { get; set; }

    public virtual DbSet<Mushroom> Mushrooms { get; set; }

    public virtual DbSet<Paragraph> Paragraphs { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<User> Users { get; set; }

    // #warning To protect potentially sensitive information in your connection string,
    // you should move it out of source code. You can avoid scaffolding the connection string
    // by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148.
    // For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=FungiDB;" +
                                    "Username=developer;Password=developer");


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Article>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Articles_pkey");

            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            entity.Property(e => e.Title).HasMaxLength(255);
        });

        modelBuilder.Entity<Doppelganger>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Doppelgangers_pkey");

            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            entity.Property(e => e.DoppelgangerName).HasMaxLength(100);
        });

        modelBuilder.Entity<Mushroom>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Mushrooms_pkey");

            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            entity.Property(e => e.Eatable).HasMaxLength(15);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.SteamColor).HasMaxLength(100);
            entity.Property(e => e.StemType).HasMaxLength(30);
            entity.Property(e => e.SynonymousName).HasMaxLength(100);
        });

        modelBuilder.Entity<Paragraph>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Paragraphs_pkey");

            entity.Property(e => e.Id).UseIdentityAlwaysColumn();

            entity.HasOne(d => d.Article).WithMany(p => p.Paragraphs)
                .HasForeignKey(d => d.ArticleId)
                .HasConstraintName("Paragraphs_ArticleId_fkey");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Roles_pkey");

            entity.HasIndex(e => e.Name, "Roles_Name_key").IsUnique();

            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            entity.Property(e => e.Name).HasMaxLength(30);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Users_pkey");

            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            entity.Property(e => e.Email).HasMaxLength(128);
            entity.Property(e => e.PasswordHash).HasMaxLength(128);
            entity.Property(e => e.Username).HasMaxLength(128);

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Users_RoleId_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}