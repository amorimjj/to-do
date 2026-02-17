using Todo.Models;

namespace Api.DTOs;

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

public record TodoResponse(
    Guid Id,
    string Title,
    string? Description,
    bool IsCompleted,
    Priority Priority,
    DateTime? DueDate,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record PagedResponse<T>(
    IEnumerable<T> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages
);
