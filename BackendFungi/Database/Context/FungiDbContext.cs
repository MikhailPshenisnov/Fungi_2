using BackendFungi.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendFungi.Database.Context;

public partial class FungiDbContext : DbContext
{
    private readonly IConfiguration _configuration;

    public FungiDbContext(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public FungiDbContext(DbContextOptions<FungiDbContext> options, IConfiguration configuration)
        : base(options)
    {
        _configuration = configuration;
    }

    public virtual DbSet<Article> Articles { get; set; }
    public virtual DbSet<Doppelganger> Doppelgangers { get; set; }
    public virtual DbSet<Mushroom> Mushrooms { get; set; }
    public virtual DbSet<Paragraph> Paragraphs { get; set; }
    public virtual DbSet<Role> Roles { get; set; }
    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql(_configuration["ConnectionString"]);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Article>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Articles_pkey");
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Title).HasMaxLength(255);
        });

        modelBuilder.Entity<Doppelganger>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Doppelgangers_pkey");
            entity.HasIndex(e => e.MushroomId, "fki_Doppelgangers_MushroomId_fkey");
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.DoppelgangerName).HasMaxLength(100);
            entity.HasOne(d => d.Mushroom).WithMany(p => p.Doppelgangers)
                .HasForeignKey(d => d.MushroomId)
                .HasConstraintName("Doppelgangers_MushroomId_fkey");
        });

        modelBuilder.Entity<Mushroom>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Mushrooms_pkey");
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Eatable).HasMaxLength(15);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.StemColor).HasMaxLength(100);
            entity.Property(e => e.StemType).HasMaxLength(30);
            entity.Property(e => e.SynonymousName).HasMaxLength(100);
        });

        modelBuilder.Entity<Paragraph>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Paragraphs_pkey");
            entity.HasIndex(e => e.ArticleId, "fki_Paragraphs_ArticleId_fkey");
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.HasOne(d => d.Article).WithMany(p => p.Paragraphs)
                .HasForeignKey(d => d.ArticleId)
                .HasConstraintName("Paragraphs_ArticleId_fkey");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Roles_pkey");
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(30);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Users_pkey");
            entity.HasIndex(e => e.RoleId, "fki_Users_RoleId_fkey");
            entity.Property(e => e.Id).ValueGeneratedNever();
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