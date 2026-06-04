# D&D Companion

A web-based Dungeons & Dragons companion application with AI-powered DM, rules lawyer, campaign system, and character management using local LLM.

## Prerequisites

- Node.js (v18 or higher) installed
- Ollama running locally at http://127.0.0.1:11434
- PostgreSQL (optional, for database persistence)
- Docker (optional, for containerized deployment)

## Startup Process

### Option 1: Local Development

#### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

The backend will run on http://localhost:3000

#### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

The frontend will run on http://localhost:5173 (or another port if 5173 is in use)

### Option 2: Docker Deployment

1. **Ensure Docker is installed and running**

2. **Start all services with docker-compose:**
   ```bash
   cd E:/Repo/Devin/Projects/dnd
   docker-compose up --build
   ```

This will start:
- Ollama (with llama3 model pre-pulled)
- Backend API server
- Frontend (served by nginx)
- PostgreSQL database

The application will be available at http://localhost

### Ollama Setup

Make sure Ollama is running and accessible at http://127.0.0.1:11434

To check Ollama status:
```bash
curl http://127.0.0.1:11434/api/tags
```

To pull a model (if not already installed):
```bash
ollama pull llama3
```

## Current Features

- **DM Chat Interface**: Chat with an AI Dungeon Master with personality
- **Integrated Rules Lawyer**: Ask D&D 5e rules questions directly in DM chat
- **Campaign System**: Create and manage D&D campaigns with objectives
- **Campaign Completion Tracking**: Track boss defeats and campaign completion
- **Character Sheet**: Create characters with D&D 5e ability score restrictions
- **Voice Controls**: Speech recognition and synthesis with English-only fantasy voices
- **Google OAuth**: Sign in with Google authentication
- **Fantasy UI**: Dark theme with purple accents, glass-morphism effects, and emoji icons
- **Docker Support**: Containerized deployment with Ollama, PostgreSQL, and all services

## Project Structure

```
dnd/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/  # Authentication (Login, Google OAuth)
│   │   │   └── ui/    # UI components (DMChat, CharacterSheet, RulesLawyer, VoiceControls)
│   │   └── App.tsx
│   ├── Dockerfile
│   └── nginx.conf
├── backend/           # Express + TypeScript backend
│   ├── src/
│   │   ├── routes/    # API routes (ai, rules, auth, campaign)
│   │   ├── services/  # Business logic (ollama, rulesLawyer, campaign)
│   │   └── index.ts
│   ├── prisma/        # Database schema
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml # Docker orchestration
└── README.md
```

## Development Status

- ✅ Project structure setup
- ✅ Backend server with Express + TypeScript
- ✅ Ollama integration service
- ✅ DM Chat interface with personality
- ✅ Rules Lawyer AI (integrated into DM chat)
- ✅ Character creation with D&D 5e skill restrictions
- ✅ Voice recognition and synthesis (English-only, fantasy voices)
- ✅ Google OAuth authentication
- ✅ Campaign system with objectives tracking
- ✅ Campaign completion tracking (boss defeat detection)
- ✅ Fantasy-themed UI with dark gradient background
- ✅ Docker configuration with Ollama, PostgreSQL
- ✅ Database schema with Prisma
- ⏳ 3D character visualization
- ⏳ Multiplayer features with Socket.io
- ⏳ Google OAuth callback handling (frontend integration)

## Tech Stack

### Frontend
- React + Vite + TypeScript
- Tailwind CSS
- Web Speech API (voice recognition/synthesis)

### Backend
- Node.js + Express + TypeScript
- Passport (Google OAuth)
- Express Session
- PostgreSQL + Prisma (planned)

### AI
- Ollama (local LLM)
- Llama 3 model

### Deployment
- Docker + Docker Compose
- Nginx (frontend reverse proxy)
