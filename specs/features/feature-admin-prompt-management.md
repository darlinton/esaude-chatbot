# Feature Specification: Admin Prompt Management

*   **Feature Name**: Admin Prompt Management
*   **Feature ID**: ADMIN-002
*   **Status**: Completed

## 1. Description

This feature will enable "User Admin" roles to manage and customize the system prompts used by different chatbot services (e.g., OpenAI, Gemini). It will allow for the creation of multiple prompt variations for each bot type, with the ability to designate a default prompt for each. This provides flexibility in tailoring chatbot behavior without requiring code changes.

## 2. User Stories / Use Cases

*   **As a system administrator**, I want to create new system prompts for a specific chatbot type (e.g., OpenAI) so that I can experiment with different chatbot behaviors.
*   **As a system administrator**, I want to view a list of all available system prompts, including their associated bot type and whether they are the default, so that I can easily manage them.
*   **As a system administrator**, I want to edit an existing system prompt so that I can refine its instructions or content.
*   **As a system administrator**, I want to delete a system prompt that is no longer needed.
*   **As a system administrator**, I want to set a specific prompt as the default for a given bot type so that new chat sessions automatically use the desired prompt.
*   **As a user**, when starting a new chat session, I want the system to use the default prompt for the selected bot type if no specific prompt is chosen.
*   **As a user**, when starting a new chat session, I want the system to use a specific prompt if I (or the system on my behalf) provide a `promptId`.

*   **As a system administrator**, I want to securely store API keys for different chatbot services (e.g., OpenAI, Gemini) so that the bots can authenticate with their respective services.
*   **As a system administrator**, I want to view and update the API keys for different chatbot services through an admin interface.

## 3. Functional Requirements

*   **FR-ADMIN-PROMPT-001**: The system SHALL support a new `BotPrompt` model to store system prompts.
*   **FR-ADMIN-PROMPT-002**: The `BotPrompt` model SHALL include fields for `promptName` (String, unique per botType), `botType` (String, e.g., 'openai', 'gemini'), `promptContent` (String), `isDefault` (Boolean, default false), `createdAt` (Date), and `updatedAt` (Date).
*   **FR-ADMIN-PROMPT-003**: For each `botType`, only one `BotPrompt` SHALL be marked as `isDefault: true`.
*   **FR-ADMIN-PROMPT-004**: The system SHALL provide API endpoints for "User Admins" to perform CRUD operations on `BotPrompt` entries.
*   **FR-ADMIN-PROMPT-005**: The system SHALL provide an API endpoint for "User Admins" to set a specific `BotPrompt` as the default for its `botType`.
*   **FR-ADMIN-PROMPT-006**: The `ChatSession` model SHALL be updated to include a `promptId` field (reference to `BotPrompt`).
*   **FR-ADMIN-PROMPT-007**: The `POST /api/chat/sessions` endpoint SHALL accept an optional `promptId` in the request body.
*   **FR-ADMIN-PROMPT-008**: If `promptId` is provided when creating a chat session, the system SHALL use that specific prompt.
*   **FR-ADMIN-PROMPT-009**: If `promptId` is not provided when creating a chat session, the system SHALL use the `BotPrompt` marked as `isDefault: true` for the selected `botType`.
*   **FR-ADMIN-PROMPT-010**: The chatbot service logic (`OpenAIBot.js`, `GeminiBot.js`) SHALL dynamically load the prompt content based on the `promptId` associated with the current chat session.
*   **FR-ADMIN-PROMPT-011**: Access to prompt management functionalities SHALL be restricted to "User Admins" only.
*   **FR-ADMIN-PROMPT-012**: The system SHALL support a new `BotApiKey` model to securely store API keys for different bot types.
*   **FR-ADMIN-PROMPT-013**: The `BotApiKey` model SHALL include fields for `botType` (String, unique, e.g., 'openai', 'gemini'), `apiKey` (String, encrypted), `createdAt` (Date), and `updatedAt` (Date).
*   **FR-ADMIN-PROMPT-014**: The system SHALL provide API endpoints for "User Admins" to retrieve and update `BotApiKey` entries.
*   **FR-ADMIN-PROMPT-015**: The chatbot service logic (`OpenAIBot.js`, `GeminiBot.js`) SHALL retrieve the necessary API key from the database (or cache) when initializing the bot.
*   **FR-ADMIN-PROMPT-016**: The admin console interface for prompt and API key management SHALL only be accessible and visible to "User Admins".

## 4. Non-functional Requirements

