using Microsoft.EntityFrameworkCore;
using TaskFlow.Todo.Models;

namespace TaskFlow.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext context, int count = 75)
    {
        // Clear existing data
        await context.TodoItems.ExecuteDeleteAsync();

        var items = TodoDataGenerator.Generate(count);
        
        // Add new items
        context.TodoItems.AddRange(items);
        await context.SaveChangesAsync();
    }
}
