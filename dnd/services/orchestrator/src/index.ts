import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Service URLs
const NPC_SERVICE_URL = process.env.NPC_SERVICE_URL || 'http://npc-service:3001';
const DM_SERVICE_URL = process.env.DM_SERVICE_URL || 'http://dm-service:3002';
const TTS_SERVICE_URL = process.env.TTS_SERVICE_URL || 'http://tts-service:3003';
const MEMORY_SERVICE_URL = process.env.MEMORY_SERVICE_URL || 'http://memory-service:3004';

// Coordinate NPC dialogue with memory
app.post('/api/orchestrate/dialogue', async (req, res) => {
  try {
    const { campaignId, npcName, npcPersonality, npcRole, playerMessage, campaignContext } = req.body;

    if (!campaignId || !npcName || !npcPersonality || !playerMessage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parallel calls: NPC dialogue + memory retrieval
    const [npcResponse, memoryContext] = await Promise.all([
      fetch(`${NPC_SERVICE_URL}/api/npc/dialogue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ npcName, npcPersonality, npcRole, playerMessage, campaignContext }),
      }),
      fetch(`${MEMORY_SERVICE_URL}/api/memory/retrieve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId, query: playerMessage, nResults: 3 }),
      }),
    ]);

    const npcData = await npcResponse.json();
    const memoryData = await memoryContext.json();

    // Store conversation in memory
    await fetch(`${MEMORY_SERVICE_URL}/api/memory/store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId,
        role: 'npc',
        message: npcData.dialogue,
        metadata: { npcName, npcRole },
      }),
    });

    res.json({
      npcDialogue: npcData.dialogue,
      npcName: npcData.npcName,
      context: memoryData.context,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error orchestrating NPC dialogue:', error);
    res.status(500).json({ error: 'Failed to orchestrate NPC dialogue' });
  }
});

// Coordinate DM response with memory
app.post('/api/orchestrate/dm', async (req, res) => {
  try {
    const { campaignId, playerMessage, campaignContext, campaignHistory, npcs } = req.body;

    if (!campaignId || !playerMessage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parallel calls: DM generation + memory retrieval
    const [dmResponse, memoryContext] = await Promise.all([
      fetch(`${DM_SERVICE_URL}/api/dm/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerMessage, campaignContext, campaignHistory, npcs }),
      }),
      fetch(`${MEMORY_SERVICE_URL}/api/memory/retrieve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId, query: playerMessage, nResults: 5 }),
      }),
    ]);

    const dmData = await dmResponse.json();
    const memoryData = await memoryContext.json();

    // Store conversation in memory
    await fetch(`${MEMORY_SERVICE_URL}/api/memory/store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId,
        role: 'dm',
        message: dmData.dmResponse,
        metadata: { type: 'dm_response' },
      }),
    });

    res.json({
      dmResponse: dmData.dmResponse,
      context: memoryData.context,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error orchestrating DM response:', error);
    res.status(500).json({ error: 'Failed to orchestrate DM response' });
  }
});

// Coordinate TTS (sequential after text generation)
app.post('/api/orchestrate/tts', async (req, res) => {
  try {
    const { text, voice, rate, pitch } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Missing required field: text' });
    }

    const response = await fetch(`${TTS_SERVICE_URL}/api/tts/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice, rate, pitch }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error orchestrating TTS:', error);
    res.status(500).json({ error: 'Failed to orchestrate TTS' });
  }
});

// Coordinate campaign creation
app.post('/api/orchestrate/campaign', async (req, res) => {
  try {
    const { campaignName, description, setting, mission, npcs } = req.body;

    if (!campaignName || !setting || !mission) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await fetch(`${DM_SERVICE_URL}/api/dm/campaign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignName, description, setting, mission, npcs }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error orchestrating campaign creation:', error);
    res.status(500).json({ error: 'Failed to orchestrate campaign creation' });
  }
});

// Health Check
app.get('/api/orchestrate/health', async (req, res) => {
  try {
    const healthChecks = await Promise.all([
      fetch(`${NPC_SERVICE_URL}/api/npc/health`),
      fetch(`${DM_SERVICE_URL}/api/dm/health`),
      fetch(`${TTS_SERVICE_URL}/api/tts/health`),
      fetch(`${MEMORY_SERVICE_URL}/api/memory/health`),
    ]);

    const results = await Promise.all(healthChecks.map(async (response) => {
      const data = await response.json();
      return {
        service: data.service,
        status: response.ok ? 'healthy' : 'unhealthy',
      };
    }));

    const allHealthy = results.every(r => r.status === 'healthy');

    res.json({
      status: allHealthy ? 'healthy' : 'degraded',
      orchestrator: 'healthy',
      services: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      orchestrator: 'healthy',
      services: [],
      error: 'Service health checks failed',
      timestamp: new Date().toISOString(),
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Orchestrator Service - D&D Companion' });
});

app.listen(PORT, () => {
  console.log(`Orchestrator Service running on port ${PORT}`);
});
