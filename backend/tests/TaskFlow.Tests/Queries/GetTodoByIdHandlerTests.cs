using NUnit.Framework;
using Todo.Queries;
using Todo.Models;
using TaskFlow.Tests.Helpers;
using Infrastructure.Data;

namespace TaskFlow.Tests.Queries;

[TestFixture]
public class GetTodoByIdHandlerTests
{
    private AppDbContext _context;
    private GetTodoByIdHandler _handler;

    [SetUp]
    public void SetUp()
    {
        _context = DbContextFactory.Create();
        _handler = new GetTodoByIdHandler(_context);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }

    [Test]
    public async Task HandleAsync_ExistingTodo_ReturnsTodo()
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

        var query = new GetTodoByIdQuery(todo.Id);

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Id, Is.EqualTo(todo.Id));
        Assert.That(result.Title, Is.EqualTo(todo.Title));
    }

    [Test]
    public async Task HandleAsync_NonExistingTodo_ReturnsNull()
    {
        // Arrange
        var query = new GetTodoByIdQuery(Guid.NewGuid());

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        Assert.That(result, Is.Null);
    }
}
