import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TodoPage extends BasePage {
  // Navigation
  readonly navOverview: Locator;
  readonly navTasks: Locator;
  readonly navSettings: Locator;

  // Header
  readonly headerSearch: Locator;
  readonly headerNewTask: Locator;
  readonly themeToggle: Locator;

  // My Tasks Tab
  readonly myTasksTab: Locator;
  readonly quickAddInput: Locator;
  readonly quickAddSubmit: Locator;
  readonly filterAll: Locator;
  readonly filterPending: Locator;
  readonly filterCompleted: Locator;
  readonly advancedFilterBtn: Locator;
  readonly todoList: Locator;

  // Form (Modal)
  readonly todoForm: Locator;
  readonly titleInput: Locator;
  readonly descInput: Locator;
  readonly dateInput: Locator;
  readonly submitButton: Locator;

  // Overview Tab
  readonly overviewTab: Locator;
  readonly statsTotal: Locator;
  readonly statsCompleted: Locator;
  readonly statsPending: Locator;
  readonly statsProgress: Locator;
  readonly viewAllTasks: Locator;

  // Confirm Dialog
  readonly confirmProceed: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation
    this.navOverview = page.getByRole('button', { name: 'Overview' });
    this.navTasks = page.getByRole('button', { name: 'My Tasks' });
    this.navSettings = page.getByRole('button', { name: 'Settings' });

    // Header
    this.headerSearch = page.getByTestId('header-search');
    this.headerNewTask = page.getByTestId('header-new-task');
    this.themeToggle = page.getByTestId('theme-toggle');

    // My Tasks Tab
    this.myTasksTab = page.getByTestId('my-tasks-tab');
    this.quickAddInput = page.getByTestId('my-tasks-quick-add');
    this.quickAddSubmit = page.getByTestId('my-tasks-quick-add-submit');
    this.filterAll = page.getByTestId('filter-all');
    this.filterPending = page.getByTestId('filter-pending');
    this.filterCompleted = page.getByTestId('filter-completed');
    this.advancedFilterBtn = page.getByTestId('my-tasks-filter-advanced');
    this.todoList = page.getByTestId('todo-list');

    // Form (Modal)
    this.todoForm = page.getByTestId('todo-form');
    this.titleInput = page.getByTestId('todo-input-title');
    this.descInput = page.getByTestId('todo-input-description');
    this.dateInput = page.getByTestId('todo-input-duedate');
    this.submitButton = page.getByTestId('todo-submit');

    // Overview Tab
    this.overviewTab = page.getByTestId('overview-tab');
    this.statsTotal = page.getByTestId('stats-total');
    this.statsCompleted = page.getByTestId('stats-completed');
    this.statsPending = page.getByTestId('stats-pending');
    this.statsProgress = page.getByTestId('stats-progress');
    this.viewAllTasks = page.getByTestId('overview-view-all');

    // Confirm Dialog
    this.confirmProceed = page.getByTestId('confirm-proceed');
  }

  async goto() {
    await this.page.goto('/my-tasks');
    await expect(this.myTasksTab).toBeVisible({ timeout: 10000 });
    await expect(this.page.getByTestId('my-tasks-skeleton')).not.toBeVisible({
      timeout: 10000
    });
  }

  async gotoOverview() {
    await this.page.goto('/overview');
    await expect(this.overviewTab).toBeVisible({ timeout: 10000 });
    await expect(this.page.getByTestId('overview-skeleton')).not.toBeVisible({
      timeout: 10000
    });
  }

  async gotoSettings() {
    await this.page.goto('/settings');
  }

  async addTodo(
    title: string,
    desc?: string,
    priority: string = 'Medium',
    date?: string
  ) {
    await this.headerNewTask.click();
    await expect(this.todoForm).toBeVisible();

    await this.titleInput.fill(title);
    if (desc) await this.descInput.fill(desc);

    const priorityBtn = this.page.getByTestId(
      `todo-input-priority-${priority.toLowerCase()}`
    );
    await priorityBtn.click();

    if (date) await this.dateInput.fill(date);
    await this.submitButton.click();

    await expect(this.todoForm).toBeVisible();
    await this.expectTodoVisible(title);
  }

  async quickAddTodo(title: string) {
    await this.quickAddInput.fill(title);
    await this.quickAddSubmit.click();
    await this.expectTodoVisible(title);
  }

  async toggleTodo(title: string) {
    const item = this.page
      .locator('[data-testid^="todo-item-"]')
      .filter({ hasText: title })
      .first();
    const checkbox = item.getByTestId('todo-toggle');
    await checkbox.click();
  }

  async deleteTodo(title: string) {
    const item = this.page
      .locator('[data-testid^="todo-item-"]')
      .filter({ hasText: title })
      .first();
    await item.hover();
    await item.getByTestId('todo-delete').click();
    await this.confirmProceed.click();
    await expect(item).not.toBeVisible();
  }

  async openEditModal(title: string) {
    const item = this.page
      .locator('[data-testid^="todo-item-"]')
      .filter({ hasText: title })
      .first();
    await item.hover();
    await item.getByTestId('todo-edit').click();
    await expect(this.todoForm).toBeVisible();
  }

  async expectTodoVisible(title: string) {
    const item = this.page
      .locator('[data-testid^="todo-item-"]')
      .filter({ hasText: title })
      .first();
    await expect(item).toBeVisible({ timeout: 10000 });
  }

  async expectTodoNotVisible(title: string) {
    const item = this.page
      .locator('[data-testid^="todo-item-"]')
      .filter({ hasText: title })
      .first();
    await expect(item).not.toBeVisible({ timeout: 10000 });
  }

  async expectTodoCompleted(title: string, completed: boolean = true) {
    const item = this.page
      .locator('[data-testid^="todo-item-"]')
      .filter({ hasText: title })
      .first();
    const titleLocator = item.locator('h3');
    await expect(titleLocator).toHaveAttribute(
      'data-completed',
      completed.toString()
    );
  }

  async filterByStatus(status: 'all' | 'pending' | 'completed') {
    await this.page.getByTestId(`filter-${status}`).click();
    await expect(this.page.getByTestId('my-tasks-skeleton')).not.toBeVisible();
  }

  async filterByPriority(priority: 'all' | 'low' | 'medium' | 'high') {
    const isExpanded =
      await this.advancedFilterBtn.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {
      await this.advancedFilterBtn.click();
    }
    await this.page
      .getByTestId(`filter-priority-${priority.toLowerCase()}`)
      .click();
    await expect(this.page.getByTestId('my-tasks-skeleton')).not.toBeVisible();
  }

  async searchTodos(query: string) {
    await this.headerSearch.fill(query);
    // Debounce wait + fetch wait - replace with skeleton check
    await expect(this.page.getByTestId('my-tasks-skeleton')).not.toBeVisible();
  }

  async expectStats(total: string, completed: string, pending: string) {
    // Target the first span which holds the value
    await expect(this.statsTotal.locator('span').first()).toHaveText(total, {
      timeout: 10000
    });
    await expect(this.statsCompleted.locator('span').first()).toHaveText(
      completed,
      { timeout: 10000 }
    );
    await expect(this.statsPending.locator('span').first()).toHaveText(
      pending,
      { timeout: 10000 }
    );
  }

  async expectEmptyState() {
    await expect(this.page.getByTestId('my-tasks-skeleton')).not.toBeVisible({
      timeout: 10000
    });
    await expect(this.page.getByTestId('my-tasks-empty')).toBeVisible({
      timeout: 10000
    });
  }
}
