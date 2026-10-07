# scripts/

This folder contains **operational scripts** used by the engineering team. These are **not part of the application runtime** — they are run manually by engineers when needed.

## Structure

```
scripts/
├── migrations/     # One-time DB schema changes & data migrations
├── seeds/          # Database seeding scripts
└── utils/          # Reusable query/debug utilities
```

## Guidelines

- **migrations/** — Scripts that run once to change DB schema or migrate data. Name them clearly: `YYYY-MM-DD_description.mjs`
- **seeds/** — Scripts to populate DB with initial/test data.
- **utils/** — Reusable helpers (e.g. validate schema, check views, inspect data).

## ⚠️ Rules

1. **Never hardcode credentials** — always read from `process.env`
2. **Never delete data** without a `--confirm` flag check
3. **Always log** what the script is doing and any errors
4. After a migration runs in production, add a comment at the top: `// ✅ Ran in production: YYYY-MM-DD`
