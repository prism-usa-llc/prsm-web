# PRSM USA Production Deployment Checklist

## Pre-Deployment Checklist

### Domain & SSL
- [ ] Domain DNS configured to point to server
- [ ] SSL certificate installed and configured
- [ ] HTTPS redirects working properly
- [ ] SSL certificate auto-renewal configured

### Server Setup
- [ ] Server meets minimum requirements (2GB RAM, 1GB disk space)
- [ ] All required packages installed (Python 3.12+, Nginx, Redis, SQLite3)
- [ ] Firewall configured (ports 80, 443, 22 only)
- [ ] Fail2ban or similar intrusion prevention configured

### Application Setup
- [ ] Code deployed to production server
- [ ] Virtual environment created with `./deploy.sh setup`
- [ ] All environment variables configured
- [ ] Database initialized and secured
- [ ] Redis server running and secured

### Nginx Configuration
- [ ] Nginx configuration updated with production domain
- [ ] Static file serving configured
- [ ] API proxy configuration tested
- [ ] Gzip compression enabled
- [ ] Security headers configured
- [ ] Rate limiting configured

### Security Checklist
- [ ] Server hardened (disable root login, key-based SSH only)
- [ ] Application runs as non-root user
- [ ] Database files have proper permissions
- [ ] API rate limiting configured
- [ ] CORS origins restricted to production domain
- [ ] All default passwords changed
- [ ] Backup strategy implemented

### Performance Optimization
- [ ] Static files served with proper caching headers
- [ ] CSS and JS minified (if applicable)
- [ ] Images optimized
- [ ] Redis configured for production workload
- [ ] Database query optimization completed

### Monitoring & Logging
- [ ] Log rotation configured
- [ ] Monitoring system set up (optional: Prometheus/Grafana)
- [ ] Error alerting configured
- [ ] Backup monitoring configured
- [ ] SSL certificate expiration monitoring

## Deployment Commands

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install required packages
sudo apt install nginx redis-server sqlite3 python3 python3-venv python3-pip -y

# 3. Clone repository
git clone <repository-url> /home/user/prsm-web

# 4. Set up application
cd /home/user/prsm-web
./deploy.sh setup

# 5. Start services
./deploy.sh start
sudo systemctl start nginx
sudo systemctl start redis-server

# 6. Enable services at boot
sudo systemctl enable nginx
sudo systemctl enable redis-server

# 7. Test deployment
./deploy.sh test
```

## Post-Deployment Verification

### Functional Tests
- [ ] Website loads correctly at https://prsmusa.com
- [ ] All navigation links work
- [ ] Contact form submits successfully
- [ ] API endpoints respond correctly
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility tested

### Performance Tests
- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Static files load quickly
- [ ] Forms submit quickly

### Security Tests
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] SSL certificate valid and trusted
- [ ] No sensitive information exposed in client-side code
- [ ] API endpoints properly secured
- [ ] No SQL injection vulnerabilities
- [ ] XSS protection verified

## Maintenance Tasks

### Daily
- [ ] Check system logs for errors
- [ ] Monitor disk space usage
- [ ] Verify all services running

### Weekly
- [ ] Update system packages
- [ ] Review and rotate logs
- [ ] Check SSL certificate status
- [ ] Database backup verification

### Monthly
- [ ] Full security audit
- [ ] Performance review
- [ ] Dependency updates
- [ ] Backup restore test

## Emergency Procedures

### Service Down
1. Check service status: `./deploy.sh status`
2. View logs: `./deploy.sh logs`
3. Restart services: `./deploy.sh restart`
4. Check nginx: `sudo systemctl status nginx`
5. Check redis: `sudo systemctl status redis-server`

### High CPU/Memory Usage
1. Check processes: `top` or `htop`
2. Check logs for errors
3. Restart application: `./deploy.sh restart`
4. Monitor resource usage

### Database Issues
1. Check database file permissions
2. Verify disk space
3. Check database integrity
4. Restore from backup if necessary

## Contact Information

**Production Support:**
- Primary: System Administrator
- Secondary: Development Team
- Emergency: On-call engineer

**Escalation Procedures:**
1. Check logs and attempt basic troubleshooting
2. Contact system administrator
3. If critical, contact development team
4. Document all actions taken

## Rollback Procedures

If deployment fails:
1. Stop new services: `./deploy.sh stop`
2. Restore previous code version
3. Restore database backup if needed
4. Restart services with previous version
5. Verify system functionality
6. Document incident and lessons learned
