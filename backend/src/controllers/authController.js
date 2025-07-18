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
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
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

        // Redirect to the frontend with the token and user info in the query string
        const user = req.user;
        res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${token}&id=${user._id}&displayName=${user.displayName}&email=${user.email}`);
    } catch (error) {
        console.error('Google authentication callback error:', error);
        res.status(500).json({ message: 'Error handling Google authentication callback' });
    }
};

module.exports = {
    signup: signupUser,
    login: loginUser,
    googleAuthCallback
};
