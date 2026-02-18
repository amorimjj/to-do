using Microsoft.EntityFrameworkCore;
using Shared.CQRS;
using Infrastructure.Data;
using Api.DTOs;

namespace Todo.Queries;

public record WeeklySummaryQuery : IQuery<WeeklySummaryResponse>;

public class WeeklySummaryHandler : BaseQueryHandler<WeeklySummaryQuery, WeeklySummaryResponse>
{
    public WeeklySummaryHandler(AppDbContext context) : base(context)
    {
    }

    public override async Task<WeeklySummaryResponse> HandleAsync(WeeklySummaryQuery query, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var diff = (7 + (now.DayOfWeek - DayOfWeek.Sunday)) % 7;
        var startOfWeek = now.Date.AddDays(-1 * diff);
        var endOfWeek = startOfWeek.AddDays(7);

        var results = await _context.TodoItems
            .AsNoTracking()
            .Where(t => t.CreatedAt >= startOfWeek && t.CreatedAt < endOfWeek)
            .GroupBy(t => t.CreatedAt.Date)
            .Select(g => new
            {
                Date = g.Key,
                Total = g.Count(),
                Completed = g.Count(t => t.IsCompleted)
            })
            .ToListAsync(ct);

        var summaries = results.ToDictionary(
            r => r.Date.DayOfWeek,
            r => new DaySummary(r.Total, r.Completed)
        );

        return new WeeklySummaryResponse(
            GetSummary(summaries, DayOfWeek.Sunday),
            GetSummary(summaries, DayOfWeek.Monday),
            GetSummary(summaries, DayOfWeek.Tuesday),
            GetSummary(summaries, DayOfWeek.Wednesday),
            GetSummary(summaries, DayOfWeek.Thursday),
            GetSummary(summaries, DayOfWeek.Friday),
            GetSummary(summaries, DayOfWeek.Saturday)
        );
    }

    private static DaySummary GetSummary(Dictionary<DayOfWeek, DaySummary> summaries, DayOfWeek day)
    {
        return summaries.TryGetValue(day, out var summary) ? summary : new DaySummary(0, 0);
    }
}
