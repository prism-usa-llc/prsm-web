const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const { body, validationResult } = require('express-validator')
const redis = require('redis')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// Trust the first proxy
app.set('trust proxy', 1)

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

// Redis connection
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();


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
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name must be less than 100 characters'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('service')
    .optional({ checkFalsy: true })
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

    const submission = {
      ...req.body,
      submittedAt: new Date().toISOString(),
      ipAddress: req.ip
    };

    await redisClient.lPush('contact_submissions', JSON.stringify(submission));
    
    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully'
    })

  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({
      error: 'Failed to save message. Please try again or contact us directly.',
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