# Ghar Ka Khana - Server (POC)

A Node.js/Express backend server for the Ghar Ka Khana application with role-based access control (RBAC), authentication, and user management features.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication with access tokens
  - Refresh token system with HTTP-only cookies
  - Token rotation for enhanced security
  - Role-based access control (RBAC)
  - Permission-based authorization system
  - User registration, login, and logout

- **User Management**
  - User CRUD operations
  - User profile with image upload
  - User activation/deactivation (Admin-only)
  - Role assignment
  - Self-service profile updates

- **Database**
  - PostgreSQL with Drizzle ORM
  - Custom schema support (`gkk-schema`)
  - Database migrations and seeding
  - Type-safe database queries

- **API Features**
  - RESTful API design
  - Request validation with Zod
  - Rate limiting
  - Error handling middleware
  - Swagger API documentation
  - CORS support

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (v8 or higher)
- PostgreSQL database

## 🛠️ Tech Stack

- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Zod
- **Password Hashing:** bcryptjs
- **API Documentation:** Swagger UI
- **File Upload:** Multer
- **Development Tools:** ts-node-dev, ESLint, Prettier, Husky

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Server Configuration
   SERVER_PORT=3000

   # Database Configuration
   DB_CONNECTION_STRING=postgresql://user:password@host:port/database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name

   # Security
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN_SEC=3600
   BCRYPT_SALT=10
   REFRESH_TOKEN_BYTES=32
   REFRESH_TOKEN_EXP_DAYS=7

   # File Upload (Optional - UploadThing)
   UPLOADTHING_SECRET=your_uploadthing_secret
   UPLOADTHING_APP_ID=your_uploadthing_app_id
   ```

4. **Set up the database**

   ```bash
   # Generate migrations
   pnpm db:generate

   # Push schema to database
   pnpm db:push

   # Seed the database with initial data
   pnpm seed
   ```

## 🎯 Usage

### Development

Start the development server with hot reload:

```bash
pnpm dev
```

The server will start on `http://localhost:3000` (or your configured `SERVER_PORT`).

### Database Commands

```bash
# Generate new migration
pnpm db:generate

# Apply migrations
pnpm db:up

# Push schema changes to database (includes automatic trigger setup)
pnpm db:push

# Drop migrations
pnpm db:drop

# Apply database triggers for auto-updating timestamps
pnpm db:triggers

# Check if triggers are installed
pnpm db:check-triggers

# Test trigger functionality
pnpm db:test-triggers

# Seed database with all data
pnpm seed

# Seed specific data
pnpm seed:roles
pnpm seed:permissions
pnpm seed:users
pnpm seed:userRoles
```

> **Note**: The `updated_at` field is automatically updated by database triggers. See [DATABASE_TRIGGERS.md](DATABASE_TRIGGERS.md) for details.

### Code Quality

```bash
# Run ESLint
pnpm lint
```

## 📁 Project Structure

