# PRSM USA - Custom Software Solutions

## Project Overview

PRSM USA is a comprehensive web application showcasing custom software solutions with emphasis on SMS text messaging alerts, queue management systems, and IT consulting services for small businesses.

## Architecture

### Frontend

- **Technology**: HTML5, CSS3, Vanilla JavaScript
- **Location**: `/fe/` directory
- **Features**:
  - Responsive design
  - Modern UI with smooth animations
  - Contact form integration
  - SEO optimized

### Backend

- **Technology**: FastAPI (Python)
- **Location**: `/api/fastapi/` directory
- **Port**: 8002
- **Features**:
  - RESTful API
  - CORS enabled
  - Contact form processing
  - Session management
  - Redis integration

### Database

- **SQLite3**: Customer data storage
- **Redis**: Session management and caching

### Web Server

- **Nginx**: Reverse proxy and static file serving
- **Main Configuration**: `/fe/etc/nginx/nginx.conf`
- **Site Configuration**: `/fe/etc/nginx/sites-enabled/prsmusa.nginx.conf`

## Quick Start

### Prerequisites

- Python 3.12+
- Node.js (optional, for additional tools)
- Nginx
- Redis server
- SQLite3

### Installation & Setup

1. **Clone and navigate to project**:

   ```bash
   cd /home/rmintz/github/prsm-web
   ```

2. **Set up the environment**:

   ```bash
   ./deploy.sh setup
   ```

3. **Start the backend**:

   ```bash
   ./deploy.sh start
   ```

4. **Check status**:

   ```bash
   ./deploy.sh status
   ```

5. **Test API endpoints**:
   ```bash
   ./deploy.sh test
   ```

## Deployment Script Commands

The `deploy.sh` script provides comprehensive management:

- `./deploy.sh setup` - Set up the development environment
- `./deploy.sh start` - Start the FastAPI backend
- `./deploy.sh stop` - Stop the FastAPI backend
- `./deploy.sh restart` - Restart the FastAPI backend
- `./deploy.sh status` - Check system status
- `./deploy.sh test` - Test API endpoints
- `./deploy.sh logs` - Show FastAPI logs

## Directory Structure

```
prsm-web/
├── api/
│   └── fastapi/
│       ├── main.py              # FastAPI application
│       ├── requirements.txt     # Python dependencies
│       ├── venv/               # Virtual environment
│       ├── session/            # Session management
│       ├── sqlite3/            # Database files
│       └── static/             # Static assets
├── fe/
│   ├── index.html              # Main webpage
│   ├── styles.css              # Stylesheet
│   ├── script.js               # JavaScript functionality
│   ├── sitemap.xml             # SEO sitemap
│   ├── robots.txt              # Search engine instructions
│   ├── README.md               # Frontend documentation
│   └── etc/
│       └── nginx/
│           ├── nginx.conf      # Main nginx configuration
│           └── sites-enabled/
│               └── prsmusa.nginx.conf  # Site-specific configuration
├── utils/
│   └── start_fastapi.sh        # FastAPI startup script
└── deploy.sh                   # Main deployment script
```

## API Endpoints

### Public Endpoints

- `GET /` - Root endpoint
- `POST /contact` - Contact form submission
- `GET /utils/delay` - Utility endpoint for testing
- `POST /scout` - URL monitoring (in development)

### Session Endpoints

- `GET /get_session` - Create new session
- `GET /see_cookie` - View session cookie

### User Management

- `POST /signup` - User registration with SMS verification

## Frontend Features

### Sections

1. **Hero Section**: Introduction with call-to-action
2. **Services**: Core service offerings
3. **Solutions**: Detailed solution showcases
4. **About**: Company information
5. **Contact**: Contact form and information

### Key Features

- Mobile-responsive design
- Smooth scroll navigation
- Form validation
- SMS phone number formatting
- Notification system
- SEO optimization

## Development Workflow

### Local Development

1. Start backend: `./deploy.sh start`
2. For frontend development, use: `python3 -m http.server 8080` in `/fe/` directory
3. Access frontend at: `http://localhost:8080`
4. API available at: `http://localhost:8002`

### Production Deployment

1. Update nginx configuration to point to your domain
2. Ensure SSL certificates are configured
3. Set up proper firewall rules
4. Configure Redis for production
5. Set up database backups

## Configuration

### Environment Variables

- `CLICKSEND_TOKEN` - For SMS messaging (optional)
- Database paths are configured in `main.py`

### Nginx Configuration

The nginx config serves:

- Static frontend files from `/fe/`
- API requests proxied to port 8002
- Proper caching headers for static assets

## Services Integration

### SMS Messaging

- ClickSend API integration for SMS alerts
- Phone number validation and formatting
- Redis-based SMS verification codes

### Database

- SQLite3 for customer data
- Redis for session management
- Prepared for scaling to PostgreSQL

## Security Features

- CORS properly configured
- Session management with secure cookies
- Input validation with Pydantic models
- SQL injection protection
- XSS protection

## Monitoring & Logs

- FastAPI logs: `/tmp/fastapi.log`
- Nginx logs: `/var/log/nginx/`
- Use `./deploy.sh logs` to view real-time logs

## Support & Contact

For technical support or questions about PRSM USA solutions:

- Email: hello@prsmusa.com
- Phone: +1 (555) 123-4567
- Business Hours: Mon-Fri 9AM-6PM EST

## License

© 2025 PRSM USA. All rights reserved.
