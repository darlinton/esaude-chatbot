require('dotenv').config({ path: '.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session'); // Import express-session
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('./src/models/User'); // Ensure User model is loaded before passport
require('./src/services/passport'); // Passport configuration

// Logger configuration
const logger = require('./src/config/logger');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Security Headers
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for OAuth routes if needed, or configure more granularly
}));
// Exclude auth routes from helmet protection if they cause issues
app.use('/api/auth', (req, res, next) => {
    // You might need to adjust this logic based on how helmet is configured
    // For now, we assume helmet is applied globally and we want to bypass it for /api/auth
    // A more robust solution might involve helmet's own exclusion options if available
    // For simplicity, we'll just let it pass through without helmet's protection
    next();
});

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : [];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.some(allowedOrigin => {
            if (allowedOrigin.includes('*')) {
                const regex = new RegExp(allowedOrigin.replace(/\*/g, '.*'));
                return regex.test(origin);
            }
            return origin === allowedOrigin;
        })) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json()); // Body parser
app.use(cookieParser());

app.use(
    session({
        secret: process.env.COOKIE_KEY, // Use COOKIE_KEY as the secret
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => logger.info('MongoDB connected')) // Use logger
    .catch(err => next(err)); // Pass error to the error-handling middleware

// Error Handling Middleware
app.use((err, req, res, next) => {
    logger.error(err.stack); // Use logger for error stack trace
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        // Optionally, include stack trace in development environments
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});

// Routes
require('./src/routes/authRoutes')(app); // Pass the app object to authRoutes

app.use('/api/chats', require('./src/routes/chatRoutes'));
app.use('/api/messages', require('./src/routes/messageRoutes'));
app.use('/api/evaluations', require('./src/routes/evaluationRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes')); // Admin routes

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`); // Use logger
});
