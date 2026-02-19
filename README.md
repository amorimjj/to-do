# TaskFlow - Full Stack To-Do Application

> I truly appreciate the opportunity to participate in a selection process for such an important matter, one that gives us the chance to make a real difference in people's lives. Having lost beloved family members to this devastating disease, I deeply understand its profound impact and am personally committed to contributing meaningful solutions.
> This project reflects my dedication to writing clean, well-tested, production-ready code that can serve as the foundation for truly impactful work in this vital field.

## Live Demo

- [TaskFlow live on Azure](https://orange-water-0c717341e.1.azurestaticapps.net)

> A video walkthrough of the application is available [here](assets/todo-demo.mov)

## Tech Stack

- **Backend:** ASP.NET Core 9, EF Core, SQLite, FluentValidation, Swagger.
- **Frontend:** React 19, Vite, Tailwind CSS 4, Lucide Icons.
- **Testing:** NUnit (Backend), Jest + React Testing Library (Frontend Unit), Playwright (E2E).
- **DevOps:** Docker, GitHub Actions, Azure Static Web Apps + App Service.

## Live code

- [TaskFlow live on Azure](https://orange-water-0c717341e.1.azurestaticapps.net)

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0) (for local development without Docker)
- [Node.js 20+](https://nodejs.org/) (for local development without Docker)

## Onboard

Use commands `/onboard` and `/explain` to get familiarized with the application.

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

![Backend Results](assets/backend.png)

### Frontend Unit Tests (Jest)

```bash
cd frontend
npm test
```

![Frontend Results](assets/frontend.png)

### E2E Tests (Playwright)

```bash
# Ensure services are running in E2E mode
docker compose -f docker-compose.e2e.yml up -d
cd frontend
npm run e2e
```

![E2E Results](assets/e2e.png)

## Architecture Notes

- **Lightweight CQRS:** The backend uses a custom Command/Query pattern without external libraries like MediatR to keep dependencies minimal while ensuring clean separation of concerns.
- **Single File Features:** Each command and query is colocated with its handler and validator in a single file for better discoverability.
- **E2E State API:** A dedicated `/api/test/reset` endpoint (enabled only in `E2E` environment) allows Playwright to reset the database to a known state before each test.
- **Tailwind 4:** Using the latest CSS-first configuration model.

## Trade-offs & Assumptions

1. **SQLite for Persistence:** Chosen for portability and compatibility with Azure Free Tier. In a high-scale production environment, Azure SQL or PostgreSQL would be preferred.
2. **No Authentication:** This MVP is single-user. However, the architecture (Commands/Queries) is designed to easily incorporate `UserId` filtering once JWT auth is added. **I want to share that I didn't implement authentication at all because it is a critical component of the application. Rather than adding a hastily designed or incomplete version, I chose to leave it out entirely until a fully planned and secure implementation can be integrated**.
3. **In-Memory for Unit Tests:** Backend tests use EF Core In-Memory provider for speed and isolation.
4. **Hard Delete:** Tasks are permanently removed. A future iteration could implement soft-deletes for auditability.
5. **Mobile**: Not fully tested on small screen and there are a few small issues.
