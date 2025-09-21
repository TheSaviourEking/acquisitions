# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Start development server with file watching
npm run dev

# Start production server
npm start

# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

### Database Operations
```bash
# Generate new migration files from schema changes
npm run db:generate

# Run pending migrations
npm run db:migrate

# Open Drizzle Studio (database browser)
npm run db:studio
```

## Project Architecture

### Tech Stack
- **Runtime**: Node.js with ES modules (`"type": "module"`)
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM with schema-first approach
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Zod schemas
- **Logging**: Winston with file and console transports
- **Security**: Helmet, CORS, cookie-parser

### Directory Structure
```
src/
├── config/          # Configuration files (database, logger)
├── controllers/     # Request handlers and business logic
├── models/          # Drizzle ORM database schemas
├── routes/          # Express route definitions
├── services/        # Business logic layer
├── utils/           # Helper utilities (JWT, cookies, formatting)
└── validations/     # Zod validation schemas
```

### Path Aliases
The project uses Node.js subpath imports for clean imports:
- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Driver**: Neon serverless for edge-compatible PostgreSQL connections
- **Migrations**: Located in `drizzle/` directory, managed via drizzle-kit
- **Schema**: Defined in `src/models/*.js` files
- **Current Tables**: Users table with authentication fields (id, name, email, password, role, timestamps)

### Authentication Flow
1. **User Registration**: POST `/api/auth/sign-up`
   - Validates input with Zod schema
   - Hashes password with bcrypt (10 rounds)
   - Creates user in database
   - Returns JWT token and sets HTTP-only cookie

2. **JWT Implementation**: 
   - Uses `jsonwebtoken` library
   - 1-day expiration by default
   - Payload includes: user ID, email, role
   - Secret key from environment (`JWT_SECRET`)

### Validation Strategy
- All input validation uses Zod schemas
- Validation schemas located in `src/validations/`
- Custom error formatting utility in `src/utils/format.js`
- Failed validation returns structured error responses

### Logging Configuration
- Winston logger with multiple transports
- File logging: `logs/error.log` (errors only) and `logs/combined.log` (all levels)
- Console logging in non-production environments
- Configurable log level via `LOG_LEVEL` environment variable
- Service identifier: `acquisitions-api`

### Code Style
- **ESLint**: Modern flat config with recommended rules
- **Prettier**: 4-space indentation, single quotes, Unix line endings
- **Rules**: No unused variables (except prefixed with `_`), prefer const, no var, arrow functions preferred
- **Ignored**: node_modules, coverage, logs, drizzle directories

## Environment Setup

### Required Environment Variables
```bash
# Server
PORT=5000
NODE_ENV=development
LOG_LEVEL=info

# Database
DATABASE_URL='postgresql://user:password@host:port/database'

# Security (add to .env, not .env.example)
JWT_SECRET='your-secret-key-please-change-in-production'
```

### Database Setup
1. Set up PostgreSQL database (Neon recommended)
2. Configure `DATABASE_URL` in `.env`
3. Run `npm run db:generate` to create initial migrations
4. Run `npm run db:migrate` to apply migrations

## API Endpoints

### Health Checks
- `GET /` - Basic health check
- `GET /health` - Detailed health check with uptime and timestamp
- `GET /api` - API status check

### Authentication
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login (placeholder)
- `POST /api/auth/sign-out` - User logout (placeholder)

## Development Patterns

### Service Layer Pattern
- Controllers handle HTTP concerns (request/response)
- Services contain business logic and database operations
- Clear separation of concerns between layers

### Error Handling
- Service layer throws descriptive errors
- Controllers catch and format errors appropriately
- Validation errors return 400 with details
- Business logic errors (e.g., duplicate email) return appropriate status codes

### Security Practices
- Passwords hashed with bcrypt before storage
- JWT tokens for stateless authentication
- HTTP-only cookies for token storage
- CORS and Helmet middleware for security headers

### Database Patterns
- Schema-first approach with Drizzle ORM
- Type-safe database operations
- Migration-based schema changes
- Returning specific fields from database operations (not full records)