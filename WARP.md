# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Running the Server

```bash
pnpm dev
```

Starts development server with hot reload using `ts-node-dev` on port defined in `SERVER_PORT` env var.

### Linting

```bash
pnpm lint
```

Runs ESLint with TypeScript support. Exits on errors or warnings.

### Database Operations

```bash
pnpm db:generate  # Generate migrations from schema changes
pnpm db:push      # Push schema changes to database
pnpm db:up        # Run migrations
pnpm db:drop      # Drop tables
```

### Seeding Database

```bash
pnpm seed              # Run all seeds in order (master seed)
pnpm seed:roles        # Seed roles → permissions → users → userRoles (cascade)
pnpm seed:permissions  # Seed permissions → roles → users → userRoles (cascade)
pnpm seed:users        # Seed users → userRoles
pnpm seed:userRoles    # Seed userRoles only
```

Note: The master seed runs in this order: roles → permissions → users → rolePermissions → userRoles

## Architecture Overview

### Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.1.0
- **Database**: PostgreSQL (via @neondatabase/serverless)
- **ORM**: Drizzle ORM 0.44.3 with postgres driver
- **Authentication**: JWT (jsonwebtoken) with bcryptjs
- **Validation**: Zod 4.0.5 schemas
- **API Documentation**: Swagger (swagger-jsdoc + swagger-ui-express)
- **File Uploads**: Multer 2.0.2 + UploadThing (currently commented out)
- **Dev Tools**: ts-node-dev with tsconfig-paths, husky for git hooks

### Project Structure

```
src/
├── server.ts              # Application entry point
├── constants/             # Environment variables, HTTP codes, enums, regex
├── controllers/           # Request handlers (auth, user, image)
├── routes/                # Express route definitions
├── middlewares/           # Token validation, error handling, rate limiting, schema validation
├── helpers/               # Reusable utilities (pagination, permissions, query building, HTTP responses)
├── db/
│   ├── connection.ts      # Drizzle database instance with postgres client
│   ├── schemas/           # Drizzle table schemas (users, roles, permissions, relations)
│   └── seeds/             # Database seeding scripts
├── validation-schemas/    # Zod request validation schemas
├── types/                 # TypeScript type definitions
├── utils/                 # JWT generation, image upload utilities
├── error-handling/        # Custom error classes
└── swagger-docs/          # Swagger JSDoc definitions
```

### Authentication & Authorization Flow

1. **Registration**: User registers → password hashed with bcrypt → JWT token generated → default "customer" role (ID: 4) assigned via `userRoles` table
2. **Login**: Credentials validated → JWT token issued with `user_id` payload
3. **Protected Routes**: All routes under `/api/v1` (except `/api/v1/auth`) require JWT validation via `validateToken` middleware
4. **Permissions**: Role-Based Access Control (RBAC) system with:
   - `users` → `userRoles` → `roles` → `rolePermissions` → `permissions`
   - Permission format: `{action}:{resource}` (e.g., `create:user`, `read:role`)
   - `hasPermission()` helper checks user permissions via complex join query

### Database Schema

- **Schema Name**: `gkk-schema` (PostgreSQL custom schema)
- **Tables**: users, roles, permissions, userRoles (junction), rolePermissions (junction)
- **Soft Deletes**: Uses `deleted_at` timestamp column (not hard deletes)
- **Relations**: Defined in Drizzle using `relations()` for type-safe joins

### Path Aliases (tsconfig)

```typescript
@constants/*          // src/constants
@controllers/*        // src/controllers
@db/*                 // src/db
@helpers/*            // src/helpers
@middlewares/*        // src/middlewares
@routes/*             // src/routes
@utils/*              // src/utils
@validation-schemas/* // src/validation-schemas
// Note: @types/* is commented out in tsconfig.json
```

### Middleware Pipeline

1. CORS enabled globally
2. JSON & URL-encoded body parsing
3. Rate limiting via `express-rate-limit`
4. `/api/v1/auth/*` routes → unauthenticated
5. All other `/api/v1/*` routes → `validateToken` middleware
6. Request validation → `schemaValidator` middleware (Zod)
7. Error handling → `logErrorMiddleware` → `returnError`

### Key Patterns

#### Pagination Helper

`getPaginatedData()` accepts any Drizzle query and returns:

```typescript
{
  data: T[],
  total: number,
  page: number,
  limit: number,
  totalPages: number,
  hasNext: boolean,
  hasPrevious: boolean
}
```

#### HTTP Response Generators

Centralized response helpers in `@helpers/httpResponseGenerator`:

- `fetchSuccess()`, `postSuccess()`, `putSuccess()`, `deleteSuccess()`
- `badRequestRes()`, `notAuthorizedRes()`, `conflictRes()`, `duplicateEntry()`

#### Schema Validation

All routes use Zod schemas with `validate()` middleware that validates `body`, `query`, and `params` in a single pass.

#### Error Handling

Custom error classes extend `BaseError` and are caught by `logErrorMiddleware` → `returnError` chain.

## Coding Standards

### ESLint Rules (Key Points)

- **Indentation**: 2 spaces
- **Quotes**: Double quotes only
- **Semicolons**: Required
- **No console.log**: Use logger (exception: server startup)
- **Naming Conventions**:
  - Types/Interfaces: `PascalCase` or `UPPER_CASE`
  - Functions: `camelCase` or `PascalCase`
  - Variables: `camelCase`, `PascalCase`, `snake_case`, or `UPPER_CASE`
  - Booleans: Must have prefix `is`, `should`, `has`, `can`, `did`, `will`, `does`
- **Unused variables**: Prefix with `_` to ignore
- **Strict mode**: All TypeScript strict checks enabled

### Database Conventions

- **Casing**: `snake_case` for all database columns (enforced by `drizzle.config.ts`)
- **Soft Deletes**: Always check `isNull(table.deleted_at)` in queries
- **Timestamps**: Use `created_at`, `updated_at`, `deleted_at` columns

## Environment Variables

Required variables (see `.env.example`):

- `SERVER_PORT` - Express server port
- `DB_CONNECTION_STRING` - PostgreSQL connection URL
- `JWT_SECRET` - Secret for JWT signing
- `UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID` - File upload service credentials

## API Documentation

Swagger UI available at `/api-docs` when server is running. API definitions are in `src/swagger-docs/`.
