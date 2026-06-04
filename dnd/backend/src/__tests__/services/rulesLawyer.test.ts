import { askRulesLawyer, checkRule } from '../../services/rulesLawyer';

jest.mock('../../services/ollama', () => ({
  generateResponse: jest.fn(),
}));

import { generateResponse } from '../../services/ollama';

const mockedGenerateResponse = generateResponse as jest.MockedFunction<typeof generateResponse>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('askRulesLawyer', () => {
  it('returns the AI response for a rules question', async () => {
    mockedGenerateResponse.mockResolvedValue('A fireball deals 8d6 fire damage');

    const answer = await askRulesLawyer('How much damage does fireball do?');
    expect(answer).toBe('A fireball deals 8d6 fire damage');
  });

  it('includes the question in the prompt', async () => {
    mockedGenerateResponse.mockResolvedValue('answer');
    await askRulesLawyer('Can I multiclass?');

    const prompt = mockedGenerateResponse.mock.calls[0]![0];
    expect(prompt).toContain('Can I multiclass?');
  });

  it('throws a descriptive error when AI fails', async () => {
    mockedGenerateResponse.mockRejectedValue(new Error('timeout'));
    await expect(askRulesLawyer('test')).rejects.toThrow('Failed to get rules advice');
  });
});

describe('checkRule', () => {
  it('parses a well-formatted response', async () => {
    mockedGenerateResponse.mockResolvedValue(
      'ANSWER: You can take two attacks per turn\nCONFIDENCE: high\nSOURCES: PHB p.72, DMG p.100',
    );

    const result = await checkRule('How many attacks does a fighter get?');
    expect(result.answer).toBe('You can take two attacks per turn');
    expect(result.confidence).toBe('high');
    expect(result.sources).toEqual(['PHB p.72', 'DMG p.100']);
  });

  it('handles medium confidence', async () => {
    mockedGenerateResponse.mockResolvedValue(
      'ANSWER: Possibly yes\nCONFIDENCE: medium\nSOURCES: PHB',
    );

    const result = await checkRule('test');
    expect(result.confidence).toBe('medium');
  });

  it('handles low confidence', async () => {
    mockedGenerateResponse.mockResolvedValue(
      'ANSWER: Unclear\nCONFIDENCE: low\nSOURCES: none',
    );

    const result = await checkRule('test');
    expect(result.confidence).toBe('low');
  });

  it('falls back gracefully when response has no structured format', async () => {
    mockedGenerateResponse.mockResolvedValue('Just a plain text answer with no formatting');

    const result = await checkRule('vague question');
    expect(result.answer).toBe('Just a plain text answer with no formatting');
    expect(result.confidence).toBe('medium');
    expect(result.sources).toEqual([]);
  });

  it('throws a descriptive error when AI fails', async () => {
    mockedGenerateResponse.mockRejectedValue(new Error('down'));
    await expect(checkRule('test')).rejects.toThrow('Failed to check rule');
  });
});
