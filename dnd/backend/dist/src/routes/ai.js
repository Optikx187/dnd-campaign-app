"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ollama_1 = require("../services/ollama");
const router = (0, express_1.Router)();
router.get('/health', async (req, res) => {
    const isHealthy = await (0, ollama_1.checkOllamaConnection)();
    res.json({ status: isHealthy ? 'connected' : 'disconnected' });
});
router.post('/chat', async (req, res) => {
    try {
        const { prompt, model } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        const response = await (0, ollama_1.generateResponse)(prompt, model);
        res.json({ response });
    }
    catch (error) {
        console.error('AI chat error:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});
exports.default = router;
//# sourceMappingURL=ai.js.map