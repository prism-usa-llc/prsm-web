# PRISM USA LLC - Business Website

A modern, professional website for PRISM USA LLC showcasing software services for small businesses. Built with Next.js, Docker, and nginx reverse proxy.

## 🚀 Features

### Services Showcased
- **Scout Network Monitoring** - Comprehensive network monitoring with diagnostics
- **SmartLine Queue Management** - Revolutionary QR code-based queue system
- **Custom Software Development** - Tailored business solutions
- **Network Installation & IT Services** - Professional network setup and support

### Website Features
- **Modern Design** - Professional, mobile-first responsive design
- **Contact Forms** - Quote requests with email notifications
- **Performance Optimized** - Fast loading with Next.js and optimized assets
- **Security** - Rate limiting, CORS protection, and secure headers
- **Professional Content** - Business-focused copy targeting small business owners

## 🏗️ Architecture

### Services
- **Web Frontend** (Next.js) - Port 3000
- **API Backend** (Express.js) - Port 3001  
- **nginx Reverse Proxy** - Port 80

### Technology Stack
- **Frontend**: Next.js 14, React 18, TailwindCSS, Framer Motion
- **Backend**: Express.js with email handling
- **Infrastructure**: Docker, Docker Compose, nginx
- **Email**: Nodemailer with SMTP support

## 📋 Quick Start

### Prerequisites
- Docker and Docker Compose
- SMTP email credentials (Gmail, SendGrid, etc.)

### 1. Clone and Setup
```bash
git clone <repository>
cd prsm-web
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your email settings
```

Required environment variables:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=info@prsmusa.com
```

### 3. Launch Application
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Access Website
- **Website**: http://localhost
- **API Health**: http://localhost/api/health

## 🛠️ Development

### Local Development
```bash
# Frontend development
cd web
npm install
npm run dev

# Backend development  
cd api
npm install
npm run dev
```

### Project Structure
```
prsm-web/
├── web/                    # Next.js frontend
│   ├── components/         # React components
│   ├── pages/              # Next.js pages
│   ├── styles/             # CSS and Tailwind
│   └── public/             # Static assets
├── api/                    # Express.js backend
│   ├── server.js           # Main server file
│   └── package.json        # Dependencies
├── nginx/                  # nginx configuration
│   └── nginx.conf          # Reverse proxy config
└── docker-compose.yml      # Container orchestration
```

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-factor authentication
2. Generate App Password
3. Use app password in SMTP_PASS

### Other Providers
Update SMTP settings in `.env`:
- **SendGrid**: smtp.sendgrid.net:587
- **Mailgun**: smtp.mailgun.org:587  
- **AWS SES**: email-smtp.region.amazonaws.com:587

## 🔧 Configuration

### nginx Reverse Proxy
- Handles SSL termination (configure certificates for production)
- Rate limiting (30 requests/min general, 5 requests/min contact)
- Security headers
- CORS handling

### Contact Form Features
- **Validation**: Server-side validation with express-validator
- **Rate Limiting**: Prevents spam (5 submissions per 15 minutes)
- **Dual Emails**: Sends to business + confirmation to customer
- **Security**: Sanitization and validation of all inputs

## 🚀 Production Deployment

### SSL/HTTPS Setup
1. Obtain SSL certificates (Let's Encrypt recommended)
2. Update nginx.conf with SSL configuration
3. Add HTTPS redirect

### Security Checklist
- [ ] Update all default credentials
- [ ] Configure firewall rules
- [ ] Set up SSL certificates  
- [ ] Configure email provider
- [ ] Set NODE_ENV=production
- [ ] Review rate limiting settings
- [ ] Set up monitoring/logging

### Recommended Improvements
1. **Analytics** - Add Google Analytics or similar
2. **SEO** - Meta tags, sitemap, structured data
3. **Performance** - CDN, image optimization
4. **Monitoring** - Application monitoring, uptime checks
5. **Backup** - Automated backups of configurations
6. **CMS** - Content management for easy updates

## 📞 Support

For technical support and customization:
- **Website**: prsmusa.com
- **Email**: prsmusallc@gmail.com 
- **Phone**: (626) 513-1204

## 📄 License

© 2024 PRISM USA LLC. All rights reserved.

---

## Business Impact

This website positions PRISM USA LLC as a professional software service provider for small businesses, highlighting:

- **Affordability** - Competitive pricing for small business budgets
- **Professionalism** - Enterprise-grade solutions without enterprise costs  
- **Support** - Dedicated personal service and quick response times
- **Innovation** - Cutting-edge solutions like SmartLine queue management

The modern design and clear service descriptions help convert visitors into leads through the integrated contact system.