# @kael/database

Shared PostgreSQL database package for Kael, powered by Drizzle ORM.

## Setup

Create a local environment file from the example and set `DATABASE_URL`:

```bash
cp packages/database/.env.example packages/database/.env
```

## Scripts

- `bun --filter @kael/database typecheck` validates the package.
- `bun --filter @kael/database db:generate` generates migrations from
  `src/schema.ts`.
- `bun --filter @kael/database db:migrate` applies generated migrations.
- `bun --filter @kael/database db:push` syncs the schema directly to the
  database.
- `bun --filter @kael/database db:studio` opens Drizzle Studio.

Add table definitions to `src/schema.ts` and import the shared client from
`@kael/database`.
