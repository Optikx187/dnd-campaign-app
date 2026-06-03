# D&D Campaign Application Implementation Plan

This plan outlines building a web-based Dungeons & Dragons companion application with AI-powered DM, rules lawyer, and NPC interactions using local LLM, voice recognition/synthesis, and 3D character visualization.

## Tech Stack

### Frontend
- **React + Vite**: Fast, modern development
- **Three.js**: 3D model rendering (lightweight, performant)
- **React Three Fiber**: React wrapper for Three.js
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Modern UI components
- **Web Speech API**: Browser-native voice recognition
- **Web Audio API**: Voice synthesis for NPCs/DM

### Backend
- **Node.js + Express**: Scalable, quick API server
- **Socket.io**: Real-time communication for multiplayer
- **PostgreSQL**: Persistent data storage
- **Prisma ORM**: Type-safe database access

### AI
- **Ollama**: Local LLM hosting at http://127.0.0.1:11434
- **Model**: Llama 3 or similar (7B for performance)
- **LangChain**: AI orchestration and prompt management

### Authentication
- **Phase 1**: Local authentication (username/password)
- **Phase 2**: Google OAuth integration

## Implementation Phases

### Phase 1: Project Setup & Infrastructure
1. Initialize React + Vite project with TypeScript
2. Set up Express backend with TypeScript
3. Configure PostgreSQL database with Prisma
4. Set up Ollama integration and test LLM connectivity
5. Configure project structure (frontend/backend separation)

### Phase 2: Database Schema
Design and implement tables for:
- **Users**: id, username, email, password_hash, created_at
- **Campaigns**: id, name, description, dm_id, world_data (JSON), created_at
- **Characters**: id, user_id, campaign_id, name, race, class, level, stats (JSON), inventory (JSON), created_at
- **NPCs**: id, campaign_id, name, description, personality (JSON), voice_profile (JSON)
- **Sessions**: id, campaign_id, chat_history (JSON), created_at
- **Items**: id, name, description, stats (JSON), type

### Phase 3: Frontend Core UI
1. **Main Layout**: Navigation, character sheet menu, campaign view
2. **Character Sheet Display**: Stats, inventory, abilities
3. **3D Character Viewer**: Three.js component for character models
4. **Campaign Hub**: List campaigns, create new campaign
5. **Settings Interface**: AI configuration, voice settings

### Phase 4: AI Integration
1. **Ollama Service**: Backend service to communicate with local LLM
2. **DM Agent**: System prompt for dungeon master role
3. **Rules Lawyer Agent**: System prompt for rule checking
4. **NPC Agent**: Dynamic personality injection based on NPC data
5. **Context Management**: Campaign state, character data, world info injection

### Phase 5: Voice Features
1. **Voice Recognition**: Web Speech API integration for user input
2. **Voice Synthesis**: Text-to-speech for AI responses
3. **Voice Profiles**: Different voices for NPCs vs DM
4. **Audio Management**: Mute/unmute, volume control

### Phase 6: Multiplayer Features
1. **Socket.io Integration**: Real-time campaign state sync
2. **Session Management**: Join/leave campaigns
3. **Character Tracking**: Each user views their own character
4. **Shared Chat**: All players see DM/NPC messages

### Phase 7: MVP Features
1. **DM Chat Interface**: Text/voice conversation with AI DM
2. **Character Creation**: Form-based character builder
3. **Rule Checking**: Ask AI about D&D 5e rules
4. **Campaign Sharing**: Invite players via campaign code

## File Structure
```
dnd/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/
│   │   │   │   ├── CharacterViewer.tsx
│   │   │   │   └── Scene.tsx
│   │   │   ├── ui/
│   │   │   │   ├── CharacterSheet.tsx
│   │   │   │   ├── CampaignHub.tsx
│   │   │   │   ├── DMChat.tsx
│   │   │   │   └── VoiceControls.tsx
│   │   │   └── auth/
│   │   │       └── LoginForm.tsx
│   │   ├── hooks/
│   │   │   ├── useVoiceRecognition.ts
│   │   │   ├── useVoiceSynthesis.ts
│   │   │   └── useSocket.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── campaigns.ts
│   │   │   ├── characters.ts
│   │   │   └── ai.ts
│   │   ├── services/
│   │   │   ├── ollama.ts
│   │   │   └── voice.ts
│   │   ├── models/
│   │   │   └── prisma.ts
│   │   ├── socket/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
└── README.md
```

## Key Features
- **3D Character Visualization**: Three.js-based character models
- **AI DM**: Local LLM for immersive storytelling
- **Rules Lawyer**: AI-powered D&D 5e rule checking
- **Voice Interaction**: Talk to NPCs and DM naturally
- **Multiplayer Sync**: Real-time campaign state across devices
- **Character Management**: Create, edit, track characters
- **Campaign Persistence**: Save world data, NPCs, items
- **Local-First AI**: Ollama for privacy and cost control

## Development Priorities
1. Get Ollama running and test LLM responses
2. Build basic frontend UI with character sheet
3. Implement database schema and Prisma setup
4. Create DM chat interface with AI integration
5. Add voice recognition and synthesis
6. Implement multiplayer sync with Socket.io
7. Add authentication (local first)

## Project Location
Project will be located at: E:\Repo\Devin\Projects\dnd
Ollama endpoint: http://127.0.0.1:11434
