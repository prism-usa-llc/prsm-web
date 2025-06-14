# PRSM USA Frontend

A modern, responsive website for PRSM USA showcasing custom software solutions with emphasis on SMS messaging, queue management systems, and IT consulting services.

## Features

- **Modern Design**: Clean, professional design with smooth animations and responsive layout
- **Mobile-First**: Fully responsive design that works on all devices
- **Fast Loading**: Optimized CSS and JavaScript with minimal dependencies
- **Contact Form**: Integrated contact form that connects to the FastAPI backend
- **SEO Optimized**: Proper meta tags and semantic HTML structure

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern CSS with flexbox and grid layouts
- **Vanilla JavaScript**: No framework dependencies for fast loading
- **Font Awesome**: Icons
- **Google Fonts**: Typography (loaded from CDN)

## Sections

1. **Hero Section**: Eye-catching introduction with call-to-action buttons
2. **Services**: Overview of core services (SMS alerts, queue management, IT consulting, custom development)
3. **Solutions**: Detailed showcase of key solutions like customer queue system and network infrastructure
4. **About**: Company information and statistics
5. **Contact**: Contact form and business information
6. **Footer**: Links and additional information

## Setup & Deployment

### Development
The frontend is a static website that can be served by any web server. For development, you can use:

```bash
# Simple Python server
python -m http.server 8000

# Or Node.js serve
npx serve .
```

### Production with Nginx
The nginx configuration is already set up to serve the frontend from `/home/rmintz/github/prsm-web/fe/`.

Make sure nginx has read permissions:
```bash
sudo chown -R www-data:www-data /home/rmintz/github/prsm-web/fe/
sudo chmod -R 755 /home/rmintz/github/prsm-web/fe/
```

### Backend Integration
The contact form submits to `/api/v0.1/contact` which is handled by the FastAPI backend. The form includes:
- Name (required)
- Email (required, validated)
- Phone (optional, auto-formatted)
- Service selection (required)
- Message (required)

## Customization

### Colors
The main brand colors are defined in CSS custom properties:
- Primary: `#2563eb` (blue)
- Secondary: `#764ba2` (purple)
- Background: `#f8fafc` (light gray)

### Content
All content can be easily modified in the HTML file. Key areas to customize:
- Company contact information
- Service descriptions
- Solution features
- About section statistics

### Styling
The CSS is organized into logical sections:
- Reset and base styles
- Navigation
- Hero section
- Individual section styles
- Responsive design (mobile-first)

## Performance

- Minimal external dependencies (only Font Awesome from CDN)
- Optimized images and icons
- Efficient CSS with minimal unused styles
- Vanilla JavaScript for maximum performance
- Proper caching headers configured in nginx

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contact Form API

The frontend expects the backend contact endpoint to return:
```json
{
  "status": "success",
  "message": "Thank you for your message! We'll get back to you soon."
}
```

For errors:
```json
{
  "detail": "Error message here"
}
```
