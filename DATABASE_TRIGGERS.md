# Database Triggers - Auto-Update `updated_at`

## Overview

This project uses **PostgreSQL triggers** to automatically update the `updated_at` timestamp field whenever a record is modified in any table. This is a database-level implementation that ensures consistency regardless of how updates are performed.

## Why Triggers?

- ✅ **Automatic** - No need to manually set `updated_at` in application code
- ✅ **Consistent** - Works for all update operations (ORM, raw SQL, etc.)
- ✅ **Reliable** - Can't be forgotten or skipped
- ✅ **Database-enforced** - Operates at the database level
- ✅ **Zero maintenance** - Set once, works forever

## Affected Tables

The following tables have automatic `updated_at` triggers:

- `users`
- `roles`
- `permissions`
- `user_roles`
- `role_permissions`

## Implementation Details

### Trigger Function

A single reusable function updates the `updated_at` column:

```sql
CREATE OR REPLACE FUNCTION "gkk-schema".update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

### Triggers

Each table has a `BEFORE UPDATE` trigger that calls the function:

```sql
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON "gkk-schema".users
    FOR EACH ROW
    EXECUTE FUNCTION "gkk-schema".update_updated_at_column();
```

## Commands

### Apply Triggers

```bash
pnpm db:triggers
```

Applies all triggers to the database. Safe to run multiple times.

### Check Triggers

```bash
pnpm db:check-triggers
```

Verifies which triggers are installed in the database.

### Test Triggers

```bash
pnpm db:test-triggers
```

Performs a test update to verify triggers are working correctly.

### Push Schema (includes triggers)

```bash
pnpm db:push
```

Pushes schema changes to the database AND automatically applies triggers.

## Files

- **`drizzle/0003_add_updated_at_triggers.sql`** - SQL migration file with trigger definitions
- **`src/db/migrations/applyTriggers.ts`** - Script to apply triggers to the database
- **`src/db/migrations/checkTriggers.ts`** - Script to verify trigger installation
- **`src/db/migrations/testTriggers.ts`** - Script to test trigger functionality

## Usage in Code

When updating records, you **don't need** to set `updated_at`:

```typescript
// ❌ Old way (manual)
await db.update(users).set({
  first_name: "John",
  updated_at: new Date() // Not needed!
});

// ✅ New way (automatic)
await db.update(users).set({
  first_name: "John"
  // updated_at is automatically set by the trigger
});
```

## Migration Workflow

When setting up a new database or after schema changes:

1. Generate migrations: `pnpm db:generate`
2. Push to database: `pnpm db:push` (this automatically applies triggers)
3. Verify: `pnpm db:check-triggers`

## Troubleshooting

### Triggers not working after schema changes

If you manually run migrations or make schema changes:

```bash
pnpm db:triggers
```

### Verify triggers are installed

```bash
pnpm db:check-triggers
```

Expected output:

```
✅ Found 5 trigger(s):
  - update_permissions_updated_at on permissions
  - update_role_permissions_updated_at on role_permissions
  - update_roles_updated_at on roles
  - update_user_roles_updated_at on user_roles
  - update_users_updated_at on users
```

### Test if triggers work

```bash
pnpm db:test-triggers
```

Expected output:

```
✅ SUCCESS: updated_at was automatically updated!
```

## Notes

- Triggers work on the Neon (PostgreSQL) database
- The `updated_at` field is set to the current database time (`NOW()`)
- Triggers run BEFORE the UPDATE, ensuring the timestamp is always current
- No application-level code changes required
