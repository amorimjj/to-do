# Product Specification - TaskFlow MVP

## Core Features

- **CRUD Tasks:** Create, view, update, and delete tasks.
- **Completion Toggle:** Mark tasks as done/undone with a single click.
- **Priority Management:** Categorize tasks by Low, Medium, or High priority.
- **Due Dates:** Assign deadlines to tasks.
- **Filtering:** Filter list by completion status and priority.
- **Sorting:** Sort by creation date, due date, title, or priority.
- **Pagination:** Handles large lists efficiently with server-side pagination.
- **Responsive Design:** Fully functional on mobile and desktop.

## Data Model

### TodoItem
- `Id`: Guid (Primary Key)
- `Title`: String (Max 200, Required)
- `Description`: String (Max 1000, Optional)
- `IsCompleted`: Boolean
- `Priority`: Enum (Low, Medium, High)
- `DueDate`: DateTime (Optional)
- `CreatedAt`: DateTime
- `UpdatedAt`: DateTime

## Roadmap

### Phase 2: User Accounts
- JWT Authentication
- Multi-user data isolation
- Social login (Google/GitHub)

### Phase 3: Productivity Tools
- Task categories/tags
- Sub-tasks (Checklists)
- Search (Full-text search)
- Drag-and-drop reordering

### Phase 4: Collaboration & Notifications
- Shared lists
- Email/Browser push notifications for due dates
- Real-time updates via SignalR
