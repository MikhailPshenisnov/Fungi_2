using System;
using System.Collections.Generic;
using BackendFungi.Entities;
using Microsoft.EntityFrameworkCore;

namespace BackendFungi.Context;

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

    public virtual DbSet<Mushroom> Mushrooms { get; set; }

    public virtual DbSet<Paragraph> Paragraphs { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql(_configuration["ConnectionString"]);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Article>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Articles_pkey");

            entity.Property(e => e.Title).HasMaxLength(255);
        });

        modelBuilder.Entity<Mushroom>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Mushrooms_pkey");

            entity.Property(e => e.Eatable).HasMaxLength(15);
            entity.Property(e => e.Name).HasMaxLength(30);
            entity.Property(e => e.SteamColor).HasMaxLength(100);
            entity.Property(e => e.StemType).HasMaxLength(30);
            entity.Property(e => e.SynonymousName).HasMaxLength(100);

            entity.HasMany(d => d.Doppelgangers).WithMany(p => p.Mushrooms)
                .UsingEntity<Dictionary<string, object>>(
                    "MushroomDoppelganger",
                    r => r.HasOne<Mushroom>().WithMany()
                        .HasForeignKey("DoppelgangerId")
                        .HasConstraintName("fk_doppelganger"),
                    l => l.HasOne<Mushroom>().WithMany()
                        .HasForeignKey("MushroomId")
                        .HasConstraintName("fk_mushroom"),
                    j =>
                    {
                        j.HasKey("MushroomId", "DoppelgangerId").HasName("MushroomDoppelgangers_pkey");
                        j.ToTable("MushroomDoppelgangers");
                    });

            entity.HasMany(d => d.Mushrooms).WithMany(p => p.Doppelgangers)
                .UsingEntity<Dictionary<string, object>>(
                    "MushroomDoppelganger",
                    r => r.HasOne<Mushroom>().WithMany()
                        .HasForeignKey("MushroomId")
                        .HasConstraintName("fk_mushroom"),
                    l => l.HasOne<Mushroom>().WithMany()
                        .HasForeignKey("DoppelgangerId")
                        .HasConstraintName("fk_doppelganger"),
                    j =>
                    {
                        j.HasKey("MushroomId", "DoppelgangerId").HasName("MushroomDoppelgangers_pkey");
                        j.ToTable("MushroomDoppelgangers");
                    });
        });

        modelBuilder.Entity<Paragraph>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Paragraphs_pkey");

            entity.HasOne(d => d.Article).WithMany(p => p.Paragraphs)
                .HasForeignKey(d => d.ArticleId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("Paragraphs_ArticleId_fkey");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Roles_pkey");

            entity.HasIndex(e => e.Name, "Roles_Name_key").IsUnique();

            entity.Property(e => e.Name).HasMaxLength(30);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Users_pkey");

            entity.HasIndex(e => e.Email, "Users_Email_key").IsUnique();

            entity.HasIndex(e => e.Username, "Users_Username_key").IsUnique();

            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Username).HasMaxLength(255);

            entity.HasOne(d => d.RoleNavigation).WithMany(p => p.Users)
                .HasForeignKey(d => d.Role)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("Users_Role_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
