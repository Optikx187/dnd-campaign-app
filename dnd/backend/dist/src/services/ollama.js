"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResponse = generateResponse;
exports.checkOllamaConnection = checkOllamaConnection;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
async function generateResponse(prompt, model = 'llama3') {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                prompt,
                stream: false,
            }),
        });
        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.response;
    }
    catch (error) {
        console.error('Error calling Ollama:', error);
        throw error;
    }
}
async function checkOllamaConnection() {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/tags`);
        return response.ok;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=ollama.js.map