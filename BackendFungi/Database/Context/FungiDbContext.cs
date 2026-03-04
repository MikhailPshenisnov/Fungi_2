using BackendFungi.Database.Entities;
using EntityFramework.Exceptions.PostgreSQL;
using Microsoft.EntityFrameworkCore;

namespace BackendFungi.Database.Context;

public partial class FungiDbContext : DbContext
{
    private readonly IConfiguration _configuration;

    public FungiDbContext(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public FungiDbContext(DbContextOptions<FungiDbContext> options, IConfiguration configuration) : base(options)
    {
        _configuration = configuration;
    }

    public virtual DbSet<Article> Articles { get; set; }
    public virtual DbSet<Doppelganger> Doppelgangers { get; set; }
    public virtual DbSet<Mushroom> Mushrooms { get; set; }
    public virtual DbSet<Paragraph> Paragraphs { get; set; }
    public virtual DbSet<Permission> Permissions { get; set; }
    public virtual DbSet<Role> Roles { get; set; }
    public virtual DbSet<RolePermission> RolePermissions { get; set; }
    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<ArticleLike> ArticleLikes { get; set; }
    public virtual DbSet<MushroomLike> MushroomLikes { get; set; }
    public virtual DbSet<ArticleMushroom> ArticleMushrooms { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(_configuration.GetConnectionString("FungiDbContext"))
            .UseExceptionProcessor();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Article>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Articles_pkey");
            entity.HasIndex(e => e.Title, "articles_unique_title").IsUnique();
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.AuthorString).HasMaxLength(128);
            entity.Property(e => e.ExtraPhotoLinks).HasMaxLength(1024);
            entity.Property(e => e.HeaderPhotoLink).HasMaxLength(256);
            entity.Property(e => e.Title).HasMaxLength(256);
        });

        modelBuilder.Entity<Doppelganger>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Doppelgangers_pkey");
            entity.HasIndex(e => e.MushroomId, "fki_Doppelgangers_MushroomId_fkey");
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.DoppelgangerName).HasMaxLength(128);
            entity.HasOne(d => d.Mushroom).WithMany(p => p.Doppelgangers)
                .HasForeignKey(d => d.MushroomId)
                .HasConstraintName("Doppelgangers_MushroomId_fkey");
        });

        modelBuilder.Entity<Mushroom>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Mushrooms_pkey");
            entity.HasIndex(e => e.Name, "mushrooms_unique_name").IsUnique();
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.CapColor).HasMaxLength(64);
            entity.Property(e => e.CapType).HasMaxLength(64);
            entity.Property(e => e.CapUndersideType).HasMaxLength(64);
            entity.Property(e => e.Eatable).HasMaxLength(16);
            entity.Property(e => e.ExtraPhotoLinks).HasMaxLength(1024);
            entity.Property(e => e.Family).HasMaxLength(128);
            entity.Property(e => e.HeaderPhotoLink).HasMaxLength(256);
            entity.Property(e => e.LatinName).HasMaxLength(128);
            entity.Property(e => e.Name).HasMaxLength(128);
            entity.Property(e => e.StemColor).HasMaxLength(64);
            entity.Property(e => e.StemType).HasMaxLength(64);
            entity.Property(e => e.SynonymousName).HasMaxLength(128);
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

        modelBuilder.Entity<Permission>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Permissions_pkey");
            entity.HasIndex(e => e.Code, "permissions_unique_code").IsUnique();
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Code).HasMaxLength(128);
            entity.Property(e => e.Name).HasMaxLength(64);
            entity.Property(e => e.Description).HasMaxLength(512);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Roles_pkey");
            entity.HasIndex(e => e.Name, "roles_unique_name").IsUnique();
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(32);
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => new { e.RoleId, e.PermissionId }).HasName("RolePermissions_pkey");
            entity.HasIndex(e => e.RoleId, "fki_RolePermissions_RoleId_fkey");
            entity.HasIndex(e => e.PermissionId, "fki_RolePermissions_PermissionId_fkey");

            entity.HasOne(d => d.Role)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("RolePermissions_RoleId_fkey");

            entity.HasOne(d => d.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.PermissionId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("RolePermissions_PermissionId_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Users_pkey");
            entity.HasIndex(e => e.RoleId, "fki_Users_RoleId_fkey");
            entity.HasIndex(e => e.Email, "users_unique_email").IsUnique();
            entity.HasIndex(e => e.Username, "users_unique_username").IsUnique();
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.AvatarPath).HasMaxLength(512);
            entity.Property(e => e.Email).HasMaxLength(128);
            entity.Property(e => e.PasswordHash).HasMaxLength(128);
            entity.Property(e => e.Username).HasMaxLength(128);
            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("Users_RoleId_fkey");
        });
        
        modelBuilder.Entity<ArticleLike>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("ArticleLikes_pkey");
            entity.HasIndex(e => e.ArticleId, "fki_ArticleLikes_ArticleId_fkey");
            entity.HasIndex(e => e.UserId, "fki_ArticleLikes_UserId_fkey");
            entity.Property(e => e.Id).ValueGeneratedNever();
        
            entity.HasOne(d => d.Article)
                .WithMany()
                .HasForeignKey(d => d.ArticleId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("ArticleLikes_ArticleId_fkey");
            
            entity.HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("ArticleLikes_UserId_fkey");
            
            entity.HasIndex(e => new { e.ArticleId, e.UserId }, "article_likes_unique_user_article").IsUnique();
        });

        modelBuilder.Entity<MushroomLike>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("MushroomLikes_pkey");
            entity.HasIndex(e => e.MushroomId, "fki_MushroomLikes_MushroomId_fkey");
            entity.HasIndex(e => e.UserId, "fki_MushroomLikes_UserId_fkey");
            entity.Property(e => e.Id).ValueGeneratedNever();
        
            entity.HasOne(d => d.Mushroom)
                .WithMany()
                .HasForeignKey(d => d.MushroomId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("MushroomLikes_MushroomId_fkey");
            
            entity.HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("MushroomLikes_UserId_fkey");
            
            entity.HasIndex(e => new { e.MushroomId, e.UserId }, "mushroom_likes_unique_user_mushroom").IsUnique();
        });

        modelBuilder.Entity<ArticleMushroom>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("ArticleMushrooms_pkey");
            entity.HasIndex(e => e.ArticleId, "fki_ArticleMushrooms_ArticleId_fkey");
            entity.HasIndex(e => e.MushroomId, "fki_ArticleMushrooms_MushroomId_fkey");
            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.HasOne(d => d.Article)
                .WithMany()
                .HasForeignKey(d => d.ArticleId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("ArticleMushrooms_ArticleId_fkey");

            entity.HasOne(d => d.Mushroom)
                .WithMany()
                .HasForeignKey(d => d.MushroomId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("ArticleMushrooms_MushroomId_fkey");

            entity.HasIndex(e => new { e.ArticleId, e.MushroomId })
                .IsUnique()
                .HasDatabaseName("article_mushroom_unique");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
