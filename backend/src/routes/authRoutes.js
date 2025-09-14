const passport = require('passport');
const authController = require('../controllers/authController');
const { body, validationResult } = require('express-validator'); // Import validation functions

module.exports = (app) => {
  // Signup route with validation
  app.post('/api/auth/signup',
    [
      body('email').isEmail().withMessage('Must be a valid email address'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
      body('displayName').notEmpty().withMessage('Display name is required'),
    ],
    authController.signup
  );

  // Login route with validation
  app.post('/api/auth/login',
    [
      body('email').isEmail().withMessage('Must be a valid email address'),
      body('password').notEmpty().withMessage('Password is required'),
    ],
    authController.login
  );

  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/api/auth/google/callback', passport.authenticate('google'), authController.googleAuthCallback);
  app.get('/api/auth/session', authController.getSession);

  app.get('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect('/');
    });
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
