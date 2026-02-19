using TaskFlow.Todo.Models;

namespace TaskFlow.Infrastructure.Data;

public static class TodoDataGenerator
{
    private static readonly string[] Titles = 
    {
        "Review quarterly sales report",
        "Set up CI/CD pipeline",
        "Prepare onboarding materials",
        "Update documentation for API",
        "Weekly team meeting",
        "Fix UI bugs in dashboard",
        "Implement user authentication",
        "Refactor database access layer",
        "Design new landing page",
        "Perform security audit",
        "Analyze customer feedback",
        "Plan product roadmap",
        "Conduct user interviews",
        "Write unit tests for checkout flow",
        "Optimize frontend performance",
        "Deploy new release to production",
        "Research new technologies",
        "Coordinate with marketing team",
        "Review pull requests",
        "Fix priority 1 bugs",
        "Update dependency packages",
        "Improve accessibility",
        "Migrate legacy data",
        "Document server configuration",
        "Configure cloud monitoring",
        "Train new hires",
        "Organize team social event",
        "Analyze competitors",
        "Refine project scope",
        "Estimate upcoming tasks",
        "Conduct performance reviews",
        "Prepare for stakeholder presentation",
        "Clean up codebase",
        "Update user permissions",
        "Implement dark mode support",
        "Research SEO strategies",
        "Test cross-browser compatibility",
        "Setup analytics dashboard",
        "Create marketing assets",
        "Optimize database queries"
    };

    private static readonly string[] Descriptions = 
    {
        "Focus on sales growth and key metrics from Q4.",
        "Automate deployment process to staging environment.",
        "Ensure all new team members have necessary hardware and access.",
        "Complete the Swagger documentation for all endpoints.",
        "Discuss project progress, blockers, and next steps.",
        "Address the alignment issues in the task list component.",
        "Add JWT-based authentication for the API.",
        "Move all SQL queries to repository pattern.",
        "Modernize the look and feel using TailwindCSS.",
        "Identify and fix potential vulnerabilities.",
        "Summarize common pain points and feature requests.",
        "Prioritize features for the next 6 months.",
        "Gather insights on how users interact with the dashboard.",
        "Aim for 90% code coverage in critical paths.",
        "Reduce bundle size and improve Core Web Vitals.",
        "Ensure zero-downtime deployment.",
        "Evaluate different state management libraries.",
        "Align product messaging across all channels.",
        "Ensure code quality and consistency.",
        "High-impact bugs affecting critical functionality."
    };

    public static List<TodoItem> Generate(int count = 75)
    {
        var random = new Random(42);
        var items = new List<TodoItem>();
        // Set 'now' to the last day (Sunday) of the current week in UTC
        var today = DateTime.UtcNow.Date;
        var daysUntilEndOfWeek = DayOfWeek.Sunday - today.DayOfWeek;
        if (daysUntilEndOfWeek < 0)
            daysUntilEndOfWeek += 7; // Wrap around if today is after Sunday in enum order
        var now = today.AddDays(daysUntilEndOfWeek).AddDays(1).AddTicks(-1); // End of Sunday (23:59:59.9999999)

        for (int i = 0; i < count; i++)
        {
            var title = Titles[random.Next(Titles.Length)];
            if (count > Titles.Length)
            {
                title = $"{title} #{i + 1}";
            }

            var hasDescription = random.NextDouble() < 0.6;
            var description = hasDescription ? Descriptions[random.Next(Descriptions.Length)] : null;

            var priorityValue = random.NextDouble();
            var priority = priorityValue < 0.2 ? Priority.High : 
                           priorityValue < 0.55 ? Priority.Medium : 
                           Priority.Low;

            var isCompleted = random.NextDouble() < 0.4;

            // CreatedAt spread over last 10 days
            var createdDaysAgo = random.Next(11);
            // Ensure createdAt is never in the future (at or before 'now')
            var candidateCreatedAt = now.AddDays(-createdDaysAgo).AddMinutes(random.Next(1440));
            var createdAt = candidateCreatedAt > DateTime.UtcNow ? DateTime.UtcNow : candidateCreatedAt;
            createdAt = createdAt.AddDays(-2);

            // DueDate spread over past 3 days to future 14 days
            var hasDueDate = random.NextDouble() < 0.7;
            DateTime? dueDate = null;
            if (hasDueDate)
            {
                var dueInDays = random.Next(-3, 15);
                dueDate = now.Date.AddDays(dueInDays);
            }

            var item = new TodoItem
            {
                Id = Guid.NewGuid(),
                Title = title,
                Description = description,
                Priority = priority,
                IsCompleted = isCompleted,
                CreatedAt = createdAt,
                UpdatedAt = createdAt,
                DueDate = dueDate
            };

            items.Add(item);
        }

        return items;
    }
}
