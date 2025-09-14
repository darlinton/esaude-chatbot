const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator'); // Import validationResult

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signupUser = async (req, res, next) => { // Added next parameter
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { displayName, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    try {
        const user = await User.create({
            displayName,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                displayName: user.displayName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            // This case should ideally not be reached if User.create is successful
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        logger.error('Signup error:', error); // Use logger
        // Pass the error to the centralized error handler
        next(error);
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check for user email
    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                displayName: user.displayName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        logger.error('Login error:', error); // Log the error
        next(error); // Pass to centralized handler
    }
};

// @desc    Google authentication callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleAuthCallback = async (req, res, next) => { // Added next parameter
    try {
        // Get the user profile from the Google authentication response
        logger.info('Google authentication callback called:', req.user); // Use logger

        // Create a JWT token for the user
        const token = generateToken(req.user._id);

        // Set the token in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.redirect('/auth/google/success');
    } catch (error) {
        logger.error('Google authentication callback error:', error); // Use logger
        // Pass the error to the centralized error handler
        next(error);
    }
};

const getSession = async (req, res) => {
    if (req.user) {
        res.json({
            _id: req.user.id,
            displayName: req.user.displayName,
            email: req.user.email,
            token: req.cookies.token,
        });
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
};

module.exports = {
    signup: signupUser,
    login: loginUser,
    googleAuthCallback,
    getSession,
};
