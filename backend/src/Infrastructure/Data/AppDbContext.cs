using Microsoft.EntityFrameworkCore;
using TaskFlow.Todo.Models;
using System.Reflection;

namespace TaskFlow.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<TodoItem> TodoItems => Set<TodoItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.Entity is TodoItem && (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entry in entries)
        {
            var entity = (TodoItem)entry.Entity;
            
            if (entry.State == EntityState.Added)
            {
                if (entity.CreatedAt == default)
                {
                    entity.CreatedAt = DateTime.UtcNow;
                }
                
                if (entity.UpdatedAt == default)
                {
                    entity.UpdatedAt = entity.CreatedAt;
                }
            }
            else if (entry.State == EntityState.Modified)
            {
                entity.UpdatedAt = DateTime.UtcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
