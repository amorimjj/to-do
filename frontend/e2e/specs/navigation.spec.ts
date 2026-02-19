import { test, expect } from '../fixtures/state-api';
import { TodoPage } from '../page-objects/TodoPage';

test.describe('Sidebar Navigation', () => {
  test('should navigate between tabs using sidebar', async ({
    page,
    stateApi
  }) => {
    await stateApi.resetDatabase();
    const todoPage = new TodoPage(page);
    await todoPage.gotoOverview();

    // To Tasks
    await todoPage.clickSafe(todoPage.navTasks);
    await expect(todoPage.myTasksTab).toBeVisible();
    await expect(page).toHaveURL(/\/my-tasks/);

    // To Settings
    await todoPage.clickSafe(todoPage.navSettings);
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page).toHaveURL(/\/settings/);

    // To Overview
    await todoPage.clickSafe(todoPage.navOverview);
    await expect(todoPage.overviewTab).toBeVisible();
    await expect(page).toHaveURL(/\/overview/);
  });

  test('should redirect invalid route to overview', async ({
    page,
    stateApi
  }) => {
    await stateApi.resetDatabase();
    const todoPage = new TodoPage(page);
    await page.goto('/no-such-route');
    await expect(todoPage.overviewTab).toBeVisible();
    await expect(page).toHaveURL(/\/overview/);
  });

  test('should redirect root / to overview', async ({ page, stateApi }) => {
    await stateApi.resetDatabase();
    const todoPage = new TodoPage(page);
    await page.goto('/');
    await expect(todoPage.overviewTab).toBeVisible();
    await expect(page).toHaveURL(/\/overview/);
  });
});
