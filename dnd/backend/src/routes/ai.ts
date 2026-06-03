import { Router } from 'express';
import { generateResponse, checkOllamaConnection } from '../services/ollama';

const router = Router();

router.get('/health', async (req, res) => {
  const isHealthy = await checkOllamaConnection();
  res.json({ status: isHealthy ? 'connected' : 'disconnected' });
});

router.post('/chat', async (req, res) => {
  try {
    const { prompt, model } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await generateResponse(prompt, model);
    res.json({ response });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

export default router;
