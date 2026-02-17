using Infrastructure.Data;

namespace Shared.CQRS;

public abstract class BaseQueryHandler<TQuery, TResult> : BaseHandler, IQueryHandler<TQuery, TResult>
    where TQuery : IQuery<TResult>
{
    protected BaseQueryHandler(AppDbContext context) : base(context)
    {
    }

    public abstract Task<TResult> HandleAsync(TQuery query, CancellationToken ct = default);
}
