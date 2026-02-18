using FluentValidation;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Shared.CQRS;
using TaskFlow.Infrastructure.Data;
using TaskFlow.Todo.Models;

namespace TaskFlow.Todo.Commands;

public record UpdateTodoCommand(
    Guid Id,
    string Title,
    string? Description,
    Priority Priority,
    DateTime? DueDate,
    bool IsCompleted
) : ICommand<TodoResponse?>;

public class UpdateTodoValidator : AbstractValidator<UpdateTodoCommand>
{
    public UpdateTodoValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(1000);
        RuleFor(x => x.Priority).IsInEnum();
    }
}

public class UpdateTodoHandler : BaseCommandHandler<UpdateTodoCommand, TodoResponse?>
{
    public UpdateTodoHandler(AppDbContext context) : base(context)
    {
    }

    public override async Task<TodoResponse?> HandleAsync(UpdateTodoCommand command, CancellationToken ct = default)
    {
        var todo = await _context.TodoItems.FindAsync(new object[] { command.Id }, ct);

        if (todo == null) return null;

        todo.Title = command.Title;
        todo.Description = command.Description;
        todo.Priority = command.Priority;
        todo.DueDate = command.DueDate;
        todo.IsCompleted = command.IsCompleted;

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
