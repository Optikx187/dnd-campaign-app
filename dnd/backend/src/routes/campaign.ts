import { Router } from 'express';
import { startCampaign, advanceCampaign, getCampaign, completeObjective, resetCampaign } from '../services/campaign';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireBody } from '../middleware/validate';

const router = Router();

router.post(
  '/start',
  requireBody('name'),
  asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const campaign = await startCampaign(name, description || '');
    res.json(campaign);
  }, 'Failed to start campaign')
);

router.post(
  '/advance',
  requireBody('action'),
  asyncHandler(async (req, res) => {
    const { action } = req.body;
    const scene = await advanceCampaign(action);
    const campaign = getCampaign();
    res.json({ scene, campaign });
  }, 'Failed to advance campaign')
);

router.get('/status', (req, res) => {
  const campaign = getCampaign();
  res.json({ campaign, isActive: !!campaign });
});

router.post(
  '/objective',
  requireBody('objective'),
  asyncHandler(async (req, res) => {
    const { objective } = req.body;
    completeObjective(objective);
    const campaign = getCampaign();
    res.json(campaign);
  }, 'Failed to complete objective')
);

router.post('/reset', (req, res) => {
  resetCampaign();
  res.json({ message: 'Campaign reset' });
});

export default router;
