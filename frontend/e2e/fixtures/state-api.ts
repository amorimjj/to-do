import { test as base } from '@playwright/test';
import { TodoSeed } from '../helpers/seed-builders';
import { TodoPage } from '../page-objects/TodoPage';

export interface StateApiFixture {
  resetDatabase(data?: TodoSeed[]): Promise<void>;
}

export const test = base.extend<{
  stateApi: StateApiFixture;
  todoPage: TodoPage;
}>({
  stateApi: async ({}, use) => {
    const apiBase = process.env.BACKEND_URL || 'http://localhost:5001/api';

    await use({
      async resetDatabase(data) {
        const response = await fetch(`${apiBase}/test/reset`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data || [])
        });
        if (!response.ok) {
          throw new Error(`Failed to reset database: ${response.statusText}`);
        }
      }
    });
  },
  todoPage: async ({ page }, use) => {
    await use(new TodoPage(page));
  }
});

export { expect } from '@playwright/test';
