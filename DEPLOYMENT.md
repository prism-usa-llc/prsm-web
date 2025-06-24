# PRSM Website Deployment Guide

This guide covers the complete deployment process for the PRSM website with enhanced contact form and admin capabilities.

## Quick Start

1. Clone the repository
2. Copy `.env.example` to `.env` and configure
3. Run `docker-compose up -d`
4. Create admin user: `cd api/fastapi && python create_admin_user.py`
5. Access the site at `http://localhost` and admin at `http://localhost/admin`

## Prerequisites

- Docker and Docker Compose
- PostgreSQL 15+ (if not using Docker)
- Redis (if not using Docker)
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

## Environment Configuration

Copy `.env.example` to `.env` and update the following variables:

```bash
# Database Configuration
POSTGRES_DB=prsm_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here

# Application Configuration
DATABASE_URL=postgresql+asyncpg://postgres:your_password@localhost:5432/prsm_db
SECRET_KEY=your-secret-key-here-change-in-production
ENVIRONMENT=production

# CORS and Security
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Deployment Options

### Option 1: Docker Compose (Recommended)

This is the easiest way to deploy the complete stack:

```bash
# 1. Start all services
docker-compose up -d

# 2. Check service status
docker-compose ps

# 3. Create admin user
docker-compose exec backend python create_admin_user.py

# 4. View logs
docker-compose logs -f
```

### Option 2: Manual Deployment

#### Backend Setup

```bash
cd api/fastapi

# Install dependencies
pip install -r requirements.txt

# Set up database
createdb prsm_db
alembic upgrade head

# Create admin user
python create_admin_user.py

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd fe/vite-project

# Install dependencies
npm install

# Build for production
npm run build

# Serve with a web server
npx serve -s dist -l 3000
```

## Database Setup

### Using Docker (Automatic)

When using Docker Compose, PostgreSQL is automatically set up with the correct schema.

### Manual Setup

```bash
# 1. Create database
createdb prsm_db

# 2. Run migrations
cd api/fastapi
alembic upgrade head

# 3. Create first admin user
python create_admin_user.py
```

## SSL/HTTPS Setup

### Using Let's Encrypt with Docker

1. Update `nginx/nginx.conf` with your domain
2. Run Certbot container:

```bash
docker run -it --rm \
  -v $(pwd)/nginx/ssl:/etc/letsencrypt \
  -v $(pwd)/nginx/webroot:/var/www/html \
  certbot/certbot certonly --webroot \
  -w /var/www/html \
  -d yourdomain.com \
  -d www.yourdomain.com
```

3. Update nginx configuration to use SSL certificates
4. Restart nginx: `docker-compose restart nginx`

## Monitoring and Maintenance

### Health Checks

The system includes health check endpoints:

- Backend health: `GET /api/health`
- Database connectivity is checked automatically

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Database Backups

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres prsm_db > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres prsm_db < backup.sql
```

## Security Considerations

### Environment Variables

- Change all default passwords
- Use strong, unique SECRET_KEY
- Set proper CORS origins for production
- Use environment-specific configuration

### Bot Protection

The contact form includes multiple layers of bot protection:

- Honeypot fields
- Rate limiting (5 submissions per minute per IP)
- Form token validation
- Timing analysis
- Content analysis
- IP tracking

### Admin Security

- Admin panel requires authentication
- JWT tokens with expiration
- Role-based access control
- Secure password hashing (bcrypt)

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL environment variable
   - Ensure PostgreSQL is running
   - Verify firewall settings

2. **Admin Login Not Working**
   - Ensure admin user was created: `python create_admin_user.py`
   - Check SECRET_KEY is set consistently
   - Verify JWT token generation

3. **Contact Form Not Submitting**
   - Check CORS configuration
   - Verify API endpoints are accessible
   - Check rate limiting settings

4. **Docker Services Not Starting**
   - Check port conflicts: `docker-compose ps`
   - Review logs: `docker-compose logs`
   - Ensure enough disk space and memory

### Debug Mode

For development, you can enable debug mode:

```bash
# In .env file
ENVIRONMENT=development

# This enables:
# - Detailed error messages
# - API documentation at /docs
# - Database query logging
```

## Performance Optimization

### Database

- Indexes are automatically created for frequently queried fields
- Connection pooling is configured in SQLAlchemy
- Database queries use async/await for better performance

### Frontend

- Static assets are cached with appropriate headers
- JavaScript and CSS are minified in production
- Images are optimized during build

### Backend

- Rate limiting prevents abuse
- Redis caching for form tokens and rate limiting
- Async request handling with FastAPI

## Scaling

### Horizontal Scaling

To scale beyond a single server:

1. Use a load balancer (nginx, HAProxy, AWS ALB)
2. Deploy multiple backend instances
3. Use external PostgreSQL service (AWS RDS, Google Cloud SQL)
4. Use external Redis service (AWS ElastiCache, Redis Cloud)

### Vertical Scaling

Increase resources in Docker Compose:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
```

## Support

For issues related to:

- **Deployment**: Check this documentation and logs
- **Development**: Review the code structure and API documentation
- **Security**: Follow security best practices outlined above

## Updates

To update the system:

1. Pull latest code: `git pull`
2. Rebuild containers: `docker-compose up -d --build`
3. Run database migrations: `docker-compose exec backend alembic upgrade head`
4. Test functionality