import { test } from '../fixtures/state-api';
import { buildTodo } from '../helpers/seed-builders';

test.describe('Todo CRUD', () => {
  test('should create a new todo', async ({ todoPage, stateApi }) => {
    await stateApi.resetDatabase();
    await todoPage.goto();

    await todoPage.addTodo('Test Task', 'This is a test', 'High');
  });

  test('should toggle todo completion', async ({ todoPage, stateApi }) => {
    const todo = buildTodo({ title: 'Toggle Me', isCompleted: false });
    await stateApi.resetDatabase([todo]);

    await todoPage.goto();

    await todoPage.toggleTodo('Toggle Me');
    await todoPage.expectTodoCompleted('Toggle Me', true);

    await todoPage.toggleTodo('Toggle Me');
    await todoPage.expectTodoCompleted('Toggle Me', false);
  });

  test('should delete a todo', async ({ todoPage, stateApi }) => {
    const todo = buildTodo({ title: 'Delete Me' });
    await stateApi.resetDatabase([todo]);

    await todoPage.goto();

    await todoPage.deleteTodo('Delete Me');
    await todoPage.expectTodoNotVisible('Delete Me');
  });
});
