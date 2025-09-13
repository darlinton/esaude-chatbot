const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signupUser = async (req, res) => {
    const { displayName, email, password } = req.body;

    if (!displayName || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

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
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
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
};

// @desc    Google authentication callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleAuthCallback = async (req, res) => {
    try {
        // Get the user profile from the Google authentication response
        console.log('Google authentication callback called:', req.user);

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
        console.error('Google authentication callback error:', error);
        res.status(500).json({ message: 'Error handling Google authentication callback' });
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
