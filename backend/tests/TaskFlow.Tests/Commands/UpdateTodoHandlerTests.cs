using NUnit.Framework;
using Todo.Commands;
using Todo.Models;
using TaskFlow.Tests.Helpers;
using Infrastructure.Data;

namespace TaskFlow.Tests.Commands;

[TestFixture]
public class UpdateTodoHandlerTests
{
    private AppDbContext _context;
    private UpdateTodoHandler _handler;

    [SetUp]
    public void SetUp()
    {
        _context = DbContextFactory.Create();
        _handler = new UpdateTodoHandler(_context);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }

    [Test]
    public async Task HandleAsync_ExistingTodo_UpdatesAndReturnsResponse()
    {
        // Arrange
        var todo = new TodoItem
        {
            Id = Guid.NewGuid(),
            Title = "Old Title",
            Description = "Old Description",
            Priority = Priority.Low,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _context.TodoItems.Add(todo);
        await _context.SaveChangesAsync();

        var command = new UpdateTodoCommand(todo.Id, "New Title", "New Description", Priority.High, DateTime.UtcNow.AddDays(1), true);

        // Act
        var result = await _handler.HandleAsync(command);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Id, Is.EqualTo(todo.Id));
        Assert.That(result.Title, Is.EqualTo(command.Title));
        Assert.That(result.Description, Is.EqualTo(command.Description));
        Assert.That(result.Priority, Is.EqualTo(command.Priority));
        Assert.That(result.DueDate, Is.EqualTo(command.DueDate));
        Assert.That(result.IsCompleted, Is.True);

        var dbTodo = await _context.TodoItems.FindAsync(todo.Id);
        Assert.That(dbTodo, Is.Not.Null);
        Assert.That(dbTodo.Title, Is.EqualTo(command.Title));
        Assert.That(dbTodo.IsCompleted, Is.True);
    }

    [Test]
    public async Task HandleAsync_NonExistingTodo_ReturnsNull()
    {
        // Arrange
        var command = new UpdateTodoCommand(Guid.NewGuid(), "New Title", "New Description", Priority.High, null, true);

        // Act
        var result = await _handler.HandleAsync(command);

        // Assert
        Assert.That(result, Is.Null);
    }
}
