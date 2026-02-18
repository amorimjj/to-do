using Microsoft.EntityFrameworkCore;
using TaskFlow.Shared.CQRS;
using TaskFlow.Infrastructure.Data;
using TaskFlow.Todo.Models;

namespace TaskFlow.Todo.Commands;

public record DeleteTodoCommand(Guid Id) : ICommand<bool>;

public class DeleteTodoHandler : BaseCommandHandler<DeleteTodoCommand, bool>
{
    public DeleteTodoHandler(AppDbContext context) : base(context)
    {
    }

    public override async Task<bool> HandleAsync(DeleteTodoCommand command, CancellationToken ct = default)
    {
        var todo = await _context.TodoItems.FindAsync(new object[] { command.Id }, ct);

        if (todo == null) return false;

        _context.TodoItems.Remove(todo);
        await _context.SaveChangesAsync(ct);

        return true;
    }
}
