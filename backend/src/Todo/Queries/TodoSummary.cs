using Microsoft.EntityFrameworkCore;
using TaskFlow.Shared.CQRS;
using TaskFlow.Infrastructure.Data;
using TaskFlow.Todo.Models;

namespace TaskFlow.Todo.Queries;

public record TodoSummaryQuery : IQuery<TodoSummaryResponse>;

public class TodoSummaryHandler : BaseQueryHandler<TodoSummaryQuery, TodoSummaryResponse>
{
    public TodoSummaryHandler(AppDbContext context) : base(context)
    {
    }

    public override async Task<TodoSummaryResponse> HandleAsync(TodoSummaryQuery query, CancellationToken ct = default)
    {
        var totalCount = await _context.TodoItems.AsNoTracking().CountAsync(ct);
        var completedCount = await _context.TodoItems.AsNoTracking().CountAsync(t => t.IsCompleted, ct);
        var pendingCount = totalCount - completedCount;

        return new TodoSummaryResponse(totalCount, completedCount, pendingCount);
    }
}
