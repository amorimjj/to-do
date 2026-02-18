using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace TaskFlow.Shared.CQRS;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddCQRSHandlers(this IServiceCollection services, Assembly assembly)
    {
        // Register Command Handlers
        var commandHandlerType = typeof(ICommandHandler<,>);
        RegisterHandlers(services, assembly, commandHandlerType);

        // Register Query Handlers
        var queryHandlerType = typeof(IQueryHandler<,>);
        RegisterHandlers(services, assembly, queryHandlerType);

        return services;
    }

    private static void RegisterHandlers(IServiceCollection services, Assembly assembly, Type genericHandlerType)
    {
        var handlers = assembly.GetTypes()
            .Where(t => !t.IsAbstract && !t.IsInterface && t.GetInterfaces().Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == genericHandlerType));

        foreach (var handler in handlers)
        {
            var interfaceType = handler.GetInterfaces()
                .First(i => i.IsGenericType && i.GetGenericTypeDefinition() == genericHandlerType);
            
            services.AddScoped(interfaceType, handler);
        }
    }
}
