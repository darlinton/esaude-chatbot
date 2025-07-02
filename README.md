cline (gemini) prompt: 

You are my coding assistant. I am building a full-stack web app that allows users to interact with a customized chatbot, integrated with OpenAI and Gemini models (vertical AI app). Here's what I need:

## Project Overview
Plan the creation of a full-stack web application with:

- **Frontend**: React (with Hooks and functional components)
- **Backend**: Node.js with Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT
- **Chatbot**: Placeholder logic or API call to Gemini
- **Chat Features**:
  - Users can create multiple chat sessions
  - Every message (user or bot) is saved with timestamp, sender, and chat session ID
  - Users can view chat history per session
- **Evaluation Feature**:
  - After each session, allow users to rate the chatbot (1–5 stars or Likert scale)
  - Store evaluations in DB linked to user and session

## Frontend Requirements (React)
- Auth pages: Sign up / Log in / Log out
- Chat UI: Send/receive messages in real time or per message
- Dashboard:
  - List of chat sessions
  - Start new chat
  - View chat history
- Evaluation form at end of chat session
- Optional: Use Tailwind CSS or Material UI

## Backend Requirements (Node.js + Express)
- RESTful API
- Auth: Signup, login, JWT token-based session
- Models: User, ChatSession, Message, Evaluation
- Routes:
  - `/api/auth/signup`, `/api/auth/login`
  - `/api/chats/` (create, list)
  - `/api/messages/` (send, list by session)
  - `/api/evaluations/` (submit, get by user/session)
- Use environment variables for keys, DB URI, etc.
- Sanitize input and hash passwords with bcrypt

## Development Notes
- Use modular file structure (routes, controllers, models, services)
- Include `.env.example` file and basic README
- Make sure the app runs locally with `npm run dev` for both frontend and backend


Please start by planing the scaffolding the backend project, then the frontend. Provide the full plan for the code in full files when possible creation in the futher step with the act model.

Please give me a detailed development plan that includes:
- All necessary components (frontend and backend)
- File and folder structure
- Database schema (described, not coded yet)
- Routes and endpoints needed
- Sequence of development tasks


## How to install and run
 > npm run install
- Obs: don't forget to setup the backend/.env  (mongodb credentials)
> npm run prod


