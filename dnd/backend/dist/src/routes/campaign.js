"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campaign_1 = require("../services/campaign");
const router = (0, express_1.Router)();
router.post('/start', async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Campaign name is required' });
        }
        const campaign = await (0, campaign_1.startCampaign)(name, description || '');
        res.json(campaign);
    }
    catch (error) {
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
        const scene = await (0, campaign_1.advanceCampaign)(action);
        const campaign = (0, campaign_1.getCampaign)();
        res.json({ scene, campaign });
    }
    catch (error) {
        console.error('Campaign advance error:', error);
        res.status(500).json({ error: 'Failed to advance campaign' });
    }
});
router.get('/status', (req, res) => {
    const campaign = (0, campaign_1.getCampaign)();
    res.json({ campaign, isActive: !!campaign });
});
router.post('/objective', (req, res) => {
    try {
        const { objective } = req.body;
        if (!objective) {
            return res.status(400).json({ error: 'Objective is required' });
        }
        (0, campaign_1.completeObjective)(objective);
        const campaign = (0, campaign_1.getCampaign)();
        res.json(campaign);
    }
    catch (error) {
        console.error('Objective completion error:', error);
        res.status(500).json({ error: 'Failed to complete objective' });
    }
});
router.post('/reset', (req, res) => {
    (0, campaign_1.resetCampaign)();
    res.json({ message: 'Campaign reset' });
});
exports.default = router;
//# sourceMappingURL=campaign.js.map