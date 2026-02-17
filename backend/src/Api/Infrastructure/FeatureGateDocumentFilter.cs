using Microsoft.FeatureManagement;
using Microsoft.FeatureManagement.Mvc;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Infrastructure;

public class FeatureGateDocumentFilter : IDocumentFilter
{
    private readonly IFeatureManager _featureManager;

    public FeatureGateDocumentFilter(IFeatureManager featureManager)
    {
        _featureManager = featureManager;
    }

    public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
    {
        foreach (var apiDescription in context.ApiDescriptions)
        {
            var featureGate = apiDescription.ActionDescriptor.EndpointMetadata
                .OfType<FeatureGateAttribute>()
                .FirstOrDefault();

            if (featureGate != null)
            {
                foreach (var feature in featureGate.Features)
                {
                    var isEnabled = Task.Run(() => _featureManager.IsEnabledAsync(feature)).GetAwaiter().GetResult();

                    if (!isEnabled)
                    {
                        var route = "/" + apiDescription.RelativePath?.TrimEnd('/');
                        if (route != null)
                        {
                            swaggerDoc.Paths.Remove(route);
                        }
                        break;
                    }
                }
            }
        }
    }
}
