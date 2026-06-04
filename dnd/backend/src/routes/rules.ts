import { Router } from 'express';
import { askRulesLawyer, checkRule } from '../services/rulesLawyer';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireBody } from '../middleware/validate';

const router = Router();

router.post(
  '/ask',
  requireBody('question'),
  asyncHandler(async (req, res) => {
    const { question } = req.body;
    const answer = await askRulesLawyer(question);
    res.json({ answer });
  }, 'Failed to get rules advice')
);

router.post(
  '/check',
  requireBody('query'),
  asyncHandler(async (req, res) => {
    const { query } = req.body;
    const result = await checkRule(query);
    res.json(result);
  }, 'Failed to check rule')
);

export default router;
