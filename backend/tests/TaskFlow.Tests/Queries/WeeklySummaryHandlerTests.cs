using NUnit.Framework;
using Todo.Queries;
using Todo.Models;
using TaskFlow.Tests.Helpers;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TaskFlow.Tests.Queries;

[TestFixture]
public class WeeklySummaryHandlerTests
{
    private AppDbContext _context;
    private WeeklySummaryHandler _handler;

    [SetUp]
    public void SetUp()
    {
        _context = DbContextFactory.Create();
        _handler = new WeeklySummaryHandler(_context);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }

    [Test]
    public async Task HandleAsync_EmptyDatabase_ReturnsAllZeros()
    {
        // Act
        var result = await _handler.HandleAsync(new WeeklySummaryQuery());

        // Assert
        Assert.That(result.Sunday.Total, Is.EqualTo(0));
        Assert.That(result.Monday.Total, Is.EqualTo(0));
        Assert.That(result.Tuesday.Total, Is.EqualTo(0));
        Assert.That(result.Wednesday.Total, Is.EqualTo(0));
        Assert.That(result.Thursday.Total, Is.EqualTo(0));
        Assert.That(result.Friday.Total, Is.EqualTo(0));
        Assert.That(result.Saturday.Total, Is.EqualTo(0));
    }

    [Test]
    public async Task HandleAsync_WithTodosInCurrentWeek_ReturnsCorrectSummaries()
    {
        // Arrange
        var now = DateTime.UtcNow;
        var diff = (7 + (now.DayOfWeek - DayOfWeek.Sunday)) % 7;
        var startOfWeek = now.Date.AddDays(-1 * diff);

        // Sunday: 1 completed, 1 total
        // Monday: 2 completed, 3 total
        // Today: depends on DayOfWeek, but let's just pick days relative to Sunday

        var todos = new List<TodoItem>
        {
            // Sunday
            new TodoItem { Id = Guid.NewGuid(), Title = "S1", IsCompleted = true, CreatedAt = startOfWeek.AddHours(10) },
            
            // Monday
            new TodoItem { Id = Guid.NewGuid(), Title = "M1", IsCompleted = true, CreatedAt = startOfWeek.AddDays(1).AddHours(10) },
            new TodoItem { Id = Guid.NewGuid(), Title = "M2", IsCompleted = true, CreatedAt = startOfWeek.AddDays(1).AddHours(11) },
            new TodoItem { Id = Guid.NewGuid(), Title = "M3", IsCompleted = false, CreatedAt = startOfWeek.AddDays(1).AddHours(12) },

            // Outside week (previous Saturday)
            new TodoItem { Id = Guid.NewGuid(), Title = "Prev", IsCompleted = true, CreatedAt = startOfWeek.AddDays(-1) },

            // Outside week (next Sunday)
            new TodoItem { Id = Guid.NewGuid(), Title = "Next", IsCompleted = true, CreatedAt = startOfWeek.AddDays(7) }
        };

        _context.TodoItems.AddRange(todos);
        _context.SaveChanges(); // Use SaveChanges to avoid CreatedAt override

        // Act
        var result = await _handler.HandleAsync(new WeeklySummaryQuery());

        // Assert
        Assert.That(result.Sunday.Total, Is.EqualTo(1));
        Assert.That(result.Sunday.Completed, Is.EqualTo(1));

        Assert.That(result.Monday.Total, Is.EqualTo(3));
        Assert.That(result.Monday.Completed, Is.EqualTo(2));

        // Other days should be zero
        Assert.That(result.Tuesday.Total, Is.EqualTo(0));
    }
}
