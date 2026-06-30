# kael

Next.js monorepo with shared UI packages, managed with Bun, Turborepo, and Changesets.

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
bunx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@kael/ui/components/button";
```

## Contributing

### Branch model

- Feature PRs target **`next`**
- Release PRs merge **`next` → `main`**
- Set **`next`** as the default PR base branch in GitHub repo settings

If the `next` branch does not exist yet, create it once from `main`:

```bash
git checkout main
git checkout -b next
git push -u origin next
```

### Changesets

Version bumps and CHANGELOGs for `@kael/ui`, `@kael/typescript-config`, and `web` are managed by [Changesets](https://github.com/changesets/changesets).

Before opening a PR into `next`, run:

```bash
bun changeset
```

Follow the prompts to describe your change and select affected packages. Commit the generated file under `.changeset/`.

You do not need a changeset for docs-only, CI-only, or other changes that do not affect versioned packages or apps.

### Release flow

1. Changesets accumulate on `next` as PRs are merged
2. When `next` is merged into `main`, the Release workflow runs `changeset version`, bumps package versions, updates CHANGELOGs, and commits back to `main`
3. After a release, sync `next` from `main`:

```bash
git checkout next
git merge main
git push
```

### Local checks

```bash
bun run check
bun run typecheck
bun run build
```
