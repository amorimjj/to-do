using Microsoft.AspNetCore.Mvc;
using Shared.CQRS;
using Todo.Commands;
using Api.DTOs;
using Todo.Queries;
using Todo.Models;

namespace Api.Controllers;

[ApiController]
[Route("api/todos")]
public class TodosController : ControllerBase
{
    private readonly ICommandHandler<CreateTodoCommand, TodoResponse> _createTodoHandler;
    private readonly ICommandHandler<UpdateTodoCommand, TodoResponse?> _updateTodoHandler;
    private readonly ICommandHandler<ToggleTodoCommand, TodoResponse?> _toggleTodoHandler;
    private readonly ICommandHandler<DeleteTodoCommand, bool> _deleteTodoHandler;
    private readonly IQueryHandler<GetTodoByIdQuery, TodoResponse?> _getTodoByIdHandler;
    private readonly IQueryHandler<ListTodosQuery, PagedResponse<TodoResponse>> _listTodosHandler;
    private readonly IQueryHandler<TodoSummaryQuery, TodoSummaryResponse> _todoSummaryHandler;

    public TodosController(
        ICommandHandler<CreateTodoCommand, TodoResponse> createTodoHandler,
        ICommandHandler<UpdateTodoCommand, TodoResponse?> updateTodoHandler,
        ICommandHandler<ToggleTodoCommand, TodoResponse?> toggleTodoHandler,
        ICommandHandler<DeleteTodoCommand, bool> deleteTodoHandler,
        IQueryHandler<GetTodoByIdQuery, TodoResponse?> getTodoByIdHandler,
        IQueryHandler<ListTodosQuery, PagedResponse<TodoResponse>> listTodosHandler,
        IQueryHandler<TodoSummaryQuery, TodoSummaryResponse> todoSummaryHandler)
    {
        _createTodoHandler = createTodoHandler;
        _updateTodoHandler = updateTodoHandler;
        _toggleTodoHandler = toggleTodoHandler;
        _deleteTodoHandler = deleteTodoHandler;
        _getTodoByIdHandler = getTodoByIdHandler;
        _listTodosHandler = listTodosHandler;
        _todoSummaryHandler = todoSummaryHandler;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<TodoResponse>>> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] bool? isCompleted = null,
        [FromQuery] Priority? priority = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] string sortOrder = "desc")
    {
        var query = new ListTodosQuery(page, pageSize, isCompleted, priority, sortBy, sortOrder);
        var result = await _listTodosHandler.HandleAsync(query);
        return Ok(result);
    }

    [HttpGet("summary")]
    public async Task<ActionResult<TodoSummaryResponse>> Summary()
    {
        var result = await _todoSummaryHandler.HandleAsync(new TodoSummaryQuery());
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TodoResponse>> GetById(Guid id)
    {
        var query = new GetTodoByIdQuery(id);
        var result = await _getTodoByIdHandler.HandleAsync(query);
        
        if (result == null) return NotFound();
        
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<TodoResponse>> Create([FromBody] CreateTodoRequest request)
    {
        var command = new CreateTodoCommand(request.Title, request.Description, request.Priority, request.DueDate);
        var result = await _createTodoHandler.HandleAsync(command);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TodoResponse>> Update(Guid id, [FromBody] UpdateTodoRequest request)
    {
        var command = new UpdateTodoCommand(id, request.Title, request.Description, request.Priority, request.DueDate, request.IsCompleted);
        var result = await _updateTodoHandler.HandleAsync(command);
        
        if (result == null) return NotFound();
        
        return Ok(result);
    }

    [HttpPatch("{id}/toggle")]
    public async Task<ActionResult<TodoResponse>> Toggle(Guid id)
    {
        var command = new ToggleTodoCommand(id);
        var result = await _toggleTodoHandler.HandleAsync(command);
        
        if (result == null) return NotFound();
        
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var command = new DeleteTodoCommand(id);
        var result = await _deleteTodoHandler.HandleAsync(command);
        
        if (!result) return NotFound();
        
        return NoContent();
    }
}
