import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// DM Response Generation
app.post('/api/dm/generate', async (req, res) => {
  try {
    const { playerMessage, campaignContext, campaignHistory, npcs } = req.body;

    if (!playerMessage) {
      return res.status(400).json({ error: 'Missing required field: playerMessage' });
    }

    // Build context from NPCs
    const npcContext = npcs && npcs.length > 0 
      ? `\nImportant NPCs in this campaign:\n${npcs.map((npc: any) => `- ${npc.name} (${npc.role}): ${npc.personality}`).join('\n')}`
      : '';

    // Generate DM response using Ollama or configured AI service
    const prompt = `You are a Dungeon Master for a D&D campaign. ${campaignContext || ''}
    
    ${npcContext}
    
    Recent history: ${campaignHistory || 'No recent history'}
    
    Player says: "${playerMessage}"
    
    Respond as the Dungeon Master. Be descriptive, engaging, and move the story forward. Keep your response concise (2-3 sentences).`;

    const apiUrl = process.env.DM_API_URL || 'http://ollama:11434';
    const model = process.env.DM_MODEL || 'llama3';

    const response = await fetch(`${apiUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.statusText}`);
    }

    const data = await response.json();
    
    res.json({
      dmResponse: data.response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating DM response:', error);
    res.status(500).json({ error: 'Failed to generate DM response' });
  }
});

// Campaign Management
app.post('/api/dm/campaign', async (req, res) => {
  try {
    const { campaignName, description, setting, mission, npcs } = req.body;

    if (!campaignName || !setting || !mission) {
      return res.status(400).json({ error: 'Missing required fields: campaignName, setting, mission' });
    }

    // Generate initial campaign introduction using AI
    const prompt = `You are a Dungeon Master starting a new D&D campaign called "${campaignName}".
    
    Campaign setting: ${setting}
    Main mission: ${mission}
    Description: ${description || 'No description provided'}
    
    ${npcs && npcs.length > 0 ? `Important NPCs: ${npcs.map((npc: any) => `${npc.name} (${npc.role})`).join(', ')}` : ''}
    
    Write an engaging 2-3 sentence introduction to start this campaign adventure.`;

    const apiUrl = process.env.DM_API_URL || 'http://ollama:11434';
    const model = process.env.DM_MODEL || 'llama3';

    const response = await fetch(`${apiUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.statusText}`);
    }

    const data = await response.json();
    
    res.json({
      campaign: {
        name: campaignName,
        description,
        setting,
        mission,
        npcs,
        introduction: data.response,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Health Check
app.get('/api/dm/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'dm-service',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'DM Assistant Service - D&D Companion' });
});

app.listen(PORT, () => {
  console.log(`DM Service running on port ${PORT}`);
});
