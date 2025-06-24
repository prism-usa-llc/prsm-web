# PRSM Website

A modern, scalable website for PRSM with enhanced contact functionality, comprehensive bot protection, and admin capabilities.

## Features

- **Modern React + TypeScript Frontend** with responsive design
- **FastAPI Backend** with PostgreSQL database
- **Multi-layered Bot Protection** (honeypots, rate limiting, timing analysis)
- **Admin Dashboard** for managing contact submissions
- **JWT Authentication** with role-based access control
- **Database Migrations** with Alembic
- **Redis Caching** for performance and rate limiting

## Quick Start (Docker)

1. Copy environment file: `cp .env.example .env`
2. Update database credentials in `.env`
3. Run: `docker-compose up -d`
4. Create admin user: `docker-compose exec backend python create_admin_user.py`
5. Access at `http://localhost:8080`

## Traditional Server Setup (Ubuntu)

### Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget gnupg2 software-properties-common apt-transport-https ca-certificates

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3.11
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3.11-dev python3-pip

# Install PostgreSQL 15
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install -y postgresql-15 postgresql-client-15

# Install Redis
sudo apt install -y redis-server

# Install Nginx
sudo apt install -y nginx

# Install PM2 for process management
sudo npm install -g pm2
```

### Database Setup

```bash
# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE prsm_db;
CREATE USER prsm_user WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE prsm_db TO prsm_user;
ALTER USER prsm_user CREATEDB;
\q
EOF
```

### Redis Setup

```bash
# Configure Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test Redis
redis-cli ping
# Should return: PONG
```

### Application Setup

#### 1. Clone and Setup Backend

```bash
# Clone repository (if not already done)
git clone <your-repo-url>
cd prsm-web

# Create Python virtual environment
cd api/fastapi
python3.11 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create environment file
cp ../../.env.example .env

# Edit environment file
nano .env
```

**Update `.env` file:**
```bash
# Database Configuration
POSTGRES_DB=prsm_db
POSTGRES_USER=prsm_user
POSTGRES_PASSWORD=secure_password_123

# Application Configuration
DATABASE_URL=postgresql+asyncpg://prsm_user:secure_password_123@localhost:5432/prsm_db
SECRET_KEY=your-very-secure-secret-key-change-this-in-production
ENVIRONMENT=production

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# CORS and Security
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,localhost
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,http://localhost:3000
```

#### 2. Initialize Database

```bash
# Run database migrations
alembic upgrade head

# Create first admin user
python create_admin_user.py
```

#### 3. Setup Frontend

```bash
# Navigate to frontend directory
cd ../../fe/vite-project

# Install Node.js dependencies
npm install

# Build for production
npm run build
```

### Process Management with PM2

#### 1. Create PM2 Configuration

```bash
# Create PM2 ecosystem file
cat > /home/ubuntu/prsm-web/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'prsm-backend',
      cwd: '/home/ubuntu/prsm-web/api/fastapi',
      script: 'venv/bin/uvicorn',
      args: 'main:app --host 0.0.0.0 --port 8000 --workers 4',
      env: {
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql+asyncpg://prsm_user:secure_password_123@localhost:5432/prsm_db',
        SECRET_KEY: 'your-very-secure-secret-key-change-this-in-production',
        REDIS_URL: 'redis://localhost:6379/0'
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/log/prsm/backend-error.log',
      out_file: '/var/log/prsm/backend-out.log',
      log_file: '/var/log/prsm/backend.log'
    }
  ]
};
EOF

# Create log directory
sudo mkdir -p /var/log/prsm
sudo chown $USER:$USER /var/log/prsm
```

#### 2. Start Services with PM2

```bash
# Start backend with PM2
cd /home/ubuntu/prsm-web
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
# Follow the instructions provided by the command

# Check status
pm2 status
pm2 logs prsm-backend
```

### Nginx Configuration

#### 1. Create Nginx Site Configuration

```bash
# Create site configuration
sudo tee /etc/nginx/sites-available/prsm << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration (update paths to your certificates)
    ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Static files (frontend)
    location / {
        root /home/ubuntu/prsm-web/fe/vite-project/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API endpoints (backend)
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
    }
    
    # Admin interface
    location /admin {
        root /home/ubuntu/prsm-web/fe/vite-project/dist;
        try_files $uri $uri/ /index.html;
    }
}

