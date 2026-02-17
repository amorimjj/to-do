using Microsoft.EntityFrameworkCore;
using Shared.CQRS;
using Infrastructure.Data;
using Api.DTOs;
using Todo.Models;

namespace Todo.Commands;

public record ToggleTodoCommand(Guid Id) : ICommand<TodoResponse?>;

public class ToggleTodoHandler : BaseCommandHandler<ToggleTodoCommand, TodoResponse?>
{
    public ToggleTodoHandler(AppDbContext context) : base(context)
    {
    }

    public override async Task<TodoResponse?> HandleAsync(ToggleTodoCommand command, CancellationToken ct = default)
    {
        var todo = await _context.TodoItems.FindAsync(new object[] { command.Id }, ct);

        if (todo == null) return null;

        todo.IsCompleted = !todo.IsCompleted;

        await _context.SaveChangesAsync(ct);

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
