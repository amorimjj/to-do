namespace TaskFlow.Todo.Models;

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

public record TodoSummaryResponse(
    int TotalCount,
    int CompletedCount,
    int PendingCount
);

public record DaySummary(int Total, int Completed);

public record WeeklySummaryResponse(
    DaySummary Sunday,
    DaySummary Monday,
    DaySummary Tuesday,
    DaySummary Wednesday,
    DaySummary Thursday,
    DaySummary Friday,
    DaySummary Saturday
);
