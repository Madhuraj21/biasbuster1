const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Import Generative AI SDK
const axios = require('axios'); // Import axios for fetching URLs
const cheerio = require('cheerio'); // Import cheerio for HTML parsing
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Load environment variables (optional, but good practice)
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001; // Use environment variable or default

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Parse JSON request bodies
app.use(helmet()); // Security middleware

// Rate limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// JWT Auth middleware
const { authenticateToken } = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');

// Placeholder for Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/biasBusterDB'; // Replace with your MongoDB connection string

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Placeholder API Routes
app.get('/api', (req, res) => {
  res.send('Bias Buster Backend API is running!');
});

// Placeholder for Analysis Route
// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"}); // Using a suitable model

const { analyzeArticle } = require('./controllers/analyzeController');

// Placeholder for Analysis Route
app.post('/api/analyze',
  [
    body('content').isString().notEmpty().withMessage('Content is required'),
    body('isUrl').isBoolean().withMessage('isUrl must be a boolean'),
  ],
  analyzeArticle
);

// /api/me endpoint (get current user info)
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const User = require('./models/User');
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Placeholder for User Routes (Auth)
app.use('/api/auth', require('./routes/auth')); // Example structure

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
