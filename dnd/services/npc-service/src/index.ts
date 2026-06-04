import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// NPC Dialogue Generation
app.post('/api/npc/dialogue', async (req, res) => {
  try {
    const { npcName, npcPersonality, npcRole, playerMessage, campaignContext } = req.body;

    if (!npcName || !npcPersonality || !playerMessage) {
      return res.status(400).json({ error: 'Missing required fields: npcName, npcPersonality, playerMessage' });
    }

    // Generate dialogue using Ollama or configured AI service
    const prompt = `You are ${npcName}, a ${npcRole} with the following personality: ${npcPersonality}.
    
    Campaign context: ${campaignContext || 'No specific context provided'}
    
    Player says: "${playerMessage}"
    
    Respond as ${npcName} in character. Keep your response concise (1-2 sentences) and authentic to your personality.`;

    const apiUrl = process.env.NPC_API_URL || 'http://ollama:11434';
    const model = process.env.NPC_MODEL || 'llama3';

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
      npcName,
      dialogue: data.response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating NPC dialogue:', error);
    res.status(500).json({ error: 'Failed to generate NPC dialogue' });
  }
});

// Health Check
app.get('/api/npc/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'npc-service',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'NPC Dialogue Service - D&D Companion' });
});

app.listen(PORT, () => {
  console.log(`NPC Service running on port ${PORT}`);
});
