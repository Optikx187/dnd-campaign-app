"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rulesLawyer_1 = require("../services/rulesLawyer");
const router = (0, express_1.Router)();
router.post('/ask', async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }
        const answer = await (0, rulesLawyer_1.askRulesLawyer)(question);
        res.json({ answer });
    }
    catch (error) {
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
        const result = await (0, rulesLawyer_1.checkRule)(query);
        res.json(result);
    }
    catch (error) {
        console.error('Rule check error:', error);
        res.status(500).json({ error: 'Failed to check rule' });
    }
});
exports.default = router;
//# sourceMappingURL=rules.js.map