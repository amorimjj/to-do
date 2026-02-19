import { test, expect } from '../fixtures/state-api';
import { TodoPage } from '../page-objects/TodoPage';
import { buildTodo } from '../helpers/seed-builders';

test.describe('Todo Edit', () => {
  test('should edit a todo via modal', async ({ page, stateApi }) => {
    const todo = buildTodo({
      title: 'Original Title',
      description: 'Original Desc',
      priority: 'Low'
    });
    await stateApi.resetDatabase([todo]);

    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.openEditModal('Original Title');

    // Check initial values
    await expect(todoPage.titleInput).toHaveValue('Original Title');
    await expect(todoPage.descInput).toHaveValue('Original Desc');

    // Update values
    await todoPage.titleInput.fill('Updated Title');
    await todoPage.descInput.fill('Updated Desc');
    const highPriorityBtn = page.getByTestId('todo-input-priority-high');
    await todoPage.clickSafe(highPriorityBtn);

    await todoPage.clickSafe(todoPage.submitButton);
    await expect(todoPage.todoForm).not.toBeVisible();

    // Verify updates in list
    await todoPage.expectTodoVisible('Updated Title');
    await todoPage.expectTodoNotVisible('Original Title');

    // Re-open to check if values persisted correctly
    await todoPage.openEditModal('Updated Title');
    await expect(todoPage.titleInput).toHaveValue('Updated Title');
    await expect(todoPage.descInput).toHaveValue('Updated Desc');
    await expect(page.getByTestId('todo-input-priority-high')).toHaveAttribute(
      'data-selected',
      'true'
    );
  });
});
