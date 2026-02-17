# ONBOARD Task

**Persona:** `@architect` (Archer, Principal Architect). Load `.cursor/subagents/architect.md`.

## Objective

Provide interactive onboarding: understand architecture, patterns, workflow, documentation locations.

## Instructions

1. **Greet:** Introduce as Archer, welcome to codebase, explain guided tour

2. **Background:**
   - Ask: Next.js/React experience?, TypeScript familiar?, Prisma/ORMs?, Area interested? (Frontend/ API/full-stack, Core, Calendar), Specific focus? (frontend/backend/integrations)

3. **Architecture overview:**
   - Next.js 16 monorepo: Application (full-stack, web UI + REST API), Purpose (research/development platform), Tech Stack (Next.js 16 App Router, TypeScript strict, OpenAPI, Postgres RDS + Sequelize, RocketIcons + Tailwind + React 19, Turborepo + npm run)

4. **Monorepo structure:**
   aiah/
   ├── amplify/ # AWS Amplify Gen2 backend configuration
   ├── actions-handler/ # Action processing framework
   ├── calendar/ # Appointment scheduling logic
   ├── core/ # Business logic (main module)
   ├── db/ # Database layer (PostgreSQL, DynamoDB, GraphQL)
   ├── follow-up/ # Follow-up automation
   ├── frontend/ # Next.js web application
   ├── migrations/ # Database migrations (Sequelize)
   ├── templates/ # WhatsApp message templates
   ├── utils/ # Shared utilities
   └── workflow/ # Workflow state machine

5. **Architectural patterns:**
   - **Server Components:** `import { api } from '@/lib/router/server'`, async function, await api calls, return JSX
   - **Client Components:** `'use client'`, useState/hooks, `import { api } from '@/lib/router/react'`, useQuery/useMutation

6. **Important files:**
   - Docs: `/README.md`, `/PRODUCT.md`
   - Config: `package.json`
   - API: `frontend/src/app/api/**/router.ts`
   - Constants: `utils/src/configs.ts`

7. **Development workflow:**
   - Setup: `npm run install`, access `http://localhost:3000`
   - Changes: Create branch `feat/feature-name`, make changes, `npm run test`, `npm run lint`, `npm run typecheck`, commit (conventional), push, PR
   - Testing: Unit `npm run test` (Vitest), E2E (Playwright), Coverage 90%+ on tRPC
   - Database: Migrations `npx aiah db:migrate`, Calendar `npx calendar db:migrate`, Seed `npx aia db:seed:all`

8. **Development workflow (with TDD):**
   - **Feature workflow:** `/brief` → `/spec` → `/tdd` → `/code` → `/review` → `/draft-pr`
   - **Bugfix workflow:** `/tdd` → Fix → Verify → `/review` → `/draft-pr`
   - **TDD as first coding task:** Always write tests FIRST before implementing or fixing code
   - **TDD process:** Write failing tests → Verify they fail → Implement/fix minimal code → Verify tests pass → Refactor → Repeat
   - **Benefits:** Tests define behavior upfront, catch regressions early, guide implementation, ensure coverage, prevent regressions
   - **When to use TDD:** **MANDATORY** for all new features, **MANDATORY** for all bugfixes, recommended for refactoring
   - **TDD with agents:**
     - **Features:** Use `/tdd` command after reading spec - agent writes tests based on spec requirements, then `/code` implements to make tests pass
     - **Bugfixes:** Use `/tdd` command with bug description - agent writes test that reproduces bug, then fixes bug to make test pass
   - **Test-first mindset:** Tests are ALWAYS the first code you write, never an afterthought
   - **Consistency:** TDD must be practiced consistently - no exceptions for "quick fixes" or "small changes"

9. **Getting help:**
   - Docs: App READMEs, PRODUCT.md
   - Commands: `/explain`, `/audit`, `/code`, `/tdd` (test-first), `/test` (add tests to existing code), `/document`

10. **Practical exercises:**
    - **Familiarization:** Read PRODUCT.md, explore schema, run app locally, browse routers
    - **Practice with TDD:**
      - Easy: Write test for new constant → implement constant → verify test passes
      - Medium: Write tests for shadcn/ui component → implement component → verify tests pass
      - Advanced: Write tests for tRPC router based on spec → implement router → verify tests pass
    - **Code reading:** Review schema, examine existing test patterns in `*.test.ts` files

11. **Answer questions:** Provide code examples, point to files/patterns, offer deeper dives

12. **Summary:** Recap takeaways, highlight must-read docs, remind of AI commands (especially `/tdd` for test-first development), encourage questions
