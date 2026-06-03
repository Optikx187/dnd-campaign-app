import { Router } from 'express';
import { askRulesLawyer, checkRule } from '../services/rulesLawyer';

const router = Router();

router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const answer = await askRulesLawyer(question);
    res.json({ answer });
  } catch (error) {
    console.error('Rules lawyer error:', error);
    res.status(500).json({ error: 'Failed to get rules advice' });
  }
});

router.post('/check', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const result = await checkRule(query);
    res.json(result);
  } catch (error) {
    console.error('Rule check error:', error);
    res.status(500).json({ error: 'Failed to check rule' });
  }
});

export default router;