# Rate limiting zone
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
}
EOF
```

#### 2. Enable Site and Start Nginx

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/prsm /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### SSL Certificate Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Setup automatic renewal
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### Firewall Setup

```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Check status
sudo ufw status
```

### System Service Files (Alternative to PM2)

If you prefer systemd over PM2:

```bash
# Create systemd service for backend
sudo tee /etc/systemd/system/prsm-backend.service << 'EOF'
[Unit]
Description=PRSM Backend API
After=network.target postgresql.service redis.service

[Service]
Type=exec
User=ubuntu
Group=ubuntu
WorkingDirectory=/home/ubuntu/prsm-web/api/fastapi
Environment=DATABASE_URL=postgresql+asyncpg://prsm_user:secure_password_123@localhost:5432/prsm_db
Environment=SECRET_KEY=your-very-secure-secret-key-change-this-in-production
Environment=REDIS_URL=redis://localhost:6379/0
ExecStart=/home/ubuntu/prsm-web/api/fastapi/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable prsm-backend.service
sudo systemctl start prsm-backend.service

# Check status
sudo systemctl status prsm-backend.service
```

## Monitoring and Maintenance

### Log Files

```bash
# View application logs
pm2 logs prsm-backend

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log

# View Redis logs
sudo journalctl -u redis-server -f
```

### Database Backup

```bash
# Create backup script
cat > /home/ubuntu/backup-prsm.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U prsm_user -d prsm_db > $BACKUP_DIR/prsm_db_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "prsm_db_*.sql" -mtime +7 -delete

echo "Backup completed: prsm_db_$DATE.sql"
EOF

chmod +x /home/ubuntu/backup-prsm.sh

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup-prsm.sh
```

### Health Checks

```bash
# Check all services
systemctl status postgresql redis-server nginx prsm-backend

# Test API health
curl http://localhost:8000/api/health

# Test frontend
curl -I http://localhost/

# Check database connection
psql -h localhost -U prsm_user -d prsm_db -c "SELECT 1;"
```

### Performance Tuning

#### PostgreSQL Optimization

```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/15/main/postgresql.conf

# Recommended settings for production:
# shared_buffers = 256MB
# effective_cache_size = 1GB
# work_mem = 4MB
# maintenance_work_mem = 64MB
# max_connections = 100

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### Redis Optimization

```bash
# Edit Redis configuration
sudo nano /etc/redis/redis.conf

# Recommended settings:
# maxmemory 512mb
# maxmemory-policy allkeys-lru
# save 900 1
# save 300 10

# Restart Redis
sudo systemctl restart redis-server
```

## Security Checklist

- [ ] Change default passwords
- [ ] Configure SSL certificates
- [ ] Set up firewall rules
- [ ] Configure rate limiting in Nginx
- [ ] Set secure environment variables
- [ ] Enable fail2ban for SSH protection
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Backup database regularly
- [ ] Use strong JWT secret keys

## Troubleshooting

### Common Issues

1. **Backend won't start**: Check database connection and Redis availability
2. **Frontend 404 errors**: Verify Nginx configuration and static file paths
3. **Database connection errors**: Check PostgreSQL service and credentials
4. **High memory usage**: Monitor PM2 processes and restart if needed
5. **SSL certificate errors**: Verify certificate paths and renewal

### Useful Commands

```bash
# Restart all services
sudo systemctl restart postgresql redis-server nginx
pm2 restart prsm-backend

# Check service status
pm2 status
sudo systemctl status postgresql redis-server nginx

# View real-time logs
pm2 logs --lines 50
sudo tail -f /var/log/nginx/error.log

# Database operations
psql -h localhost -U prsm_user -d prsm_db
alembic upgrade head

# Frontend rebuild
cd /home/ubuntu/prsm-web/fe/vite-project
npm run build
```

## Support

For issues and questions:
- Check the logs first
- Verify all services are running
- Ensure database connectivity
- Review environment variables
- Check file permissions

The application should now be accessible at your domain with full functionality including the contact form with bot protection and admin dashboard.