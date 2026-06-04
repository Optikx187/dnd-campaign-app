import express from 'express';
import rulesRoutes from '../../routes/rules';

jest.mock('../../services/ollama', () => ({
  generateResponse: jest.fn(),
}));

import { generateResponse } from '../../services/ollama';

const mockedGenerateResponse = generateResponse as jest.MockedFunction<typeof generateResponse>;

const app = express();
app.use(express.json());
app.use('/api/rules', rulesRoutes);

let server: ReturnType<typeof app.listen>;
let port: number;

beforeAll(() => {
  server = app.listen(0);
  const address = server.address();
  port = typeof address === 'object' && address ? address.port : 0;
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  jest.clearAllMocks();
});

async function request(method: 'POST', path: string, body?: object) {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`http://127.0.0.1:${port}${path}`, options);
  const data = await res.json();
  return { status: res.status, data };
}

describe('POST /api/rules/ask', () => {
  it('returns 400 when question is missing', async () => {
    const { status, data } = await request('POST', '/api/rules/ask', {});
    expect(status).toBe(400);
    expect(data.error).toBe('Question is required');
  });

  it('returns the answer from the rules lawyer', async () => {
    mockedGenerateResponse.mockResolvedValue('Sneak attack requires finesse');
    const { status, data } = await request('POST', '/api/rules/ask', {
      question: 'How does sneak attack work?',
    });
    expect(status).toBe(200);
    expect(data.answer).toBe('Sneak attack requires finesse');
  });

  it('returns 500 when AI fails', async () => {
    mockedGenerateResponse.mockRejectedValue(new Error('AI error'));
    const { status, data } = await request('POST', '/api/rules/ask', { question: 'test' });
    expect(status).toBe(500);
    expect(data.error).toBe('Failed to get rules advice');
  });
});

describe('POST /api/rules/check', () => {
  it('returns 400 when query is missing', async () => {
    const { status, data } = await request('POST', '/api/rules/check', {});
    expect(status).toBe(400);
    expect(data.error).toBe('Query is required');
  });

  it('returns parsed rule check result', async () => {
    mockedGenerateResponse.mockResolvedValue(
      'ANSWER: Yes you can\nCONFIDENCE: high\nSOURCES: PHB p.50',
    );
    const { status, data } = await request('POST', '/api/rules/check', {
      query: 'Can I dual wield?',
    });
    expect(status).toBe(200);
    expect(data.answer).toBe('Yes you can');
    expect(data.confidence).toBe('high');
    expect(data.sources).toContain('PHB p.50');
  });

  it('returns 500 when AI fails', async () => {
    mockedGenerateResponse.mockRejectedValue(new Error('down'));
    const { status, data } = await request('POST', '/api/rules/check', { query: 'test' });
    expect(status).toBe(500);
    expect(data.error).toBe('Failed to check rule');
  });
});
