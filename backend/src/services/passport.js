const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            // Ensure the profile object contains emails
            if (!profile.emails || profile.emails.length === 0) {
                return done(new Error("No email found in Google profile."), null);
            }

            const userEmail = profile.emails[0].value;

            // Find an existing user by email instead of googleId
            const existingUser = await User.findOne({ email: userEmail });

            if (existingUser) {
                // If a user with this email already exists, return that user
                console.info("Google login:", existingUser);
                return done(null, existingUser);
            }

            try {
                console.info("Google new login:", userEmail);
                const newUser = await new User({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    photo: profile.photos[0].value
                }).save();
            } catch (error) {
                // Catch any errors that occur during the database operations (findOne or save)
                console.error("Error during Google OAuth user processing:", error);
                // Pass the error to Passport's `done` callback. 
                // This typically results in an authentication failure.
                done(error, null); 
            }
            done(null, newUser);
        }
    )
);
