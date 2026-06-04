---
name: testing-dnd-app
description: Test the D&D Campaign App end-to-end. Use when verifying frontend UI changes, backend API fixes, or full-stack integration.
---

# Testing the D&D Campaign App

## Architecture

- **Frontend:** React + Vite + TypeScript + Tailwind CSS v4 (in `dnd/frontend/`)
- **Backend:** Express + TypeScript + Ollama LLM integration (in `dnd/backend/`)
- **Auth:** Demo mode — backend accepts any username/password and returns a mock user object
- **Storage:** localStorage on the frontend (no database in demo mode)
- **AI:** Requires Ollama with `llama3` model for campaign creation (campaign start will fail without it)

## Environment Setup

### 1. Install Dependencies

```bash
cd dnd/frontend && npm install
cd dnd/backend && npm install
```

### 2. Vite Proxy Configuration

The frontend uses relative API URLs (`/api/...`). For local dev testing, add a proxy to `dnd/frontend/vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
```

**Important:** This proxy config may not be committed. Check before testing and add it if missing. Without it, all `/api/...` fetch calls will return 404.

### 3. Start Servers

```bash
# Terminal 1 — Backend (port 3000)
cd dnd/backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd dnd/frontend && npm run dev
```

Backend runs on port 3000, frontend on port 5173 (Vite default).

## Testing Flows

### Login
- Navigate to `http://localhost:5173/`
- Enter any username/password (demo auth accepts all credentials)
- Verify redirect to `/campaigns` and `localStorage.user` is set

### Auth Guards
- Clear `localStorage` and navigate directly to `/campaigns`, `/campaigns/list`, or `/campaign/play`
- All should redirect to `/` (login page)

### Campaign Play Page
- Requires `dnd-campaign` in localStorage with a campaign object
- If no Ollama is available, seed localStorage manually:

```javascript
const testCampaign = {
  id: "test-campaign-1",
  name: "Test Campaign",
  description: "A test campaign",
  setting: "Medieval fantasy",
  mission: "Defeat the dragon",
  npcs: [{name: "NPC1", personality: "Wise", role: "Quest Giver"}],
  currentScene: "You stand at the entrance of a cave.",
  objectives: ["Find the lair", "Get the sword", "Defeat the boss"],
  completedObjectives: [],
  isComplete: false,
  bossDefeated: false,
  createdAt: new Date().toISOString()
};
localStorage.setItem('dnd-campaign', JSON.stringify(testCampaign));
```

### Campaign List Page
- Requires `dnd-campaigns` (plural) in localStorage with an array of campaign objects
- Seed with multiple campaigns to test the list and delete modal

```javascript
localStorage.setItem('dnd-campaigns', JSON.stringify([campaign1, campaign2]));
```

### Key UI Elements to Verify

| Element | Location | What to Check |
|---------|----------|---------------|
| Sidebar toggle | `/campaign/play` top-left | Shows ✕ when open, ☰ when closed |
| Rules emoji | Sidebar nav | Should show 📖, not replacement char |
| Session Active badge | Header area | Green styling with pulse dot |
| Delete modal | `/campaigns/list` | Styled modal, not browser `confirm()` |
| Sign up button | Login page | Has onClick, navigates to `/register` |

## Known Issues

- **Tailwind CSS might not render visually** in dev mode. This can be a pre-existing configuration issue with Tailwind v4. Functional behavior can still be verified via DOM inspection (`document.querySelector(...)` in browser console).
- **Campaign creation requires Ollama** with `llama3` model. Without it, the `/api/campaign/start` endpoint will fail. Seed localStorage manually to test campaign-dependent UI.
- **No CI configured** for this repo. All testing is manual.

## Devin Secrets Needed

None required — the app uses demo auth that accepts any credentials.
