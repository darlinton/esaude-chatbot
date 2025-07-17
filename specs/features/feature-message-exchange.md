# Feature Specification: Message Exchange

*   **Feature Name**: Message Exchange
*   **Feature ID**: MSG-001
*   **Status**: Completed

## 1. Description

This feature encompasses the core functionality of the `esaude-chatbot`: allowing users to send text messages to the chatbot and receive relevant responses. It covers the entire lifecycle of a message, from user input to chatbot processing and response display.

## 2. User Stories / Use Cases

*   **As a user**, I want to send a text message to the chatbot so I can ask my health-related questions.
*   **As a user**, I want to receive a timely and relevant response from the chatbot to my queries.
*   **As a user**, I want to see both my messages and the chatbot's responses displayed clearly in the chat window.
*   **As a user**, I want my messages and the chatbot's responses to be saved as part of my chat session history.

## 3. Functional Requirements

*   **FR-MSG-001**: The system SHALL allow authenticated users to send text messages within an active chat session.
*   **FR-MSG-002**: The system SHALL forward user messages to the designated Chatbot Service for processing.
*   **FR-MSG-003**: The system SHALL receive responses from the Chatbot Service.
*   **FR-MSG-004**: The system SHALL store both user messages and chatbot responses in the database, associated with the correct chat session and user.
*   **FR-MSG-005**: The system SHALL display user messages and chatbot responses chronologically in the chat interface.
*   **FR-MSG-006**: The system SHALL handle and display error messages if the Chatbot Service is unavailable or returns an error.
*   **FR-MSG-007**: The system SHALL indicate when the chatbot is "typing" or processing a response.

## 4. Non-functional Requirements

*   **NFR-MSG-001 (Performance)**: Chatbot responses SHALL be displayed within 2-3 seconds of the user sending a message.
*   **NFR-MSG-002 (Reliability)**: Message delivery and response retrieval SHALL be robust, with appropriate retry mechanisms for transient failures.
*   **NFR-MSG-003 (Scalability)**: The message exchange system should support a high volume of concurrent messages without degradation in performance.
*   **NFR-MSG-004 (Accuracy)**: Chatbot responses should be accurate and relevant to the user's query (dependent on Chatbot Service).

## 5. Technical Design

*   **Backend Endpoints**:
    *   `POST /api/chat/sessions/:sessionId/messages`: Send a new message to a specific session.
*   **Database Schema**:
    *   `Message` model: `sessionId (ref to ChatSession)`, `sender (String: 'user' or 'chatbot')`, `content (String)`, `timestamp (Date)`.
*   **Chatbot Service Integration**:
    *   Backend will make HTTP requests (e.g., POST) to the Chatbot Service API, sending user input and potentially session context.
    *   Backend will parse the Chatbot Service's response and extract the chatbot's message.
*   **Real-time Considerations**: While not strictly real-time (using HTTP requests), the frontend can poll or use WebSockets (future enhancement) for immediate response display.
*   **Error Handling**: Implement try-catch blocks for API calls to the Chatbot Service and return appropriate HTTP status codes to the frontend.

## 6. UI/UX Considerations

*   **Message Input Field**: A text area for users to type messages.
*   **Send Button**: A clear button or `Enter` key functionality to send messages.
*   **Chat Bubble/Layout**: Distinct visual styles for user messages and chatbot responses.
*   **Typing Indicator**: A visual cue (e.g., "Chatbot is typing...") when a response is being generated.
*   **Scroll to Bottom**: Automatically scroll the chat window to the latest message.

## 7. Dependencies

*   Backend API (Node.js/Express)
*   MongoDB Database
*   Chat Session Management feature (CHAT-001)
*   Chatbot Service (external or internal NLP engine)

## 8. Acceptance Criteria

*   A user can type a message and send it to the chatbot.
*   The chatbot's response is displayed in the chat window.
*   Both user and chatbot messages are saved to the database.
*   Messages are displayed in chronological order within the chat session.
*   Error messages are shown if the chatbot service fails to respond.
