interface Campaign {
    id: string;
    name: string;
    description: string;
    currentScene: string;
    objectives: string[];
    completedObjectives: string[];
    isComplete: boolean;
    bossDefeated: boolean;
    createdAt: string;
}
export declare function startCampaign(campaignName: string, description: string): Promise<Campaign>;
export declare function advanceCampaign(playerAction: string): Promise<string>;
export declare function getCampaign(): Campaign | null;
export declare function completeObjective(objective: string): void;
export declare function resetCampaign(): void;
export {};
//# sourceMappingURL=campaign.d.ts.map