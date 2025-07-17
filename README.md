# esaude-chatbot

This is the README for the `esaude-chatbot` project. eSaúdeZap - Atendimento instantâneo, cuidado sempre acessível.

## Project Overview

The `esaude-chatbot` is an intelligent, interactive conversational agent designed to provide reliable healthcare-related information and support.

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
