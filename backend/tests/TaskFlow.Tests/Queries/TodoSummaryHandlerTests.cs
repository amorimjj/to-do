using NUnit.Framework;
using Todo.Queries;
using Todo.Models;
using TaskFlow.Tests.Helpers;
using Infrastructure.Data;

namespace TaskFlow.Tests.Queries;

[TestFixture]
public class TodoSummaryHandlerTests
{
    private AppDbContext _context;
    private TodoSummaryHandler _handler;

    [SetUp]
    public void SetUp()
    {
        _context = DbContextFactory.Create();
        _handler = new TodoSummaryHandler(_context);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }

    [Test]
    public async Task HandleAsync_EmptyDatabase_ReturnsZeroCounts()
    {
        // Arrange
        var query = new TodoSummaryQuery();

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        Assert.That(result.TotalCount, Is.EqualTo(0));
        Assert.That(result.CompletedCount, Is.EqualTo(0));
        Assert.That(result.PendingCount, Is.EqualTo(0));
    }

    [Test]
    public async Task HandleAsync_WithMixedTasks_ReturnsCorrectCounts()
    {
        // Arrange
        var todos = new List<TodoItem>
        {
            new TodoItem { Id = Guid.NewGuid(), Title = "A", IsCompleted = true, Priority = Priority.Medium, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new TodoItem { Id = Guid.NewGuid(), Title = "B", IsCompleted = false, Priority = Priority.Low, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new TodoItem { Id = Guid.NewGuid(), Title = "C", IsCompleted = true, Priority = Priority.High, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
        };
        _context.TodoItems.AddRange(todos);
        await _context.SaveChangesAsync();

        var query = new TodoSummaryQuery();

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        Assert.That(result.TotalCount, Is.EqualTo(3));
        Assert.That(result.CompletedCount, Is.EqualTo(2));
        Assert.That(result.PendingCount, Is.EqualTo(1));
    }
}
