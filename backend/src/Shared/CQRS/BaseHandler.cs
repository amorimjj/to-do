using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Shared.CQRS;

public abstract class BaseHandler
{
    protected readonly AppDbContext _context;

    protected BaseHandler(AppDbContext context)
    {
        _context = context;
    }
}
