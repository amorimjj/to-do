using TaskFlow.Todo.Models;

namespace TaskFlow.Api.DTOs;

public record CreateTodoRequest(
    string Title,
    string? Description,
    Priority Priority,
    DateTime? DueDate
);

public record UpdateTodoRequest(
    string Title,
    string? Description,
    Priority Priority,
    DateTime? DueDate,
    bool IsCompleted
);
