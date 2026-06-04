import { Router } from 'express';
import { generateResponse, checkOllamaConnection } from '../services/ollama';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireBody } from '../middleware/validate';

const router = Router();

router.get('/health', async (req, res) => {
  const isHealthy = await checkOllamaConnection();
  res.json({ status: isHealthy ? 'connected' : 'disconnected' });
});

router.post(
  '/chat',
  requireBody('prompt'),
  asyncHandler(async (req, res) => {
    const { prompt, model } = req.body;
    const response = await generateResponse(prompt, model);
    res.json({ response });
  }, 'Failed to generate response')
);

export default router;
