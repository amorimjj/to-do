import { test, expect } from '../fixtures/state-api';
import { TodoPage } from '../page-objects/TodoPage';
import { buildTodo } from '../helpers/seed-builders';

test.describe('Todo Search', () => {
  test('should search todos by title', async ({ page, stateApi }) => {
    const todos = [
      buildTodo({ title: 'Apple Task' }),
      buildTodo({ title: 'Banana Task' }),
      buildTodo({ title: 'Cherry Task' })
    ];
    await stateApi.resetDatabase(todos);

    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.searchTodos('Apple');
    await todoPage.expectTodoVisible('Apple Task');
    await todoPage.expectTodoNotVisible('Banana Task');
    await todoPage.expectTodoNotVisible('Cherry Task');

    await todoPage.searchTodos('Banana');
    await todoPage.expectTodoVisible('Banana Task');
    await todoPage.expectTodoNotVisible('Apple Task');
    await todoPage.expectTodoNotVisible('Cherry Task');

    await todoPage.searchTodos('');
    await todoPage.expectTodoVisible('Apple Task');
    await todoPage.expectTodoVisible('Banana Task');
    await todoPage.expectTodoVisible('Cherry Task');
  });

  test('should show empty state when no results match search', async ({
    page,
    stateApi
  }) => {
    const todos = [buildTodo({ title: 'Apple Task' })];
    await stateApi.resetDatabase(todos);

    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.searchTodos('NoSuchTask');
    await todoPage.expectEmptyState();
    await expect(
      page.getByText('No tasks found matching your filters.')
    ).toBeVisible();
  });
});
