import { test, expect } from '../fixtures/state-api';
import { TodoPage } from '../page-objects/TodoPage';
import { buildTodo } from '../helpers/seed-builders';

test.describe('Todo Overview', () => {
  test('should show correct statistics cards on overview page', async ({ page, stateApi }) => {
    const todos = [
      buildTodo({ title: 'Task 1', isCompleted: true }),
      buildTodo({ title: 'Task 2', isCompleted: false }),
      buildTodo({ title: 'Task 3', isCompleted: false })
    ];
    await stateApi.resetDatabase(todos);

    const todoPage = new TodoPage(page);
    await todoPage.gotoOverview();

    await todoPage.expectStats('3', '1', '2');
    await expect(todoPage.statsProgress.locator('span').first()).toHaveText(/^33%$/);
  });

  test('should show priority tasks in overview', async ({ page, stateApi }) => {
    const todos = [
      buildTodo({ title: 'Low Task', priority: 'Low', isCompleted: false }),
      buildTodo({ title: 'Med Task', priority: 'Medium', isCompleted: false }),
      buildTodo({ title: 'High Task', priority: 'High', isCompleted: false }),
      buildTodo({ title: 'Completed High Task', priority: 'High', isCompleted: true })
    ];
    await stateApi.resetDatabase(todos);

    const todoPage = new TodoPage(page);
    await todoPage.gotoOverview();

    // Priority tasks shows top incomplete tasks (High -> Med -> Low)
    await todoPage.expectTodoVisible('High Task');
    await todoPage.expectTodoVisible('Med Task');
    await todoPage.expectTodoVisible('Low Task');
    await todoPage.expectTodoNotVisible('Completed High Task');
    
    // Check priority tasks count badge
    await expect(page.getByTestId('priority-tasks-count')).toHaveText('3');
  });

  test('should navigate to tasks from view all link in overview', async ({ page, stateApi }) => {
    const todos = [
      buildTodo({ title: 'Test Task' })
    ];
    await stateApi.resetDatabase(todos);

    const todoPage = new TodoPage(page);
    await todoPage.gotoOverview();

    await todoPage.clickSafe(todoPage.viewAllTasks);
    await expect(todoPage.myTasksTab).toBeVisible();
    await expect(page).toHaveURL(/\/my-tasks/);
  });

  test('should open new task modal from overview via Get Started button', async ({ page, stateApi }) => {
    await stateApi.resetDatabase();
    const todoPage = new TodoPage(page);
    await todoPage.gotoOverview();

    const getStartedBtn = page.getByTestId('overview-get-started');
    await todoPage.clickSafe(getStartedBtn);
    
    await expect(todoPage.todoForm).toBeVisible();
    await todoPage.typeSafe(todoPage.titleInput, 'New Task From Overview');
    await todoPage.clickSafe(todoPage.submitButton);
    
    await expect(todoPage.todoForm).not.toBeVisible();
    
    // Give a small moment for transitions to complete before navigating
    await page.waitForTimeout(300);
    await todoPage.clickSafe(todoPage.viewAllTasks);
    await expect(page).toHaveURL(/\/my-tasks/);
    await todoPage.expectTodoVisible('New Task From Overview');
  });
});
