# Docker Deployment Guide

This guide explains how to deploy the Acquisitions API using Docker with different configurations for development and production environments.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Development Environment Setup](#development-environment-setup)
- [Production Environment Setup](#production-environment-setup)
- [Environment Variables](#environment-variables)
- [Database Migrations](#database-migrations)
- [Monitoring and Logs](#monitoring-and-logs)
- [Troubleshooting](#troubleshooting)

## Overview

The application supports two deployment modes:

### Development Mode

- **Database**: Uses **Neon Local** proxy running in Docker
- **Features**: Hot reloading, debug logging, ephemeral database branches
- **File**: `docker-compose.dev.yml`
- **Environment**: `.env.development`

### Production Mode

- **Database**: Connects directly to **Neon Cloud Database**
- **Features**: Optimized image, production logging, resource limits
- **File**: `docker-compose.prod.yml`
- **Environment**: `.env.production`

## Prerequisites

1. **Docker** and **Docker Compose** installed
2. **Neon Cloud Account** with a project set up
3. **Neon API Key** (get from [Neon Console](https://console.neon.tech/))
4. **Node.js** (for local development without Docker)

## Development Environment Setup

### Step 1: Configure Development Environment

1. **Copy and configure the development environment file:**

    ```bash
    cp .env.development .env.dev.local
    ```

2. **Update `.env.dev.local` with your Neon credentials:**

    ```bash
    # Replace these with your actual Neon values
    NEON_API_KEY=your_actual_neon_api_key_here
    NEON_PROJECT_ID=your_actual_project_id_here
    PARENT_BRANCH_ID=your_parent_branch_id_here
    JWT_SECRET=your_development_jwt_secret
    ARCJET_KEY=your_arcjet_key_here
    ```

    > **Note**: You can find these values in your [Neon Console](https://console.neon.tech/).

### Step 2: Start Development Environment

```bash
# Start the development environment with Neon Local
docker-compose --env-file .env.dev.local -f docker-compose.dev.yml up --build

# Or run in detached mode
docker-compose --env-file .env.dev.local -f docker-compose.dev.yml up -d --build
```

### Step 3: Verify Development Setup

1. **Check application health:**

    ```bash
    curl http://localhost:5000/health
    ```

2. **Check logs:**

    ```bash
    # View application logs
    docker-compose -f docker-compose.dev.yml logs app

    # View Neon Local logs
    docker-compose -f docker-compose.dev.yml logs neon-local
    ```

3. **Access services:**
    - **Application**: http://localhost:5000
    - **Database**: localhost:5432 (accessible via any PostgreSQL client)

### Development Features

- **Hot Reloading**: Code changes are automatically reflected
- **Ephemeral Branches**: Each container restart creates a fresh database branch
- **Debug Logging**: Detailed logs for development
- **Volume Mounts**: Source code is mounted for real-time updates

## Production Environment Setup

### Step 1: Configure Production Environment

1. **Copy and configure the production environment file:**

    ```bash
    cp .env.production .env.prod.local
    ```

2. **Update `.env.prod.local` with your production values:**

    ```bash
    # Replace with your actual Neon Cloud database URL
    DATABASE_URL=postgresql://username:password@ep-hostname.region.neon.tech/database_name?sslmode=require

    # Use a strong, random JWT secret for production
    JWT_SECRET=your_super_strong_production_jwt_secret_here

    # Your production Arcjet key
    ARCJET_KEY=your_production_arcjet_key_here
    ```

### Step 2: Deploy Production Environment

```bash
# Build and start production environment
docker-compose --env-file .env.prod.local -f docker-compose.prod.yml up --build -d
```

### Step 3: Verify Production Setup

1. **Check application status:**

    ```bash
    curl http://localhost:5000/health
    ```

2. **Monitor logs:**
    ```bash
    docker-compose -f docker-compose.prod.yml logs -f app
    ```

### Production Features

- **Optimized Docker Image**: Multi-stage build with minimal production image
- **Resource Limits**: CPU and memory constraints
- **Security**: Runs as non-root user
- **Log Management**: Structured logging with rotation
- **Health Checks**: Built-in health monitoring

## Environment Variables

### Development Variables

| Variable           | Description                          | Example                                                            |
| ------------------ | ------------------------------------ | ------------------------------------------------------------------ |
| `NEON_API_KEY`     | Your Neon API key                    | `your_neon_api_key`                                                |
| `NEON_PROJECT_ID`  | Your Neon project ID                 | `your_project_id`                                                  |
| `PARENT_BRANCH_ID` | Parent branch for ephemeral branches | `br_xyz123`                                                        |
| `DATABASE_URL`     | Local connection to Neon Local       | `postgresql://neondb_owner:neondb_password@neon-local:5432/neondb` |
| `JWT_SECRET`       | Development JWT secret               | `dev_secret_123`                                                   |

### Production Variables

| Variable       | Description                     | Example                                              |
| -------------- | ------------------------------- | ---------------------------------------------------- |
| `DATABASE_URL` | Neon Cloud database URL         | `postgresql://user:pass@ep-host.region.neon.tech/db` |
| `JWT_SECRET`   | Production JWT secret (strong!) | `super_secure_production_secret`                     |
| `NODE_ENV`     | Environment mode                | `production`                                         |
| `LOG_LEVEL`    | Logging level                   | `info`                                               |

## Database Migrations

### Development (with Neon Local)

```bash
# Run migrations against Neon Local
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Generate new migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:generate

# Open Drizzle Studio (optional)
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

### Production (with Neon Cloud)

```bash
# Run migrations against production database
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate

# Generate migrations (typically done in development)
docker-compose -f docker-compose.prod.yml exec app npm run db:generate
```

## Monitoring and Logs

### Viewing Logs

```bash
# Development logs
docker-compose -f docker-compose.dev.yml logs -f app
docker-compose -f docker-compose.dev.yml logs -f neon-local

# Production logs
docker-compose -f docker-compose.prod.yml logs -f app
```

### Log Files

- **Development**: `./logs/` directory (mounted volume)
- **Production**: Docker volume `acquisitions-prod-logs`

### Health Checks

Both environments include health checks:

```bash
# Check container health status
docker ps

# Manual health check
curl http://localhost:5000/health
```

## Useful Commands

### Development

```bash
# Start development environment
docker-compose --env-file .env.dev.local -f docker-compose.dev.yml up -d

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# Rebuild and restart
docker-compose --env-file .env.dev.local -f docker-compose.dev.yml up --build --force-recreate

# Execute commands in running container
docker-compose -f docker-compose.dev.yml exec app npm run lint
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate
```

### Production

```bash
# Start production environment
docker-compose --env-file .env.prod.local -f docker-compose.prod.yml up -d

# Stop production environment
docker-compose -f docker-compose.prod.yml down

# View resource usage
docker stats acquisitions-app-prod

# Execute commands in production container
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

## Troubleshooting

### Common Issues

1. **Neon Local Connection Issues**

    ```bash
    # Check if Neon Local is running
    docker-compose -f docker-compose.dev.yml ps neon-local

    # Check Neon Local logs
    docker-compose -f docker-compose.dev.yml logs neon-local
    ```

2. **Environment Variable Issues**

    ```bash
    # Verify environment variables are loaded
    docker-compose -f docker-compose.dev.yml exec app printenv | grep NEON
    ```

3. **Database Connection Issues**

    ```bash
    # Test database connectivity
    docker-compose -f docker-compose.dev.yml exec app node -e "
    import { db } from './src/config/database.js';
    console.log('Database connection test...');
    "
    ```

4. **Permission Issues**
    ```bash
    # Fix logs directory permissions
    sudo chown -R $USER:$USER ./logs
    ```

### Reset Development Environment

```bash
# Stop and remove all containers, networks, and volumes
docker-compose -f docker-compose.dev.yml down -v --remove-orphans

# Remove images (optional)
docker-compose -f docker-compose.dev.yml down --rmi all

# Start fresh
docker-compose --env-file .env.dev.local -f docker-compose.dev.yml up --build
```

### Debug Mode

To run with more detailed debugging:

```bash
# Development with debug output
DEBUG=* docker-compose --env-file .env.dev.local -f docker-compose.dev.yml up

# Check container resource usage
docker stats
```

## Security Notes

1. **Never commit `.env.*.local` files** - they contain sensitive credentials
2. **Use strong JWT secrets** in production
3. **Regularly rotate API keys** and database passwords
4. **Enable SSL/TLS** in production (consider adding nginx proxy)
5. **Monitor logs** for suspicious activities

## Next Steps

- Set up CI/CD pipeline for automated deployments
- Configure monitoring and alerting (Prometheus, Grafana)
- Set up SSL/TLS with reverse proxy (nginx)
- Implement backup strategies for production data
- Set up log aggregation (ELK stack, Fluentd)
