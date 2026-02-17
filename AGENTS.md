# Agent Guidelines - TaskFlow Codebase

## Backend Conventions

- **CQRS:** Every business action must be a Command or Query.
- **Single File:** Keep the Command/Query, Handler, and Validator in the same file under `{Entity}/Commands` or `{Entity}/Queries`.
- **Validation:** Use FluentValidation. Ensure validators are registered in `Program.cs`.
- **Testing:** New features MUST include NUnit tests using the `DbContextFactory` for in-memory DB access.

## Frontend Conventions

- **Component Colocation:** Place unit tests (`.test.tsx`) next to their components.
- **Tailwind 4:** Avoid custom CSS unless absolutely necessary. Use Tailwind utility classes.
- **Lucide Icons:** Use `lucide-react` for all icons.
- **Data Fetching:** Use the `useTodos` hook for task-related state management. Do not call `todoApi` directly from components.
- **Testing:** Use `jest` + `react-testing-library` for units. Use `data-testid` for all interactive elements to support Playwright.

## E2E Testing

- **State Reset:** Always call `stateApi.resetDatabase()` in the `beforeEach` or at the start of a test.
- **Page Objects:** Do not use raw locators in specs. Use the `TodoPage` object.
- **Data Isolation:** Use the `buildTodo` helper to generate unique IDs and data for tests.
