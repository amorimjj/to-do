using Microsoft.FeatureManagement.Mvc;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Infrastructure.Data;

namespace TaskFlow.Api.Controllers;

[ApiController]
[Route("api/seed")]
[FeatureGate("IncludeDevOnlyControllers")]
public class SeedController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public SeedController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpPost]
    public async Task<IActionResult> Seed([FromQuery] int count = 75)
    {
        // Safety check: Only allow in Development environment
        if (!_env.IsDevelopment())
        {
            return Forbid();
        }

        await DatabaseSeeder.SeedAsync(_context, count);

        return Ok(new 
        { 
            message = "Database seeded successfully", 
            count = count 
        });
    }
}
