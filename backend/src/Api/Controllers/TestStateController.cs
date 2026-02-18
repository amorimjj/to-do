using Microsoft.FeatureManagement.Mvc;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Infrastructure.Data;
using TaskFlow.Todo.Models;

namespace TaskFlow.Api.Controllers;

[ApiController]
[Route("api/test")]
[FeatureGate("IncludeTestStateController")]
public class TestStateController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public TestStateController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpPost("reset")]
    public async Task<IActionResult> Reset([FromBody] IEnumerable<TodoItem>? seedData = null)
    {
        // Safety check to only allow this in E2E environment
        if (_env.EnvironmentName != "E2E")
        {
            return Forbid();
        }

        await _context.Database.EnsureDeletedAsync();
        await _context.Database.EnsureCreatedAsync();

        if (seedData != null && seedData.Any())
        {
            _context.TodoItems.AddRange(seedData);
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = "Database reset and seeded" });
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "healthy", environment = _env.EnvironmentName });
    }
}
