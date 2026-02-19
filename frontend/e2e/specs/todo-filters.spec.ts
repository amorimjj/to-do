import { test } from '../fixtures/state-api';
import { TodoPage } from '../page-objects/TodoPage';
import { buildTodo } from '../helpers/seed-builders';

test.describe('Todo Filters', () => {
  test('should filter by status', async ({ page, stateApi }) => {
    const todos = [
      buildTodo({ title: 'Active Task', isCompleted: false }),
      buildTodo({ title: 'Completed Task', isCompleted: true })
    ];
    await stateApi.resetDatabase(todos);

    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.filterByStatus('pending');
    await todoPage.expectTodoVisible('Active Task');
    await todoPage.expectTodoNotVisible('Completed Task');

    await todoPage.filterByStatus('completed');
    await todoPage.expectTodoVisible('Completed Task');
    await todoPage.expectTodoNotVisible('Active Task');

    await todoPage.filterByStatus('all');
    await todoPage.expectTodoVisible('Active Task');
    await todoPage.expectTodoVisible('Completed Task');
  });

  test('should filter by priority', async ({ page, stateApi }) => {
    const todos = [
      buildTodo({ title: 'Low Task', priority: 'Low' }),
      buildTodo({ title: 'High Task', priority: 'High' })
    ];
    await stateApi.resetDatabase(todos);

    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.filterByPriority('high');
    await todoPage.expectTodoVisible('High Task');
    await todoPage.expectTodoNotVisible('Low Task');

    await todoPage.filterByPriority('low');
    await todoPage.expectTodoVisible('Low Task');
    await todoPage.expectTodoNotVisible('High Task');

    await todoPage.filterByPriority('all');
    await todoPage.expectTodoVisible('High Task');
    await todoPage.expectTodoVisible('Low Task');
  });
});
