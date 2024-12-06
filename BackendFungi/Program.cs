using BackendFungi.Abstractions;
using BackendFungi.Database.Context;
using BackendFungi.Database.Repositories;
using BackendFungi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Our services for controllers
builder.Services.AddTransient<IArticlesService, ArticlesService>();
builder.Services.AddTransient<IMushroomsService, MushroomsService>();

// Our services for repositories
builder.Services.AddTransient<IArticlesRepository, ArticlesRepository>();
builder.Services.AddTransient<IParagraphsRepository, ParagraphsRepository>();
builder.Services.AddTransient<IMushroomsRepository, MushroomsRepository>();
builder.Services.AddTransient<IDoppelgangersRepository, DoppelgangersRepository>();

// Database context
builder.Services.AddDbContext<FungiDbContext>();

// CORS settings
builder.Services.AddCors(options => options.AddPolicy
    (
        "FungiApiPolicy", b => b
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
    )
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();