```
server/
├── src/
│   ├── constants/          # Application constants
│   │   ├── apiRateLimit.ts
│   │   ├── enums.ts
│   │   ├── envVars.ts
│   │   ├── httpStatusCode.ts
│   │   ├── jwt.ts
│   │   └── regularExpressions.ts
│   ├── controllers/        # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── image.controller.ts
│   │   └── user.controller.ts
│   ├── db/                 # Database configuration
│   │   ├── connection.ts
│   │   ├── schemas/        # Database schemas
│   │   │   ├── refreshTokenSchema.ts
│   │   │   └── ...
│   │   └── seeds/          # Database seeders
│   ├── error-handling/     # Error handling utilities
│   ├── helpers/            # Helper functions
│   │   ├── applySorting.ts
│   │   ├── buildRawQuery.ts
│   │   ├── checkPermission.ts
│   │   ├── cookie.ts
│   │   ├── generateExecutableQuery.ts
│   │   ├── getPaginatedData.ts
│   │   └── httpResponseGenerator.ts
│   ├── middlewares/        # Express middlewares
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   ├── schemaValidator.ts
│   │   └── tokenValidator.ts
│   ├── routes/             # API routes
│   │   ├── auth.routes.ts
│   │   ├── image.routes.ts
│   │   └── user.routes.ts
│   ├── swagger-docs/       # Swagger documentation
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   │   ├── jwt.ts
│   │   └── image-upload.ts
│   └── validation-schemas/ # Zod validation schemas
│       └── authSchemas/
├── drizzle/                # Database migrations
├── drizzle.config.ts       # Drizzle ORM configuration
├── swagger.js              # Swagger configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

## 🔐 Authentication Flow

1. **Register**: `POST /api/v1/auth/register`
   - Creates a new user account
   - Generates access token (JWT) and refresh token
   - Returns user data and access token
   - Sets refresh token as HTTP-only cookie

2. **Login**: `POST /api/v1/auth/login`
   - Authenticates user credentials
   - Generates access token (JWT) and refresh token
   - Returns user data and access token
   - Sets refresh token as HTTP-only cookie

3. **Refresh Token**: `POST /api/v1/auth/refresh`
   - Uses refresh token (from cookie or body) to get new access token
   - Implements token rotation (old refresh token is revoked, new one issued)
   - Returns new access token and sets new refresh token cookie

4. **Logout**: `POST /api/v1/auth/logout`
   - Revokes refresh token (marks as revoked in database)
   - Clears refresh token cookie
   - User must log in again to get new tokens

5. **Protected Routes**: Include JWT access token in Authorization header

   ```
   Authorization: Bearer <your-access-token>
   ```

   - Access tokens are short-lived (default: 1 hour)
   - Refresh tokens are long-lived (default: 7 days)
   - If refresh token is revoked or deleted, user is automatically logged out

## 📚 API Endpoints

### Public Endpoints (No Authentication Required)

| Method | Endpoint                | Description                              |
| ------ | ----------------------- | ---------------------------------------- |
| `GET`  | `/`                     | Health check - Server status             |
| `POST` | `/api/v1/auth/register` | Register a new user                      |
| `POST` | `/api/v1/auth/login`    | User login                               |
| `POST` | `/api/v1/auth/refresh`  | Get new access token using refresh token |
| `POST` | `/api/v1/auth/logout`   | Revoke refresh token and logout          |

### Protected Endpoints (Authentication Required)

#### User Management

| Method  | Endpoint                           | Description               | Required Permission          | Special Notes                   |
| ------- | ---------------------------------- | ------------------------- | ---------------------------- | ------------------------------- |
| `GET`   | `/api/v1/users`                    | Get all users (paginated) | `read:user`                  | -                               |
| `GET`   | `/api/v1/users/:userID`            | Get user by ID            | `read:user` or own profile   | -                               |
| `PUT`   | `/api/v1/users/:userID`            | Update user details       | `update:user` or own profile | Cannot update deactivated users |
| `PATCH` | `/api/v1/users/:userID/deactivate` | Deactivate a user         | Admin role only              | Cannot self-deactivate          |

### Query Parameters

#### Get Users (`GET /api/v1/users`)

- `page` (number, default: 1) - Page number for pagination
- `limit` (number, default: 10) - Number of items per page
- `sortBy` (string) - Field to sort by
- `sortOrder` (string) - Sort order (`asc` or `desc`)

## 📖 API Documentation

Once the server is running, access the interactive Swagger API documentation at:

```
http://localhost:3000/api-docs
```

The Swagger UI provides:

- Complete API endpoint documentation
- Request/response schemas
- Interactive API testing
- Authentication integration

## 🔒 RBAC System

The application implements a comprehensive Role-Based Access Control system with multiple layers of security:

### Roles

The system supports the following roles:

- **Admin** - Full system access with administrative privileges
- **Cook** - Food preparation and management
- **Delivery** - Delivery management
- **Customer** - Standard customer access

### Permissions

Granular permissions control access to specific operations:

#### User Management

- `create:user` - Create new users
- `read:user` - View user information
- `update:user` - Update user details
- `delete:user` - Delete users

#### Role Management

- `create:role` - Create new roles
- `read:role` - View roles
- `update:role` - Update role details
- `delete:role` - Delete roles

#### Permission Management

- `create:permission` - Create new permissions
- `read:permission` - View permissions
- `update:permission` - Update permission details
- `delete:permission` - Delete permissions

### Role-Based Features

#### Admin-Only Operations

- **User Deactivation**: Only administrators can deactivate user accounts
  - Admins cannot deactivate their own accounts (safety measure)
  - Prevents deactivation of already inactive users
  - Updates audit trail with timestamp

#### Permission Checks

The system performs permission checks at multiple levels:

1. **Role-based**: Verifies user has the required role (e.g., Admin)
2. **Permission-based**: Checks specific permissions assigned to the user's role
3. **Ownership-based**: Users can access their own profile even without broader permissions

### Security Features

- **Self-Protection**: Admins cannot deactivate themselves
- **Audit Trail**: All user modifications include timestamp updates
- **State Validation**: Prevents invalid state transitions (e.g., deactivating already inactive users)
- **Flexible Access**: Users can update their own profiles without requiring admin permissions

## 🗄️ Database Schema

The application uses a custom PostgreSQL schema (`gkk-schema`) with the following main tables:

### Tables

- **`users`** - User accounts with authentication credentials and profile information
  - Fields: `id`, `first_name`, `last_name`, `email`, `password`, `contact_no`, `user_image`, `is_active`, `created_at`, `updated_at`
  - Indexes: Unique on `email` and `contact_no`

- **`refresh_tokens`** - Refresh tokens for session management
  - Fields: `id`, `user_id`, `token_hash`, `expires_at`, `created_at`, `is_revoked`, `replaced_by`, `user_agent`, `ip`
  - Refresh tokens are hashed before storage (bcrypt)
  - Supports token rotation (replaced_by links old tokens to new ones)
  - Tracks user agent and IP for security auditing

- **`roles`** - System roles for RBAC
  - Fields: `id`, `name`, `created_at`, `updated_at`, `deleted_at`
  - Default roles: Admin, Cook, Delivery, Customer

- **`permissions`** - System permissions
  - Fields: `id`, `permission_name`, `action`, `created_at`, `updated_at`, `deleted_at`
  - Uses custom enum type for actions

- **`user_roles`** - User-role associations (many-to-many)
  - Fields: `user_id`, `role_id`, `created_at`, `updated_at`, `deleted_at`

- **`role_permissions`** - Role-permission associations (many-to-many)
  - Fields: `role_id`, `permission_id`, `created_at`, `updated_at`, `deleted_at`

### Schema Features

- **Custom Schema**: All tables are created in the `gkk-schema` schema (not public)
- **Soft Deletes**: Support for `deleted_at` timestamps for data retention
- **Audit Trail**: `created_at` and `updated_at` timestamps on all tables
- **Auto-Update Timestamps**: Database triggers automatically update `updated_at` on every modification
- **Type Safety**: Full TypeScript type inference with Drizzle ORM
- **Relations**: Proper foreign key relationships between tables

> **Important**: The `updated_at` field is automatically managed by PostgreSQL triggers. No manual updates needed in application code. See [DATABASE_TRIGGERS.md](DATABASE_TRIGGERS.md) for details.

## 🚦 Rate Limiting

API endpoints are protected with rate limiting to prevent abuse. Configuration can be found in `src/constants/apiRateLimit.ts`.

## 🐛 Error Handling

The application uses a centralized error handling system with custom error classes:

- `BaseError` - Base error class
- `ExtendedError` - Extended error with additional context
- Middleware-based error handling for consistent error responses

### HTTP Response Helpers

The application provides standardized response helpers for consistent API responses:

- `fetchSuccess()` - Successful data retrieval (200)
- `updateSuccess()` - Successful update operation (200)
- `badRequestRes()` - Invalid request (400)
- `forbiddenRes()` - Insufficient permissions (403)
- `notFoundRes()` - Resource not found (404)

## 🔑 Key Features & Best Practices

### Security Best Practices

1. **Password Security**
   - Passwords are hashed using bcrypt before storage
   - Configurable salt rounds via environment variables
   - Never return passwords in API responses

2. **JWT Token Management**
   - Access tokens are short-lived (configurable via `JWT_EXPIRES_IN_SEC`)
   - Refresh tokens are long-lived (configurable via `REFRESH_TOKEN_EXP_DAYS`)
   - Refresh tokens stored as hashed values in database (bcrypt)
   - Token rotation implemented (old refresh token revoked when new one issued)
   - Refresh tokens set as HTTP-only cookies (prevents XSS attacks)
   - Token validation middleware checks for active refresh tokens
   - If refresh token is revoked/deleted, user is automatically logged out

3. **Input Validation**
   - Zod schemas for request validation
   - Middleware-based schema validation
   - Type-safe validation with TypeScript

4. **Rate Limiting**
   - Protection against brute force attacks
   - Configurable limits per endpoint
   - IP-based rate limiting

### Code Quality

- **TypeScript**: Full type safety across the codebase
- **ESLint**: Code linting for consistency
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks for code quality
- **Path Aliases**: Clean imports using `@` prefix (e.g., `@controllers`, `@helpers`)

### Database Best Practices

- **Migrations**: Version-controlled database schema changes
- **Seeding**: Reproducible initial data setup
- **Type Safety**: Inferred types from schema definitions
- **Custom Schema**: Isolated from default public schema
- **Prepared Statements**: SQL injection prevention via ORM

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues

```bash
# Check if PostgreSQL is running
pg_isready

# Verify connection string format
DB_CONNECTION_STRING=postgresql://username:password@host:port/database
```

#### Migration Issues

```bash
# If migrations fail, try resetting the database
pnpm db:drop
pnpm db:generate
pnpm db:push
```

#### Enum Schema Issues

If enums are created in the public schema instead of `gkk-schema`:

- Ensure you're using `mySchema.enum()` instead of `pgEnum()`
- Regenerate migrations after fixing schema definitions

#### Permission Denied Errors

- Verify your JWT token is valid and not expired
- Check that your user has the required role/permissions
- Admin-only operations require the "Admin" role, not just update permissions

#### Seeding Errors

```bash
# Run seeds in the correct order
pnpm seed:roles
pnpm seed:permissions
pnpm seed:users
pnpm seed:userRoles

# Or use the master seed that handles order automatically
pnpm seed
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **rrchampavat** - _Initial work_

## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- Drizzle ORM team for the type-safe ORM
- All contributors and maintainers
