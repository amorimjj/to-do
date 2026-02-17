using NUnit.Framework;
using Todo.Commands;
using Todo.Models;
using TaskFlow.Tests.Helpers;
using Infrastructure.Data;

namespace TaskFlow.Tests.Commands;

[TestFixture]
public class CreateTodoHandlerTests
{
    private AppDbContext _context;
    private CreateTodoHandler _handler;

    [SetUp]
    public void SetUp()
    {
        _context = DbContextFactory.Create();
        _handler = new CreateTodoHandler(_context);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }

    [Test]
    public async Task HandleAsync_ValidCommand_CreatesTodoAndReturnsResponse()
    {
        // Arrange
        var command = new CreateTodoCommand("Test Todo", "Test Description", Priority.High, DateTime.UtcNow.AddDays(1));

        // Act
        var result = await _handler.HandleAsync(command);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Title, Is.EqualTo(command.Title));
        Assert.That(result.Description, Is.EqualTo(command.Description));
        Assert.That(result.Priority, Is.EqualTo(command.Priority));
        Assert.That(result.DueDate, Is.EqualTo(command.DueDate));
        Assert.That(result.IsCompleted, Is.False);

        var dbTodo = await _context.TodoItems.FindAsync(result.Id);
        Assert.That(dbTodo, Is.Not.Null);
        Assert.That(dbTodo.Title, Is.EqualTo(command.Title));
    }
}
