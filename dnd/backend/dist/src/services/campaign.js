"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCampaign = startCampaign;
exports.advanceCampaign = advanceCampaign;
exports.getCampaign = getCampaign;
exports.completeObjective = completeObjective;
exports.resetCampaign = resetCampaign;
const ollama_1 = require("./ollama");
const DM_PERSONALITY = `You are an experienced and charismatic Dungeon Master for Dungeons & Dragons 5th Edition. Your personality traits:
- You are dramatic and theatrical, setting vivid scenes with descriptive language
- You are fair but challenging, balancing difficulty to keep players engaged
- You have a dry sense of humor and occasionally make witty remarks
- You are knowledgeable about D&D rules and can explain them when needed
- You enjoy creating memorable NPCs and engaging storylines
- You adapt to player choices and create consequences for actions
- You speak in a fantasy-appropriate tone, using terms like "adventurer", "quest", "realm"

When running a campaign:
- Start by setting the scene and presenting a hook
- Describe environments with sensory details (sights, sounds, smells)
- Give players meaningful choices with clear consequences
- Roll dice behind the scenes and describe results narratively
- Track important NPCs, locations, and plot points
- Build tension toward climactic moments
- Celebrate player victories and learn from defeats`;
let activeCampaign = null;
async function startCampaign(campaignName, description) {
    const prompt = `${DM_PERSONALITY}\n\nCreate a D&D campaign with the following details:\nName: ${campaignName}\nDescription: ${description}\n\nProvide:\n1. An opening scene/hook\n2. Main objectives (3-5)\n3. The final boss\n4. Setting the scene for the first adventure`;
    try {
        const response = await (0, ollama_1.generateResponse)(prompt, 'llama3');
        activeCampaign = {
            id: Date.now().toString(),
            name: campaignName,
            description,
            currentScene: response,
            objectives: ['Explore the starting area', 'Gather information', 'Complete the main quest'],
            completedObjectives: [],
            isComplete: false,
            bossDefeated: false,
            createdAt: new Date().toISOString(),
        };
        return activeCampaign;
    }
    catch (error) {
        console.error('Error starting campaign:', error);
        throw new Error('Failed to start campaign');
    }
}
async function advanceCampaign(playerAction) {
    if (!activeCampaign) {
        throw new Error('No active campaign');
    }
    const prompt = `${DM_PERSONALITY}\n\nCampaign: ${activeCampaign.name}\nCurrent Scene: ${activeCampaign.currentScene}\n\nPlayer Action: ${playerAction}\n\nAdvance the story based on this action. Describe what happens next, including any consequences, new information, or challenges. If this action completes an objective, mention it. If this defeats the final boss, mark the campaign as complete.`;
    try {
        const response = await (0, ollama_1.generateResponse)(prompt, 'llama3');
        activeCampaign.currentScene = response;
        // Check for boss defeat
        if (response.toLowerCase().includes('boss') &&
            (response.toLowerCase().includes('defeated') ||
                response.toLowerCase().includes('killed') ||
                response.toLowerCase().includes('vanquished'))) {
            activeCampaign.bossDefeated = true;
            activeCampaign.isComplete = true;
        }
        return response;
    }
    catch (error) {
        console.error('Error advancing campaign:', error);
        throw new Error('Failed to advance campaign');
    }
}
function getCampaign() {
    return activeCampaign;
}
function completeObjective(objective) {
    if (activeCampaign && !activeCampaign.completedObjectives.includes(objective)) {
        activeCampaign.completedObjectives.push(objective);
        // Check if all objectives are complete
        if (activeCampaign.completedObjectives.length === activeCampaign.objectives.length) {
            activeCampaign.isComplete = true;
        }
    }
}
function resetCampaign() {
    activeCampaign = null;
}
//# sourceMappingURL=campaign.js.map