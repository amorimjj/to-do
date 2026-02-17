using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Shared.CQRS;
using Infrastructure.Data;
using Api.DTOs;
using Todo.Models;

namespace Todo.Commands;

public record CreateTodoCommand(
    string Title,
    string? Description,
    Priority Priority,
    DateTime? DueDate
) : ICommand<TodoResponse>;

public class CreateTodoValidator : AbstractValidator<CreateTodoCommand>
{
    public CreateTodoValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(1000);
        RuleFor(x => x.Priority).IsInEnum();
    }
}

public class CreateTodoHandler : BaseCommandHandler<CreateTodoCommand, TodoResponse>
{
    public CreateTodoHandler(AppDbContext context) : base(context)
    {
    }

    public override async Task<TodoResponse> HandleAsync(CreateTodoCommand command, CancellationToken ct = default)
    {
        var todo = new TodoItem
        {
            Id = Guid.NewGuid(),
            Title = command.Title,
            Description = command.Description,
            Priority = command.Priority,
            DueDate = command.DueDate,
            IsCompleted = false
        };

        _context.TodoItems.Add(todo);
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
