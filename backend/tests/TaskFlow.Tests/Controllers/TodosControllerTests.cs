using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using Shared.CQRS;
using Api.Controllers;
using Todo.Commands;
using Api.DTOs;
using Todo.Queries;
using Todo.Models;

namespace TaskFlow.Tests.Controllers;

[TestFixture]
public class TodosControllerTests
{
    private Mock<ICommandHandler<CreateTodoCommand, TodoResponse>> _createTodoHandler;
    private Mock<ICommandHandler<UpdateTodoCommand, TodoResponse?>> _updateTodoHandler;
    private Mock<ICommandHandler<ToggleTodoCommand, TodoResponse?>> _toggleTodoHandler;
    private Mock<ICommandHandler<DeleteTodoCommand, bool>> _deleteTodoHandler;
    private Mock<IQueryHandler<GetTodoByIdQuery, TodoResponse?>> _getTodoByIdHandler;
    private Mock<IQueryHandler<ListTodosQuery, PagedResponse<TodoResponse>>> _listTodosHandler;
    private TodosController _controller;

    [SetUp]
    public void SetUp()
    {
        _createTodoHandler = new Mock<ICommandHandler<CreateTodoCommand, TodoResponse>>();
        _updateTodoHandler = new Mock<ICommandHandler<UpdateTodoCommand, TodoResponse?>>();
        _toggleTodoHandler = new Mock<ICommandHandler<ToggleTodoCommand, TodoResponse?>>();
        _deleteTodoHandler = new Mock<ICommandHandler<DeleteTodoCommand, bool>>();
        _getTodoByIdHandler = new Mock<IQueryHandler<GetTodoByIdQuery, TodoResponse?>>();
        _listTodosHandler = new Mock<IQueryHandler<ListTodosQuery, PagedResponse<TodoResponse>>>();

        _controller = new TodosController(
            _createTodoHandler.Object,
            _updateTodoHandler.Object,
            _toggleTodoHandler.Object,
            _deleteTodoHandler.Object,
            _getTodoByIdHandler.Object,
            _listTodosHandler.Object);
    }

    [Test]
    public async Task Create_ValidRequest_ReturnsCreatedAtAction()
    {
        // Arrange
        var request = new CreateTodoRequest("Test Title", "Test Description", Priority.Medium, null);
        var response = new TodoResponse(Guid.NewGuid(), request.Title, request.Description, false, request.Priority, request.DueDate, DateTime.UtcNow, DateTime.UtcNow);

        _createTodoHandler
            .Setup(h => h.HandleAsync(It.IsAny<CreateTodoCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.Create(request);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
        var createdAtActionResult = (CreatedAtActionResult)result.Result;
        Assert.That(createdAtActionResult.Value, Is.EqualTo(response));
    }

    [Test]
    public async Task GetById_ExistingId_ReturnsOk()
    {
        // Arrange
        var id = Guid.NewGuid();
        var response = new TodoResponse(id, "Test Title", "Test Description", false, Priority.Medium, null, DateTime.UtcNow, DateTime.UtcNow);

        _getTodoByIdHandler
            .Setup(h => h.HandleAsync(It.IsAny<GetTodoByIdQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.GetById(id);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = (OkObjectResult)result.Result;
        Assert.That(okResult.Value, Is.EqualTo(response));
    }

    [Test]
    public async Task GetById_NonExistingId_ReturnsNotFound()
    {
        // Arrange
        var id = Guid.NewGuid();
        _getTodoByIdHandler
            .Setup(h => h.HandleAsync(It.IsAny<GetTodoByIdQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((TodoResponse?)null);

        // Act
        var result = await _controller.GetById(id);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<NotFoundResult>());
    }

    [Test]
    public async Task Update_ExistingId_ReturnsOk()
    {
        // Arrange
        var id = Guid.NewGuid();
        var request = new UpdateTodoRequest("Updated Title", "Updated Description", Priority.High, null, true);
        var response = new TodoResponse(id, request.Title, request.Description, request.IsCompleted, request.Priority, request.DueDate, DateTime.UtcNow, DateTime.UtcNow);

        _updateTodoHandler
            .Setup(h => h.HandleAsync(It.IsAny<UpdateTodoCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.Update(id, request);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = (OkObjectResult)result.Result;
        Assert.That(okResult.Value, Is.EqualTo(response));
    }

    [Test]
    public async Task Update_NonExistingId_ReturnsNotFound()
    {
        // Arrange
        var id = Guid.NewGuid();
        var request = new UpdateTodoRequest("Updated Title", "Updated Description", Priority.High, null, true);
        _updateTodoHandler
            .Setup(h => h.HandleAsync(It.IsAny<UpdateTodoCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((TodoResponse?)null);

        // Act
        var result = await _controller.Update(id, request);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<NotFoundResult>());
    }

    [Test]
    public async Task Toggle_ExistingId_ReturnsOk()
    {
        // Arrange
        var id = Guid.NewGuid();
        var response = new TodoResponse(id, "Test", "Test", true, Priority.Medium, null, DateTime.UtcNow, DateTime.UtcNow);

        _toggleTodoHandler
            .Setup(h => h.HandleAsync(It.IsAny<ToggleTodoCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.Toggle(id);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = (OkObjectResult)result.Result;
        Assert.That(okResult.Value, Is.EqualTo(response));
    }

    [Test]
    public async Task Toggle_NonExistingId_ReturnsNotFound()
    {
        // Arrange
        var id = Guid.NewGuid();
        _toggleTodoHandler
            .Setup(h => h.HandleAsync(It.IsAny<ToggleTodoCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((TodoResponse?)null);

        // Act
        var result = await _controller.Toggle(id);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<NotFoundResult>());
    }

    [Test]
    public async Task Delete_ExistingId_ReturnsNoContent()
    {
        // Arrange
        var id = Guid.NewGuid();
        _deleteTodoHandler
            .Setup(h => h.HandleAsync(It.IsAny<DeleteTodoCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.Delete(id);

        // Assert
        Assert.That(result, Is.InstanceOf<NoContentResult>());
    }

    [Test]
    public async Task Delete_NonExistingId_ReturnsNotFound()
    {
        // Arrange
        var id = Guid.NewGuid();
        _deleteTodoHandler
            .Setup(h => h.HandleAsync(It.IsAny<DeleteTodoCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _controller.Delete(id);

        // Assert
        Assert.That(result, Is.InstanceOf<NotFoundResult>());
    }

    [Test]
    public async Task List_ReturnsOkWithPagedResponse()
    {
        // Arrange
        var response = new PagedResponse<TodoResponse>(new List<TodoResponse>(), 1, 10, 0, 0);

        _listTodosHandler
            .Setup(h => h.HandleAsync(It.IsAny<ListTodosQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.List();

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = (OkObjectResult)result.Result;
        Assert.That(okResult.Value, Is.EqualTo(response));
    }
}
