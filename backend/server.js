require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session'); // Import express-session
const passport = require('passport');
require('./src/models/User'); // Ensure User model is loaded before passport
require('./src/services/passport'); // Passport configuration

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
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
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
require('./src/routes/authRoutes')(app); // Pass the app object to authRoutes

app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.use('/api/chats', require('./src/routes/chatRoutes'));
app.use('/api/messages', require('./src/routes/messageRoutes'));
app.use('/api/evaluations', require('./src/routes/evaluationRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
