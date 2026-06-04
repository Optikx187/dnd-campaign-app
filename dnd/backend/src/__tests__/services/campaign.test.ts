import { getCampaign, completeObjective, resetCampaign, startCampaign, advanceCampaign } from '../../services/campaign';

jest.mock('../../services/ollama', () => ({
  generateResponse: jest.fn(),
}));

import { generateResponse } from '../../services/ollama';

const mockedGenerateResponse = generateResponse as jest.MockedFunction<typeof generateResponse>;

beforeEach(() => {
  resetCampaign();
  jest.clearAllMocks();
});

describe('getCampaign', () => {
  it('returns null when no campaign is active', () => {
    expect(getCampaign()).toBeNull();
  });
});

describe('resetCampaign', () => {
  it('clears the active campaign', async () => {
    mockedGenerateResponse.mockResolvedValue('Opening scene text');
    await startCampaign('Test', 'desc');
    expect(getCampaign()).not.toBeNull();

    resetCampaign();
    expect(getCampaign()).toBeNull();
  });
});

describe('startCampaign', () => {
  it('creates a campaign with the given name and description', async () => {
    mockedGenerateResponse.mockResolvedValue('The adventure begins...');

    const campaign = await startCampaign('Dragon Quest', 'A tale of fire');
    expect(campaign.name).toBe('Dragon Quest');
    expect(campaign.description).toBe('A tale of fire');
    expect(campaign.currentScene).toBe('The adventure begins...');
    expect(campaign.isComplete).toBe(false);
    expect(campaign.bossDefeated).toBe(false);
    expect(campaign.objectives).toHaveLength(3);
    expect(campaign.completedObjectives).toHaveLength(0);
    expect(campaign.id).toBeDefined();
    expect(campaign.createdAt).toBeDefined();
  });

  it('passes the campaign info to the AI prompt', async () => {
    mockedGenerateResponse.mockResolvedValue('scene');
    await startCampaign('My Campaign', 'desc');

    expect(mockedGenerateResponse).toHaveBeenCalledTimes(1);
    const prompt = mockedGenerateResponse.mock.calls[0]![0];
    expect(prompt).toContain('My Campaign');
    expect(prompt).toContain('desc');
  });

  it('throws when the AI call fails', async () => {
    mockedGenerateResponse.mockRejectedValue(new Error('AI down'));
    await expect(startCampaign('Fail', '')).rejects.toThrow('Failed to start campaign');
  });
});

describe('advanceCampaign', () => {
  it('throws when no active campaign exists', async () => {
    await expect(advanceCampaign('attack')).rejects.toThrow('No active campaign');
  });

  it('updates the current scene from AI response', async () => {
    mockedGenerateResponse
      .mockResolvedValueOnce('Opening scene')
      .mockResolvedValueOnce('You walk north and find a cave');

    await startCampaign('Test', '');
    const result = await advanceCampaign('walk north');

    expect(result).toBe('You walk north and find a cave');
    expect(getCampaign()!.currentScene).toBe('You walk north and find a cave');
  });

  it('detects boss defeated via "defeated" keyword', async () => {
    mockedGenerateResponse
      .mockResolvedValueOnce('Opening')
      .mockResolvedValueOnce('The boss has been defeated!');

    await startCampaign('Boss Fight', '');
    await advanceCampaign('attack boss');

    const campaign = getCampaign()!;
    expect(campaign.bossDefeated).toBe(true);
    expect(campaign.isComplete).toBe(true);
  });

  it('detects boss defeated via "killed" keyword', async () => {
    mockedGenerateResponse
      .mockResolvedValueOnce('Opening')
      .mockResolvedValueOnce('You killed the boss with a mighty blow');

    await startCampaign('Kill Boss', '');
    await advanceCampaign('strike');

    expect(getCampaign()!.bossDefeated).toBe(true);
  });

  it('detects boss defeated via "vanquished" keyword', async () => {
    mockedGenerateResponse
      .mockResolvedValueOnce('Opening')
      .mockResolvedValueOnce('The boss was vanquished at last');

    await startCampaign('Vanquish', '');
    await advanceCampaign('final blow');

    expect(getCampaign()!.bossDefeated).toBe(true);
  });

  it('does not mark complete when boss keyword absent', async () => {
    mockedGenerateResponse
      .mockResolvedValueOnce('Opening')
      .mockResolvedValueOnce('You enter a dark forest');

    await startCampaign('Explore', '');
    await advanceCampaign('go forward');

    const campaign = getCampaign()!;
    expect(campaign.bossDefeated).toBe(false);
    expect(campaign.isComplete).toBe(false);
  });

  it('throws when the AI call fails during advance', async () => {
    mockedGenerateResponse
      .mockResolvedValueOnce('Opening')
      .mockRejectedValueOnce(new Error('network'));

    await startCampaign('Err', '');
    await expect(advanceCampaign('action')).rejects.toThrow('Failed to advance campaign');
  });
});

describe('completeObjective', () => {
  it('adds the objective to completedObjectives', async () => {
    mockedGenerateResponse.mockResolvedValue('Opening');
    await startCampaign('Obj Test', '');

    completeObjective('Explore the starting area');
    const campaign = getCampaign()!;
    expect(campaign.completedObjectives).toContain('Explore the starting area');
  });

  it('does not duplicate an already-completed objective', async () => {
    mockedGenerateResponse.mockResolvedValue('Opening');
    await startCampaign('Dup Test', '');

    completeObjective('Explore the starting area');
    completeObjective('Explore the starting area');
    expect(getCampaign()!.completedObjectives.filter(o => o === 'Explore the starting area')).toHaveLength(1);
  });

  it('marks campaign complete when all objectives are finished', async () => {
    mockedGenerateResponse.mockResolvedValue('Opening');
    await startCampaign('Complete Test', '');

    const campaign = getCampaign()!;
    for (const obj of campaign.objectives) {
      completeObjective(obj);
    }

    expect(getCampaign()!.isComplete).toBe(true);
  });

  it('does nothing when no campaign is active', () => {
    expect(() => completeObjective('anything')).not.toThrow();
  });
});
