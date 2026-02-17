using Microsoft.EntityFrameworkCore;
using Shared.CQRS;
using Infrastructure.Data;
using Api.DTOs;
using Todo.Models;

namespace Todo.Queries;

public record GetTodoByIdQuery(Guid Id) : IQuery<TodoResponse?>;

public class GetTodoByIdHandler : BaseQueryHandler<GetTodoByIdQuery, TodoResponse?>
{
    public GetTodoByIdHandler(AppDbContext context) : base(context)
    {
    }

    public override async Task<TodoResponse?> HandleAsync(GetTodoByIdQuery query, CancellationToken ct = default)
    {
        var todo = await _context.TodoItems
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == query.Id, ct);

        if (todo == null) return null;

        return new TodoResponse(
            todo.Id,
            todo.Title,
            todo.Description,
            todo.IsCompleted,
            todo.Priority,
            todo.DueDate,
            todo.CreatedAt,
            todo.UpdatedAt
        );
    }
}
