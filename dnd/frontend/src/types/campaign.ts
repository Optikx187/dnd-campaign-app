export interface Campaign {
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

export interface CampaignSummary {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}
