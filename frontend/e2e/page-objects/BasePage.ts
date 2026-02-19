import { Page, Locator } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async waitForVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }

  async clickSafe(locator: Locator): Promise<void> {
    await locator.click();
  }

  async typeSafe(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }
}
