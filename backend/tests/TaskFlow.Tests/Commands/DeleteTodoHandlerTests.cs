using NUnit.Framework;
using TaskFlow.Todo.Commands;
using TaskFlow.Todo.Models;
using TaskFlow.Tests.Helpers;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Tests.Commands;

[TestFixture]
public class DeleteTodoHandlerTests
{
    private AppDbContext _context;
    private DeleteTodoHandler _handler;

    [SetUp]
    public void SetUp()
    {
        _context = DbContextFactory.Create();
        _handler = new DeleteTodoHandler(_context);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }

    [Test]
    public async Task HandleAsync_ExistingTodo_DeletesAndReturnsTrue()
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

        var command = new DeleteTodoCommand(todo.Id);

        // Act
        var result = await _handler.HandleAsync(command);

        // Assert
        Assert.That(result, Is.True);

        var dbTodo = await _context.TodoItems.FindAsync(todo.Id);
        Assert.That(dbTodo, Is.Null);
    }

    [Test]
    public async Task HandleAsync_NonExistingTodo_ReturnsFalse()
    {
        // Arrange
        var command = new DeleteTodoCommand(Guid.NewGuid());

        // Act
        var result = await _handler.HandleAsync(command);

        // Assert
        Assert.That(result, Is.False);
    }
}
