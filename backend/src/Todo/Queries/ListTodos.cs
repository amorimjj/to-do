using Microsoft.EntityFrameworkCore;
using TaskFlow.Shared.CQRS;
using TaskFlow.Infrastructure.Data;
using TaskFlow.Shared;
using TaskFlow.Todo.Models;

namespace TaskFlow.Todo.Queries;

public record ListTodosQuery(
    int Page = 1,
    int PageSize = 10,
    bool? IsCompleted = null,
    Priority? Priority = null,
    string? SortBy = null,
    string SortOrder = "desc"
) : IQuery<PagedResponse<TodoResponse>>;

public class ListTodosHandler : BaseQueryHandler<ListTodosQuery, PagedResponse<TodoResponse>>
{
    public ListTodosHandler(AppDbContext context) : base(context)
    {
    }

    public override async Task<PagedResponse<TodoResponse>> HandleAsync(ListTodosQuery query, CancellationToken ct = default)
    {
        var dbQuery = _context.TodoItems.AsNoTracking();

        // Filtering
        if (query.IsCompleted.HasValue)
        {
            dbQuery = dbQuery.Where(t => t.IsCompleted == query.IsCompleted.Value);
        }

        if (query.Priority.HasValue)
        {
            dbQuery = dbQuery.Where(t => t.Priority == query.Priority.Value);
        }

        // Sorting
        bool isDescending = query.SortOrder.ToLower() == "desc";
        dbQuery = query.SortBy?.ToLower() switch
        {
            "title" => isDescending ? dbQuery.OrderByDescending(t => t.Title) : dbQuery.OrderBy(t => t.Title),
            "duedate" => isDescending ? dbQuery.OrderByDescending(t => t.DueDate) : dbQuery.OrderBy(t => t.DueDate),
            "priority" => isDescending ? dbQuery.OrderByDescending(t => t.Priority) : dbQuery.OrderBy(t => t.Priority),
            "createdat" => isDescending ? dbQuery.OrderByDescending(t => t.CreatedAt) : dbQuery.OrderBy(t => t.CreatedAt),
            _ => isDescending ? dbQuery.OrderByDescending(t => t.CreatedAt) : dbQuery.OrderBy(t => t.CreatedAt)
        };

        // Pagination
        var totalCount = await dbQuery.CountAsync(ct);
        var totalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize);
        
        var items = await dbQuery
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(t => new TodoResponse(
                t.Id,
                t.Title,
                t.Description,
                t.IsCompleted,
                t.Priority,
                t.DueDate,
                t.CreatedAt,
                t.UpdatedAt
            ))
            .ToListAsync(ct);

        return new PagedResponse<TodoResponse>(
            items,
            query.Page,
            query.PageSize,
            totalCount,
            totalPages
        );
    }
}
