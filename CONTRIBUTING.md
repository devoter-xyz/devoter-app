# Contributing to DEVoter

Thank you for your interest in contributing to DEVoter. This document outlines how to propose changes, set up a development environment, and submit pull requests in a consistent and secure way.

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md) and follow the guidance in our [Security Policy](./SECURITY.md).

## Ways to contribute

- Report bugs and request features via [GitHub Issues](https://github.com/devoter-xyz/devoter-app/issues)
- Triage issues (repro steps, labels, minimal examples)
- Improve documentation and developer experience
- Implement features or bug fixes via pull requests

## Prerequisites

- Node.js: 18.18+ (LTS 20 or 22 recommended)
- pnpm: 10.12.1 (project uses `packageManager` field to pin)
- A PostgreSQL database (local or hosted) and a valid `DATABASE_URL`
- Git and a GitHub account (fork-based workflow)

> Note: This repository uses Next.js, TypeScript, Prisma, Tailwind CSS, and pnpm.

## Repository structure (high level)

- `src/` — application code (Next.js app directory under `src/app`, components, actions, lib)
- `prisma/` — Prisma schema, migrations, and seed
- `public/` — static assets
- `scripts/` — utility scripts (e.g., database cleanup)
- Config: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `tailwind.config.ts`

## Local development setup

1. Fork and clone

```bash
# Fork in GitHub, then clone your fork
git clone https://github.com/<your-username>/devoter-app.git
cd devoter-app

# Add upstream for sync
git remote add upstream https://github.com/devoter-xyz/devoter-app.git
```

2. Install dependencies

```bash
pnpm install
```

3. Configure environment

Create a `.env.local` file at the repository root with the required variables (see also README):

```env
DATABASE_URL=postgresql://username:password@localhost:5432/devoter
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
THIRDWEB_SECRET_KEY=your_secret_key
```

4. Initialize the database

```bash
# Push schema to your database (development)
npx dotenv -e .env.local -- npx prisma db push

# OR run a development migration flow
pnpm run prisma:migrate

# Optional: seed data
pnpm run prisma:seed

# Optional: open Prisma Studio
pnpm run prisma:studio
```

5. Start the app

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Common scripts

- Development server: `pnpm dev`
- Type checking: `pnpm typecheck`
- Linting: `pnpm lint`
- Build: `pnpm build`
- Prisma (with `.env.local`):
  - Reset DB (dev only): `pnpm prisma:reset`
  - Migrate (dev): `pnpm prisma:migrate`
  - Generate client: `pnpm prisma:generate`
  - Seed: `pnpm prisma:seed`
  - Studio: `pnpm prisma:studio`

## Branching and workflow

- Use short-lived feature branches based on `main`.
- Recommended branch names:
  - `feat/<short-description>`
  - `fix/<short-description>`
  - `chore/<short-description>`
  - `docs/<short-description>`
- Keep commits focused and logically grouped.
- Open a draft PR early for visibility and to run CI (if configured).

## Commit message convention

Follow [Conventional Commits](https://www.conventionalcommits.org/) to improve readability and changelog generation:

```
<type>(optional scope): <description>

[optional body]
[optional footer(s)]
```

Common types: `feat`, `fix`, `docs`, `chore`, `refactor`, `perf`, `test`, `build`, `ci`.

Examples:

- `feat(repository): add submit-repo page with validation`
- `fix(vote): prevent duplicate votes in rapid clicks`
- `chore: bump prisma to 6.8.2`

## Database schema changes

If your change modifies the database schema:

1. Update `prisma/schema.prisma`.
2. Create a dev migration and generate the client:
   ```bash
   pnpm prisma:migrate
   pnpm prisma:generate
   ```
3. Commit the updated `prisma/schema.prisma` and files under `prisma/migrations/`.
4. Update `prisma/seed.ts` if seed data must reflect the new schema.
5. If needed, include data backfills or safe guards and document any manual steps in the PR description.

> Do not run destructive resets against shared environments. Use `pnpm prisma:reset` only on your local dev DB.

## Code style and guidelines

- TypeScript: prefer explicit types for public functions and shared utilities.
- Linting: ensure `pnpm lint` passes. Fix warnings if they indicate likely issues.
- Type checks: ensure `pnpm typecheck` passes with no errors.
- Accessibility: use semantic HTML and ARIA where appropriate.
- Server Actions and API: validate input (e.g., with `zod`) and handle error states.
- UI: keep components small and composable; colocate component-specific styles.
- Secrets: never commit credentials, tokens, or real secrets. Use `.env.local`.

## Documentation updates

- Update `README.md` when user-facing commands, setup, or environment variables change.
- Add or update files under `docs/` for deeper technical explanations.
- Keep examples minimal and runnable when possible.

## Pull request checklist

Before requesting review, please ensure:

- [ ] The change is scoped and focused; the PR description explains the “why”.
- [ ] `pnpm lint` and `pnpm typecheck` pass locally.
- [ ] App builds locally with `pnpm build` and runs in dev with `pnpm dev`.
- [ ] DB migrations (if any) are included and explained.
- [ ] Tests or examples are added where helpful (this repo currently has no test harness; focused unit or integration tests are welcome in a future PR).
- [ ] Documentation updated (`README.md`, `docs/`, comments) as needed.

## Reporting security issues

Please do not open public issues for security vulnerabilities. Follow the process in our [Security Policy](./SECURITY.md) to report vulnerabilities responsibly.

## License

By contributing to this repository, you agree that your contributions will be licensed under the terms of the [License](./LICENSE).
