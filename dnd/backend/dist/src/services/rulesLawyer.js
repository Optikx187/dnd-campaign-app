"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askRulesLawyer = askRulesLawyer;
exports.checkRule = checkRule;
const ollama_1 = require("./ollama");
const RULES_LAWYER_SYSTEM_PROMPT = `You are an expert Dungeon Master and Rules Lawyer for Dungeons & Dragons 5th Edition. Your role is to answer questions about D&D 5e rules accurately and concisely.

When answering:
- Cite specific rules, page numbers, or book references when possible
- Explain the reasoning behind your answer
- If a rule is ambiguous, explain the different interpretations
- Keep answers clear and actionable
- Focus on official 5e rules, not homebrew or optional rules unless specified

If you're unsure about a rule, say so and suggest where the user can find more information.`;
async function askRulesLawyer(question) {
    const prompt = `${RULES_LAWYER_SYSTEM_PROMPT}\n\nQuestion: ${question}`;
    try {
        const response = await (0, ollama_1.generateResponse)(prompt, 'llama3');
        return response;
    }
    catch (error) {
        console.error('Error asking rules lawyer:', error);
        throw new Error('Failed to get rules advice');
    }
}
async function checkRule(ruleQuery) {
    const prompt = `${RULES_LAWYER_SYSTEM_PROMPT}\n\nAnalyze this rule query and provide your answer with confidence level and sources.\n\nQuery: ${ruleQuery}\n\nPlease format your response as:\nANSWER: [your answer]\nCONFIDENCE: [high/medium/low]\nSOURCES: [list of sources]`;
    try {
        const response = await (0, ollama_1.generateResponse)(prompt, 'llama3');
        // Parse the response
        const answerMatch = response.match(/ANSWER:\s*(.*?)(?=\nCONFIDENCE:|$)/s);
        const confidenceMatch = response.match(/CONFIDENCE:\s*(high|medium|low)/i);
        const sourcesMatch = response.match(/SOURCES:\s*(.*)/i);
        return {
            answer: answerMatch?.[1]?.trim() || response,
            confidence: confidenceMatch?.[1]?.toLowerCase() || 'medium',
            sources: sourcesMatch?.[1]?.split(',').map(s => s.trim()) || [],
        };
    }
    catch (error) {
        console.error('Error checking rule:', error);
        throw new Error('Failed to check rule');
    }
}
//# sourceMappingURL=rulesLawyer.js.map