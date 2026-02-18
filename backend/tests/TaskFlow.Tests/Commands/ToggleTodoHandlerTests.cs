using NUnit.Framework;
using TaskFlow.Todo.Commands;
using TaskFlow.Todo.Models;
using TaskFlow.Tests.Helpers;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Tests.Commands;

[TestFixture]
public class ToggleTodoHandlerTests
{
    private AppDbContext _context;
    private ToggleTodoHandler _handler;

    [SetUp]
    public void SetUp()
    {
        _context = DbContextFactory.Create();
        _handler = new ToggleTodoHandler(_context);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }

    [Test]
    public async Task HandleAsync_ExistingTodo_TogglesIsCompleted()
    {
        // Arrange
        var todo = new TodoItem
        {
            Id = Guid.NewGuid(),
            Title = "Test Todo",
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _context.TodoItems.Add(todo);
        await _context.SaveChangesAsync();

        var command = new ToggleTodoCommand(todo.Id);

        // Act
        var result = await _handler.HandleAsync(command);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.IsCompleted, Is.True);

        var dbTodo = await _context.TodoItems.FindAsync(todo.Id);
        Assert.That(dbTodo, Is.Not.Null);
        Assert.That(dbTodo.IsCompleted, Is.True);

        // Toggle back
        result = await _handler.HandleAsync(command);
        Assert.That(result, Is.Not.Null);
        Assert.That(result.IsCompleted, Is.False);
    }

    [Test]
    public async Task HandleAsync_NonExistingTodo_ReturnsNull()
    {
        // Arrange
        var command = new ToggleTodoCommand(Guid.NewGuid());

        // Act
        var result = await _handler.HandleAsync(command);

        // Assert
        Assert.That(result, Is.Null);
    }
}
