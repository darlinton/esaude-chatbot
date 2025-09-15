# esaude-chatbot

This is the README for the `esaude-chatbot` project. eSaúdeZap - Atendimento instantâneo, cuidado sempre acessível.

## Backend Architecture

The `esaude-chatbot` follows a client-server architecture, comprising a React-based frontend, a Node.js/Express backend API, and a MongoDB database. The system integrates with specialized chatbot services for natural language processing and response generation.

**Key Components:**

*   **Frontend (React App)**: Provides the user interface for chat interactions, handles user input, displays chatbot responses, and manages authentication. It communicates with the Backend API via RESTful calls.
*   **Backend API (Node.js/Express)**: Offers RESTful endpoints for frontend communication, manages user authentication, handles chat session creation, message storage, and acts as an intermediary between the Frontend and the Chatbot Service.
*   **MongoDB Database**: Stores user data, chat sessions, individual messages, and evaluation feedback, ensuring data persistence.
*   **Chatbot Service**: Processes natural language input and generates responses. This can be an external AI service or an internally developed NLP module.

**Data Flow:**
1.  User sends a message via the Frontend.
2.  Frontend forwards the message to the Backend API.
3.  Backend API sends the message to the Chatbot Service.
4.  Chatbot Service processes the message and returns a response.
5.  Backend API stores the message and response in MongoDB and sends the response back to the Frontend.
6.  Frontend displays the chatbot's response.

**Technology Stack:**
*   **Frontend**: React.js, Redux (or Context API), Axios, Tailwind CSS
*   **Backend**: Node.js, Express.js, Mongoose, JWT, bcrypt
*   **Database**: MongoDB

## User Roles

This application supports two types of users:

*   **Regular Users**: These users can register, log in, and interact with the chatbot to receive healthcare information and support. They have access to their personal chat history and profile.
*   **Admin Users**: These users have elevated privileges. They can manage user accounts, monitor all chat sessions, view chat content and evaluations, and customize bot prompts and API keys. Access to admin functionalities is restricted and requires specific authorization.

## Backend Scripts

The backend includes several utility scripts for managing the application:

*   `backend/scripts/listUsers.js`: Lists all registered users in the system.
*   `backend/scripts/seedBotData.js`: Populates the database with initial bot data, such as default prompts and API keys.
*   `backend/scripts/upgradeUser.js`: Allows an administrator to upgrade a regular user to an admin role by providing the user's identifier (e.g., email).

## Bot Prompts

The system allows for dynamic management of chatbot prompts. Administrators can create, view, edit, delete, and set default prompts for different bot types (e.g., OpenAI, Gemini) through the admin interface. This enables customization of chatbot behavior without code modifications. The `ChatSession` model includes a `promptId` to associate sessions with specific prompts. If no `promptId` is provided, the default prompt for the selected bot type is used.

## Prototype Status

Please note that this project is currently a prototype and is under active development. Features and functionalities may evolve, and some aspects may be subject to change as development progresses.

## Project Overview

## Getting Started

To set up and run the `esaude-chatbot` application locally, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/darlinton/esaude-chatbot.git
    cd esaude-chatbot
    ```

2.  **Install Dependencies**:
    ```bash
    npm run install
    ```
    This will install dependencies for both the frontend and backend.

3.  **Backend Environment Setup**:
    Navigate to the `backend/` directory and create a `.env` file based on `backend/.env.example`. You will need to configure your MongoDB connection string and any other necessary API keys.
    ```bash
    cd backend
    cp .env.example .env
    # Edit .env with your credentials
    cd ..
    ```

4.  **Run the Application**:
    ```bash
    npm run dev
    ```
    This command will start both the backend server and the frontend development server concurrently.

    or, once
    ```bash
    npm run prod
    ```
    next
    ```bash
    npm run start:prod    
    ```

## Documentation and Specifications

For detailed project specifications, architecture overview, and feature documentation, please refer to the `specs/` directory:

*   **System Overview**: [specs/system-overview.md](specs/system-overview.md)
*   **Major Features List**: [specs/major-features-list.md](specs/major-features-list.md)
*   **Detailed Feature Specifications**: [specs/features/](specs/features/)

## Contribution Guidelines

Information on how to contribute to the project, including coding standards and pull request processes, will be detailed in the `CONTRIBUTING.md` file (to be created).

## License

This project is licensed under the MIT License.
