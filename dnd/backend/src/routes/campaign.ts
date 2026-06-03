import { Router } from 'express';
import { startCampaign, advanceCampaign, getCampaign, completeObjective, resetCampaign } from '../services/campaign';

const router = Router();

router.post('/start', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Campaign name is required' });
    }

    const campaign = await startCampaign(name, description || '');
    res.json(campaign);
  } catch (error) {
    console.error('Campaign start error:', error);
    res.status(500).json({ error: 'Failed to start campaign' });
  }
});

router.post('/advance', async (req, res) => {
  try {
    const { action } = req.body;
    
    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }

    const scene = await advanceCampaign(action);
    const campaign = getCampaign();
    res.json({ scene, campaign });
  } catch (error) {
    console.error('Campaign advance error:', error);
    res.status(500).json({ error: 'Failed to advance campaign' });
  }
});

router.get('/status', (req, res) => {
  const campaign = getCampaign();
  res.json({ campaign, isActive: !!campaign });
});

router.post('/objective', (req, res) => {
  try {
    const { objective } = req.body;
    
    if (!objective) {
      return res.status(400).json({ error: 'Objective is required' });
    }

    completeObjective(objective);
    const campaign = getCampaign();
    res.json(campaign);
  } catch (error) {
    console.error('Objective completion error:', error);
    res.status(500).json({ error: 'Failed to complete objective' });
  }
});

router.post('/reset', (req, res) => {
  resetCampaign();
  res.json({ message: 'Campaign reset' });
});

export default router;
