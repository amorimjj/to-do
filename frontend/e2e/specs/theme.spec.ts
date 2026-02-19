import { test, expect } from '../fixtures/state-api';
import { TodoPage } from '../page-objects/TodoPage';

test.describe('Theme Toggle', () => {
  test('should toggle theme using header button', async ({ page, stateApi }) => {
    await stateApi.resetDatabase();
    const todoPage = new TodoPage(page);
    await todoPage.gotoOverview();

    // Toggle to dark
    await todoPage.clickSafe(todoPage.themeToggle);
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Toggle back to light
    await todoPage.clickSafe(todoPage.themeToggle);
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('should toggle theme from settings page', async ({ page, stateApi }) => {
    await stateApi.resetDatabase();
    const todoPage = new TodoPage(page);
    await todoPage.gotoSettings();

    const darkBtn = page.getByTestId('theme-dark-btn');
    const lightBtn = page.getByTestId('theme-light-btn');

    // Toggle to dark
    await todoPage.clickSafe(darkBtn);
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(darkBtn).toHaveClass(/text-violet-600/);
    await expect(darkBtn).toHaveClass(/shadow-sm/);
    
    // Toggle back to light
    await todoPage.clickSafe(lightBtn);
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await expect(lightBtn).toHaveClass(/text-violet-600/);
    await expect(lightBtn).toHaveClass(/shadow-sm/);
  });
});
