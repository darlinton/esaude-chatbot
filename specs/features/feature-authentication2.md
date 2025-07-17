# Feature: User Authentication via OAuth2

This feature expand the previous one about authentication.

## 1. User Stories
- As a new user, I want to sign up/log in using my Google account so I don't have to create a new password.
- As a new user, I want to sign up/log in using my Facebook account so I don't have to create a new password.
- As a new user, I want to sign up/log in using my GitHub account.
- As a logged-in user, my session should be remembered so I don't have to log in every time I visit.
- As a logged-in user, I want a "Logout" button to end my session.

## 2. Technical Requirements
- **Providers:** Google, GitHub, Facebook.
- **Technology:** Use Passport.js with `passport-google-oauth20` and `passport-github2`.
- **User Model:** The `User` model in the database must be updated to store `provider` (e.g., 'google'), `providerId`, `displayName`, `email`, and `photo`. The email should be the unique identifier.
- **Backend API Routes:**
  - `GET /auth/google` - Initiates the Google login flow.
  - `GET /auth/google/callback` - Handles the callback from Google.
  - `GET /auth/facebook` - Initiates the Facebook login flow.
  - `GET /auth/facebook/callback` - Handles the callback from GitHub.
  - `GET /auth/github` - Initiates the GitHub login flow.
  - `GET /auth/github/callback` - Handles the callback from GitHub.
  - `GET /api/current_user` - Returns the currently logged-in user's data.
  - `GET /api/logout` - Logs the user out.
- **Frontend Flow:**
  - The login page will have buttons to login with "google", "github" and "facebook".
  - Clicking a button redirects to the corresponding backend route.
  - After successful login, the user is redirected to the main chat dashboard.
  - The UI should change to show the user's name/photo and a logout button.
  **Security:**
  - Client IDs and secrets must be stored in environment variables (`.env` file), not in the code.
  - The system must require login to access. 
  - Unauthorized access due to not have login should redirect to login page.

