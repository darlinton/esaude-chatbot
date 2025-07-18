const passport = require('passport');
const authController = require('../controllers/authController');

module.exports = (app) => {
  app.post('/api/auth/signup', authController.signup);
  app.post('/api/auth/login', authController.login);
  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/api/auth/google/callback', passport.authenticate('google'), googleAuthCallback);

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
