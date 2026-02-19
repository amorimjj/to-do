using System.Reflection;
using Microsoft.FeatureManagement;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Shared.CQRS;
using TaskFlow.Api.Middleware;
using FluentValidation;
using FluentValidation.AspNetCore;
using TaskFlow.Infrastructure.Data;
using TaskFlow.Api.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

builder.Services.AddRouting(options => options.LowercaseUrls = true);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "TaskFlow API", Version = "v1" });
    c.DocumentFilter<FeatureGateDocumentFilter>();
});

// DbContext configuration based on environment
var environment = builder.Environment.EnvironmentName;
var connectionString = environment == "E2E" 
    ? "Data Source=todos-e2e.db" 
    : "Data Source=todos.db";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// CQRS auto-registration
builder.Services.AddCQRSHandlers(Assembly.GetExecutingAssembly());

// FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

builder.Services.AddFeatureManagement(); 

// CORS
var frontendUrl = builder.Configuration["FRONTEND_URL"] ?? "http://localhost:3000";

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(frontendUrl)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.EnvironmentName == "E2E")
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

// Database initialization
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();

    if (args.Contains("--seed"))
    {
        Console.WriteLine("🌱 Seeding database...");
        await DatabaseSeeder.SeedAsync(context);
        Console.WriteLine("✅ Database seeded successfully.");
        return;
    }
}

app.Run();
