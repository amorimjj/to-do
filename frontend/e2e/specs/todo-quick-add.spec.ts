import { test, expect } from '../fixtures/state-api';
import { TodoPage } from '../page-objects/TodoPage';

test.describe('Todo Quick Add', () => {
  test('should quick add a todo from My Tasks tab', async ({ page, stateApi }) => {
    await stateApi.resetDatabase();
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.quickAddTodo('Quick Task');
    await todoPage.expectTodoVisible('Quick Task');
    
    // Validate empty title doesn't add a task (button is disabled)
    await todoPage.quickAddInput.fill(' ');
    await expect(todoPage.quickAddSubmit).toBeDisabled();
  });
});
