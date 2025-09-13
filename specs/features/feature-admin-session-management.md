# Feature Specification: Admin Session Management

*   **Feature Name**: Admin Session Management
*   **Feature ID**: ADMIN-001
*   **Status**: Completed

## 1. Description

This feature introduces an "Admin" user role with elevated privileges, allowing system administrators to monitor and manage user sessions. Specifically, it enables admins to list all active and historical user sessions, view the detailed chat content within each session, and review any associated evaluations. This provides a comprehensive overview of user activity and system performance.

## 2. User Stories / Use Cases

*   **As a system administrator**, I want to be able to upgrade a regular user to an admin role via a terminal command so that I can delegate administrative responsibilities.
*   **As a system administrator**, I want to access a dedicated admin interface via a specific URL so that I can manage user sessions without affecting the regular user interface.
*   **As a system administrator**, I want to view a list of all user sessions so that I can monitor overall system activity.
*   **As a system administrator**, I want to view the chat content of any user session so that I can understand user interactions and troubleshoot issues.
*   **As a system administrator**, I want to view the evaluations associated with any user session so that I can assess the quality of interactions and identify areas for improvement.

## 3. Functional Requirements

*   **FR-ADMIN-001**: The system SHALL support a new user category called "User Admin".
*   **FR-ADMIN-002**: The system SHALL allow a regular user to be upgraded to a "User Admin" via a terminal command, passing the user's identifier (e.g., username or email).
*   **FR-ADMIN-003**: The system SHALL provide a dedicated URL (e.g., `/admin/sessions`) for accessing the admin session management feature, which is separate from the regular user interface.
*   **FR-ADMIN-004**: The admin interface SHALL display a list of all user sessions, including relevant metadata (e.g., user ID, session ID, start time, last activity).
*   **FR-ADMIN-005**: The admin interface SHALL allow "User Admins" to select a specific session and view its complete chat message history.
*   **FR-ADMIN-006**: The admin interface SHALL allow "User Admins" to view any evaluations submitted for a specific session.
*   **FR-ADMIN-007**: Access to the admin session management feature SHALL be restricted to "User Admins" only.

## 4. Non-functional Requirements

*   **NFR-ADMIN-001 (Security)**: Access to admin functionalities SHALL be strictly controlled and require proper authentication and authorization for "User Admins".
*   **NFR-ADMIN-002 (Security)**: Sensitive user data viewed by admins SHALL be handled in compliance with privacy regulations.
*   **NFR-ADMIN-003 (Usability)**: The admin UI for session management SHALL be intuitive and user-friendly.
*   **NFR-ADMIN-004 (Performance)**: Listing and viewing sessions, chat content, and evaluations SHALL be responsive, even with a large number of sessions.

## 5. Technical Design

*   **Backend Endpoints**:
    *   `POST /api/admin/upgrade-user`: Endpoint to upgrade a user to admin status (accessible via terminal command/internal tool).
    *   `GET /api/admin/sessions`: Retrieve a list of all user sessions.
    *   `GET /api/admin/sessions/:sessionId/messages`: Retrieve chat messages for a specific session.
    *   `GET /api/admin/sessions/:sessionId/evaluations`: Retrieve evaluations for a specific session.
*   **Database Schema**:
    *   `User` model: Add a new field `role` (e.g., `String`, default 'user', 'admin').
*   **Authentication/Authorization Middleware**:
    *   Extend `authMiddleware.js` or create a new `adminAuthMiddleware.js` to verify if the authenticated user has the 'admin' role for accessing admin routes.
*   **Terminal Command**: A dedicated Node.js CLI script (`backend/scripts/upgradeUser.js`) is implemented to directly update a user's role in the database, bypassing API authentication for initial setup.
*   **Authentication Flow**: The `loginUser` and `signupUser` functions in `backend/src/controllers/authController.js` are updated to include the user's `role` in the JWT and the response body, ensuring the frontend `AuthContext` receives the most current role information upon authentication.

## 6. UI/UX Considerations

*   **Admin Dashboard**: A simple, clean interface accessible at `/admin/sessions`.
*   **Session List**: A table or list view displaying sessions with sortable columns (e.g., by user, date, status).
*   **Session Detail View**: A dedicated page for each session, showing chat messages in a readable format and evaluations clearly presented.
*   **Navigation**: No changes to the regular user interface; admin access is purely URL-driven.

## 7. Dependencies

*   Backend API (Node.js/Express)
*   MongoDB Database
*   Existing `User`, `ChatSession`, `Message`, and `Evaluation` models.
*   `jsonwebtoken` library for authentication.

## 8. Acceptance Criteria

*   A regular user can be successfully upgraded to an "Admin" role via the specified terminal command.
*   "User Admins" can access the `/admin/sessions` URL and view the list of all user sessions.
*   "User Admins" can select a session and view its complete chat history.
*   "User Admins" can select a session and view its associated evaluations.
*   Non-admin users are denied access to admin URLs.
*   The admin interface is user-friendly and does not require changes to the regular user UI.

## 9. Implementation Details

This feature was implemented by:
1.  **Backend Modifications**:
    *   Added a `role` field (enum: 'user', 'admin') to the `User` model (`backend/src/models/User.js`).
    *   Created `backend/src/controllers/adminController.js` to handle admin-specific logic for session management and user role upgrades.
    *   Created `backend/src/routes/adminRoutes.js` to define protected API endpoints for admin functionalities (`/api/admin/upgrade-user`, `/api/admin/sessions`, `/api/admin/sessions/:sessionId/messages`, `/api/admin/sessions/:sessionId/evaluations`).
    *   Integrated `adminRoutes` into `backend/server.js`.
    *   Extended `backend/src/middleware/authMiddleware.js` with an `authorize` middleware to restrict access to routes based on user roles.
    *   Updated `backend/src/controllers/authController.js` to include the user's `role` in the response of `signupUser` and `loginUser` functions, ensuring the frontend receives up-to-date role information.
2.  **Frontend Development**:
    *   Created `frontend/src/pages/AdminDashboardPage.js` to display a list of all user sessions.
    *   Created `frontend/src/pages/AdminSessionDetailPage.js` to show detailed chat messages and evaluations for a selected session.
    *   Added new routes for `/admin/sessions` and `/admin/sessions/:sessionId` in `frontend/src/App.js`, protected by an `AdminRoute` component that checks the user's role.
    *   Confirmed that `frontend/src/api/index.js` correctly handles authenticated requests with JWTs.
3.  **Admin User Setup Script**:
    *   Created a Node.js CLI script (`backend/scripts/upgradeUser.js`) to allow system administrators to upgrade a regular user to an admin role directly via the terminal, facilitating initial setup and bypassing API authentication for this specific administrative task.
