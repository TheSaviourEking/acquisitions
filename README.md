# Acquisitions API

A modern Node.js REST API built with Express.js, Drizzle ORM, and PostgreSQL, featuring JWT authentication and comprehensive Docker support.

## 🚀 Quick Start

### Local Development (without Docker)

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL and secrets

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

### Docker Development (with Neon Local)

```bash
# Quick start with automated setup
./scripts/dev-start.sh

# Or manual setup:
cp .env.development .env.dev.local
# Edit .env.dev.local with your Neon credentials
docker-compose --env-file .env.dev.local -f docker-compose.dev.yml up --build
```

### Docker Production (with Neon Cloud)

```bash
# Quick deployment
./scripts/prod-deploy.sh

# Or manual deployment:
cp .env.production .env.prod.local
# Edit .env.prod.local with production values
docker-compose --env-file .env.prod.local -f docker-compose.prod.yml up --build -d
```

## 🏗️ Architecture

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM with schema-first approach
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Zod schemas
- **Logging**: Winston with file and console transports
- **Docker**: Multi-stage builds with development and production configurations

## 📋 Available Scripts

### Development
- `npm run dev` - Start development server with file watching
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Database
- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:migrate` - Run pending migrations
- `npm run db:studio` - Open Drizzle Studio (database browser)

### Production
- `npm start` - Start production server

## 🐋 Docker Deployments

This project supports two Docker deployment configurations:

### Development Environment
- **Features**: Neon Local proxy, hot reloading, debug logging
- **Database**: Ephemeral branches via Neon Local
- **Command**: `./scripts/dev-start.sh`
- **Compose File**: `docker-compose.dev.yml`

### Production Environment
- **Features**: Optimized image, production logging, resource limits
- **Database**: Direct connection to Neon Cloud
- **Command**: `./scripts/prod-deploy.sh`
- **Compose File**: `docker-compose.prod.yml`

## 📚 Documentation

- **[Complete Docker Deployment Guide](DOCKER_DEPLOYMENT.md)** - Comprehensive guide for Docker deployments
- **[WARP Development Guide](WARP.md)** - Development guidelines and project architecture

## 🔗 API Endpoints

### Health Checks
- `GET /` - Basic health check
- `GET /health` - Detailed health check with uptime and timestamp
- `GET /api` - API status check

### Authentication
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login (placeholder)
- `POST /api/auth/sign-out` - User logout (placeholder)

## 🔧 Environment Variables

### Required Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens

### Optional Variables
- `LOG_LEVEL` - Logging level (debug/info/warn/error)
- `ARCJET_KEY` - Arcjet security service key

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- HTTP-only cookies for token storage
- CORS and Helmet middleware
- Input validation with Zod schemas
- Non-root Docker user for production

## 📊 Monitoring

### Health Checks
- Built-in health endpoints
- Docker health checks
- Service dependency monitoring

### Logging
- Winston logger with multiple transports
- Structured logging in production
- Log rotation and management

## 🚦 Getting Started

1. **Choose your deployment method:**
   - Local development: Follow "Local Development" section
   - Docker development: Use `./scripts/dev-start.sh`
   - Docker production: Use `./scripts/prod-deploy.sh`

2. **Set up your database:**
   - Create a Neon project at [neon.tech](https://neon.tech)
   - Configure your environment variables
   - Run database migrations

3. **Start developing:**
   - The API will be available at http://localhost:5000
   - Use the health endpoint to verify everything is working
   - Check logs for any issues

## 📝 License

ISC License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

For more detailed information about Docker deployments, please see [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md).