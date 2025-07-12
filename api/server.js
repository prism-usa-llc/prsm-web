const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const { body, validationResult } = require('express-validator')
const nodemailer = require('nodemailer')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many contact requests, please try again later.'
  }
})

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

// Validation rules for contact form
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name must be less than 100 characters'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('service')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Service selection invalid'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
]

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Contact form endpoint
app.post('/api/contact', contactLimiter, contactValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const { name, email, company, phone, service, message } = req.body

    // Email content
    const emailContent = `
      New Contact Form Submission - PRISM USA LLC
      
      Name: ${name}
      Email: ${email}
      Company: ${company || 'Not provided'}
      Phone: ${phone || 'Not provided'}
      Service Interest: ${service || 'Not specified'}
      
      Message:
      ${message}
      
      Submitted at: ${new Date().toLocaleString()}
      IP Address: ${req.ip}
    `

    // Send email to business
    const businessEmailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `New Quote Request from ${name}`,
      text: emailContent
    }

    // Send confirmation email to customer
    const customerEmailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Thank you for contacting ${process.env.REACT_APP_WEBSITE_NAME}`,
      text: `
        Hi ${name},
        
        Thank you for your interest in ${process.env.REACT_APP_WEBSITE_NAME}'s software services!
        
        We have received your quote request and will get back to you within 24 hours with a detailed response about your ${service || 'project'} inquiry.
        
        Our team of experts will review your requirements and provide you with:
        • A custom solution proposal
        • Transparent pricing information
        • Implementation timeline
        • Next steps to get started
        
        If you have any immediate questions, feel free to call us at ${process.env.REACT_APP_PHONE_NUMBER}.
        
        Best regards,
        The ${process.env.REACT_APP_WEBSITE_NAME} Team
        
        ---
        This is an automated response. Please do not reply to this email.
      `
    }

    // Send emails
    await Promise.all([
      transporter.sendMail(businessEmailOptions),
      transporter.sendMail(customerEmailOptions)
    ])

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully'
    })

  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({
      error: 'Failed to send message. Please try again or contact us directly.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({
    error: 'Internal server error'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`PRISM API server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})