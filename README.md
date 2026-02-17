# TaskFlow - Full Stack To-Do Application

A production-ready MVP for task management, built with .NET 9 and React 19.

## Tech Stack

- **Backend:** ASP.NET Core 9, EF Core, SQLite, FluentValidation, Swagger.
- **Frontend:** React 19, Vite, Tailwind CSS 4, Lucide Icons.
- **Testing:** NUnit (Backend), Jest + React Testing Library (Frontend Unit), Playwright (E2E).
- **DevOps:** Docker, GitHub Actions, Azure Static Web Apps + App Service.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0) (for local development without Docker)
- [Node.js 20+](https://nodejs.org/) (for local development without Docker)

## Quick Start (Docker)

Run the entire stack using Docker Compose:

```bash
docker compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5005](http://localhost:5005)
- Swagger UI: [http://localhost:5005/swagger](http://localhost:5005/swagger)

## Running Tests

### Backend Tests (NUnit)

```bash
cd backend/tests/TaskFlow.Tests
dotnet test
```

Or using docker

```bash
docker run --rm -v "$(pwd):/app" -w /app mcr.microsoft.com/dotnet/sdk:9.0 bash -c "cd backend/tests/TaskFlow.Tests && dotnet test"
```

### Frontend Unit Tests (Jest)

```bash
cd frontend
npm test
```

### E2E Tests (Playwright)

```bash
# Ensure services are running in E2E mode
docker compose -f docker-compose.e2e.yml up -d
cd frontend
npm run e2e
```

## Architecture Notes

- **Lightweight CQRS:** The backend uses a custom Command/Query pattern without external libraries like MediatR to keep dependencies minimal while ensuring clean separation of concerns.
- **Single File Features:** Each command and query is colocated with its handler and validator in a single file for better discoverability.
- **E2E State API:** A dedicated `/api/test/reset` endpoint (enabled only in `E2E` environment) allows Playwright to reset the database to a known state before each test.
- **Tailwind 4:** Using the latest CSS-first configuration model.

## Trade-offs & Assumptions

1. **SQLite for Persistence:** Chosen for portability and compatibility with Azure Free Tier. In a high-scale production environment, Azure SQL or PostgreSQL would be preferred.
2. **No Authentication:** This MVP is single-user. However, the architecture (Commands/Queries) is designed to easily incorporate `UserId` filtering once JWT auth is added.
3. **In-Memory for Unit Tests:** Backend tests use EF Core In-Memory provider for speed and isolation.
4. **Hard Delete:** Tasks are permanently removed. A future iteration could implement soft-deletes for auditability.
