# D&D Campaign Application

A web-based Dungeons & Dragons companion application with AI-powered DM, rules lawyer, and NPC interactions using local LLM.

## Prerequisites

- Node.js (v18 or higher) installed
- Ollama running locally at http://127.0.0.1:11434
- PostgreSQL (optional, for future database features)

## Local Startup Steps

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the backend server:**
   ```bash
   npm run dev
   ```

The backend will run on http://localhost:3000

### Frontend Setup

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

- **DM Chat Interface**: Chat with an AI Dungeon Master powered by local LLM
- **Ollama Integration**: Uses local LLM for AI responses
- **Basic UI**: Clean interface built with React and Tailwind CSS

## Project Structure

```
dnd/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/    # 3D character viewer (future)
│   │   │   ├── ui/    # UI components
│   │   │   └── auth/  # Authentication (future)
│   │   └── App.tsx
│   └── package.json
├── backend/           # Express + TypeScript backend
│   ├── src/
│   │   ├── routes/    # API routes
│   │   ├── services/  # Business logic (Ollama, etc.)
│   │   ├── models/    # Database models (future)
│   │   └── socket/    # Socket.io (future)
│   └── package.json
└── README.md
```

## Development Status

- ✅ Project structure setup
- ✅ Backend server with Express + TypeScript
- ✅ Ollama integration service
- ✅ DM Chat interface
- ✅ Basic UI with Tailwind CSS
- ⏳ 3D character visualization
- ⏳ Voice recognition and synthesis
- ⏳ Database integration (PostgreSQL)
- ⏳ Authentication system
- ⏳ Character creation
- ⏳ Multiplayer features
- ⏳ Rules lawyer AI

## Tech Stack

### Frontend
- React + Vite + TypeScript
- Three.js (for 3D visualization)
- React Three Fiber
- Tailwind CSS

### Backend
- Node.js + Express + TypeScript
- Socket.io (for real-time features)
- PostgreSQL + Prisma (planned)

### AI
- Ollama (local LLM)
- Llama 3 model
