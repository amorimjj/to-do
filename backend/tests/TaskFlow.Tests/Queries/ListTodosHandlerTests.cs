using NUnit.Framework;
using TaskFlow.Todo.Queries;
using TaskFlow.Todo.Models;
using TaskFlow.Tests.Helpers;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Tests.Queries;

[TestFixture]
public class ListTodosHandlerTests
{
    private AppDbContext _context;
    private ListTodosHandler _handler;

    [SetUp]
    public void SetUp()
    {
        _context = DbContextFactory.Create();
        _handler = new ListTodosHandler(_context);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }

    [Test]
    public async Task HandleAsync_EmptyDatabase_ReturnsEmptyPagedResponse()
    {
        // Arrange
        var query = new ListTodosQuery();

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        Assert.That(result.Items, Is.Empty);
        Assert.That(result.TotalCount, Is.EqualTo(0));
        Assert.That(result.TotalPages, Is.EqualTo(0));
    }

    [Test]
    public async Task HandleAsync_PopulatedDatabase_ReturnsPagedItems()
    {
        // Arrange
        var todos = Enumerable.Range(1, 15).Select(i => new TodoItem
        {
            Id = Guid.NewGuid(),
            Title = $"Todo {i}",
            IsCompleted = i % 2 == 0,
            Priority = i % 3 == 0 ? Priority.High : Priority.Low,
            CreatedAt = DateTime.UtcNow.AddMinutes(i),
            UpdatedAt = DateTime.UtcNow.AddMinutes(i)
        });
        _context.TodoItems.AddRange(todos);
        await _context.SaveChangesAsync();

        var query = new ListTodosQuery(Page: 1, PageSize: 10);

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        Assert.That(result.Items.Count(), Is.EqualTo(10));
        Assert.That(result.TotalCount, Is.EqualTo(15));
        Assert.That(result.TotalPages, Is.EqualTo(2));
    }

    [Test]
    public async Task HandleAsync_WithFiltering_ReturnsFilteredItems()
    {
        // Arrange
        var todos = new List<TodoItem>
        {
            new TodoItem { Id = Guid.NewGuid(), Title = "A", IsCompleted = true, Priority = Priority.High },
            new TodoItem { Id = Guid.NewGuid(), Title = "B", IsCompleted = false, Priority = Priority.Low },
            new TodoItem { Id = Guid.NewGuid(), Title = "C", IsCompleted = true, Priority = Priority.Low }
        };
        _context.TodoItems.AddRange(todos);
        await _context.SaveChangesAsync();

        var query = new ListTodosQuery(IsCompleted: true);

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        Assert.That(result.Items.Count(), Is.EqualTo(2));
        Assert.That(result.Items.All(t => t.IsCompleted), Is.True);
    }

    [Test]
    public async Task HandleAsync_WithSorting_ReturnsSortedItems()
    {
        // Arrange
        var todos = new List<TodoItem>
        {
            new TodoItem { Id = Guid.NewGuid(), Title = "A", CreatedAt = DateTime.UtcNow.AddMinutes(-5) },
            new TodoItem { Id = Guid.NewGuid(), Title = "C", CreatedAt = DateTime.UtcNow.AddMinutes(-10) },
            new TodoItem { Id = Guid.NewGuid(), Title = "B", CreatedAt = DateTime.UtcNow.AddMinutes(-1) }
        };
        _context.TodoItems.AddRange(todos);
        await _context.SaveChangesAsync();

        var query = new ListTodosQuery(SortBy: "title", SortOrder: "asc");

        // Act
        var result = await _handler.HandleAsync(query);

        // Assert
        var resultList = result.Items.ToList();
        Assert.That(resultList[0].Title, Is.EqualTo("A"));
        Assert.That(resultList[1].Title, Is.EqualTo("B"));
        Assert.That(resultList[2].Title, Is.EqualTo("C"));
    }

    [Test]
    public async Task HandleAsync_WithSearch_ReturnsMatchingItems()
    {
        // Arrange
        var todos = new List<TodoItem>
        {
            new TodoItem { Id = Guid.NewGuid(), Title = "Buy groceries", CreatedAt = DateTime.UtcNow },
            new TodoItem { Id = Guid.NewGuid(), Title = "Clean the house", CreatedAt = DateTime.UtcNow },
            new TodoItem { Id = Guid.NewGuid(), Title = "Buy milk", CreatedAt = DateTime.UtcNow }
        };
        _context.TodoItems.AddRange(todos);
        await _context.SaveChangesAsync();

        // 1. Exact match
        var query1 = new ListTodosQuery(Search: "Buy groceries");
        var result1 = await _handler.HandleAsync(query1);
        Assert.That(result1.Items.Count(), Is.EqualTo(1));
        Assert.That(result1.Items.First().Title, Is.EqualTo("Buy groceries"));

        // 2. Case-insensitive match
        var query2 = new ListTodosQuery(Search: "buy");
        var result2 = await _handler.HandleAsync(query2);
        Assert.That(result2.Items.Count(), Is.EqualTo(2));
        Assert.That(result2.Items.All(t => t.Title.ToLower().Contains("buy")), Is.True);

        // 3. Partial match
        var query3 = new ListTodosQuery(Search: "gro");
        var result3 = await _handler.HandleAsync(query3);
        Assert.That(result3.Items.Count(), Is.EqualTo(1));
        Assert.That(result3.Items.First().Title, Is.EqualTo("Buy groceries"));

        // 4. No match
        var query4 = new ListTodosQuery(Search: "xyz");
        var result4 = await _handler.HandleAsync(query4);
        Assert.That(result4.Items.Count(), Is.EqualTo(0));

        // 5. Null/empty search
        var query5 = new ListTodosQuery(Search: "");
        var result5 = await _handler.HandleAsync(query5);
        Assert.That(result5.Items.Count(), Is.EqualTo(3));
    }
}
