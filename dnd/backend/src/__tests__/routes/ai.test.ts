import express from 'express';
import aiRoutes from '../../routes/ai';

jest.mock('../../services/ollama', () => ({
  generateResponse: jest.fn(),
  checkOllamaConnection: jest.fn(),
}));

import { generateResponse, checkOllamaConnection } from '../../services/ollama';

const mockedGenerateResponse = generateResponse as jest.MockedFunction<typeof generateResponse>;
const mockedCheckConnection = checkOllamaConnection as jest.MockedFunction<typeof checkOllamaConnection>;

const app = express();
app.use(express.json());
app.use('/api/ai', aiRoutes);

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

async function request(method: 'GET' | 'POST', path: string, body?: object) {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`http://127.0.0.1:${port}${path}`, options);
  const data = await res.json();
  return { status: res.status, data };
}

describe('GET /api/ai/health', () => {
  it('returns connected when Ollama is up', async () => {
    mockedCheckConnection.mockResolvedValue(true);
    const { status, data } = await request('GET', '/api/ai/health');
    expect(status).toBe(200);
    expect(data.status).toBe('connected');
  });

  it('returns disconnected when Ollama is down', async () => {
    mockedCheckConnection.mockResolvedValue(false);
    const { status, data } = await request('GET', '/api/ai/health');
    expect(status).toBe(200);
    expect(data.status).toBe('disconnected');
  });
});

describe('POST /api/ai/chat', () => {
  it('returns 400 when prompt is missing', async () => {
    const { status, data } = await request('POST', '/api/ai/chat', {});
    expect(status).toBe(400);
    expect(data.error).toBe('Prompt is required');
  });

  it('returns AI response on valid prompt', async () => {
    mockedGenerateResponse.mockResolvedValue('Greetings traveler!');
    const { status, data } = await request('POST', '/api/ai/chat', {
      prompt: 'Hello',
      model: 'llama3',
    });
    expect(status).toBe(200);
    expect(data.response).toBe('Greetings traveler!');
  });

  it('returns 500 when AI fails', async () => {
    mockedGenerateResponse.mockRejectedValue(new Error('fail'));
    const { status, data } = await request('POST', '/api/ai/chat', { prompt: 'test' });
    expect(status).toBe(500);
    expect(data.error).toBe('Failed to generate response');
  });
});
