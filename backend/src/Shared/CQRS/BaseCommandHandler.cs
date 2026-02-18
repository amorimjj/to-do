using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Shared.CQRS;

public abstract class BaseCommandHandler<TCommand, TResult> : BaseHandler, ICommandHandler<TCommand, TResult>
    where TCommand : ICommand<TResult>
{
    protected BaseCommandHandler(AppDbContext context) : base(context)
    {
    }

    public abstract Task<TResult> HandleAsync(TCommand command, CancellationToken ct = default);
}