*   **NFR-ADMIN-PROMPT-001 (Security)**: All prompt management API endpoints SHALL be protected by appropriate authentication and authorization middleware for "User Admins".
*   **NFR-ADMIN-PROMPT-003 (Performance)**: Retrieving prompts for chat sessions SHALL be efficient, potentially utilizing caching mechanisms to minimize database load.
*   **NFR-ADMIN-PROMPT-004 (Usability)**: The admin interface for prompt management SHALL be intuitive and user-friendly.
*   **NFR-ADMIN-PROMPT-005 (Data Integrity)**: Ensure that prompt content is correctly stored and retrieved, and that default prompt logic is consistently applied.

## 5. Technical Design

*   **Backend Endpoints**:
    *   `POST /api/admin/prompts`: Create a new `BotPrompt`. (Admin only)
    *   `GET /api/admin/prompts`: Retrieve a list of all `BotPrompt`s. (Admin only)
    *   `GET /api/admin/prompts/:id`: Retrieve a specific `BotPrompt` by ID. (Admin only)
    *   `PUT /api/admin/prompts/:id`: Update a specific `BotPrompt` by ID. (Admin only)
    *   `DELETE /api/admin/prompts/:id`: Delete a specific `BotPrompt` by ID. (Admin only)
    *   `PUT /api/admin/prompts/:id/set-default`: Set a `BotPrompt` as default for its `botType`. (Admin only)
    *   `GET /api/admin/api-keys`: Retrieve all `BotApiKey` entries. (Admin only)
    *   `PUT /api/admin/api-keys/:botType`: Update the `apiKey` for a specific `botType`. (Admin only)
    *   `POST /api/chat/sessions`: Modified to accept `promptId`.
*   **Database Schema**:
    *   New `BotPrompt` model:
        ```javascript
        const mongoose = require('mongoose');

        const BotPromptSchema = new mongoose.Schema({
          promptName: { type: String, required: true },
          botType: { type: String, required: true, enum: ['openai', 'gemini'] }, // Extend as needed
          promptContent: { type: String, required: true },
          isDefault: { type: Boolean, default: false },
        }, { timestamps: true });

        BotPromptSchema.index({ botType: 1, promptName: 1 }, { unique: true }); // Ensure unique prompt names per bot type
        BotPromptSchema.index({ botType: 1, isDefault: 1 }, { unique: true, partialFilterExpression: { isDefault: true } }); // Only one default per botType

        module.exports = mongoose.model('BotPrompt', BotPromptSchema);
        ```
    *   New `BotApiKey` model:
        ```javascript
        const mongoose = require('mongoose');
        const bcrypt = require('bcrypt'); // For encryption

        const BotApiKeySchema = new mongoose.Schema({
          botType: { type: String, required: true, unique: true, enum: ['openai', 'gemini'] },
          apiKey: { type: String, required: true },
        }, { timestamps: true });

        module.exports = mongoose.model('BotApiKey', BotApiKeySchema);
        ```
    *   `ChatSession` model: Add `promptId: { type: mongoose.Schema.Types.ObjectId, ref: 'BotPrompt' }`.
*   **Authentication/Authorization Middleware**:
    *   Existing `adminAuthMiddleware.js` (or similar) will be used to protect the new admin prompt and API key endpoints.
*   **Bot Service Logic**:
    *   `BotManager.js` will be updated to fetch the appropriate prompt from the database (or cache) based on the `promptId` in the `ChatSession`.
    *   `OpenAIBot.js` and `GeminiBot.js` will receive the prompt content dynamically and retrieve their respective API keys from the `BotApiKey` model.
*   **Caching**: Implement a simple in-memory cache or use a dedicated caching solution (e.g., Redis) for `BotPrompt`s and `BotApiKey`s to reduce database queries.

## 6. UI/UX Considerations

*   **Admin Dashboard Integration**: A new navigation item "Prompt Management" and "API Key Management" under the Admin Dashboard, visible only to "User Admins".
*   **Prompt List View**: A table displaying `promptName`, `botType`, and `isDefault` status, with actions for View/Edit, Delete, and Set as Default.
*   **Prompt Detail/Edit View**: A form with a large text area for `promptContent`, input fields for `promptName`, and a dropdown for `botType`.
*   **API Key Management View**: A list or form displaying `botType` and an input field for the `apiKey` (masked), with an update button.
*   **Confirmation Dialogs**: For delete and set default actions.

## 7. Dependencies

*   Backend API (Node.js/Express)
*   MongoDB Database
*   User Authentication and Admin Session Management features.
*   Existing `User`, `ChatSession` models.
*   `OpenAIBot.js`, `GeminiBot.js`, `BotManager.js`.

## 8. Acceptance Criteria

*   A new `BotPrompt` can be created, updated, retrieved, and deleted by "User Admins".
*   Only one prompt can be set as default for a given `botType` at any time.
