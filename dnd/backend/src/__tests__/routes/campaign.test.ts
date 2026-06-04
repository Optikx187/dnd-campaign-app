import express from 'express';
import campaignRoutes from '../../routes/campaign';
import { resetCampaign } from '../../services/campaign';

jest.mock('../../services/ollama', () => ({
  generateResponse: jest.fn(),
}));

import { generateResponse } from '../../services/ollama';

const mockedGenerateResponse = generateResponse as jest.MockedFunction<typeof generateResponse>;

const app = express();
app.use(express.json());
app.use('/api/campaign', campaignRoutes);

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
  resetCampaign();
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

describe('POST /api/campaign/start', () => {
  it('returns 400 when name is missing', async () => {
    const { status, data } = await request('POST', '/api/campaign/start', {});
    expect(status).toBe(400);
    expect(data.error).toBe('Campaign name is required');
  });

  it('starts a campaign successfully', async () => {
    mockedGenerateResponse.mockResolvedValue('You stand at the gates...');
    const { status, data } = await request('POST', '/api/campaign/start', {
      name: 'Epic Quest',
      description: 'A story',
    });
    expect(status).toBe(200);
    expect(data.name).toBe('Epic Quest');
    expect(data.currentScene).toBe('You stand at the gates...');
  });
});

describe('POST /api/campaign/advance', () => {
  it('returns 400 when action is missing', async () => {
    const { status, data } = await request('POST', '/api/campaign/advance', {});
    expect(status).toBe(400);
    expect(data.error).toBe('Action is required');
  });

  it('returns 500 when no campaign is active', async () => {
    const { status, data } = await request('POST', '/api/campaign/advance', { action: 'run' });
    expect(status).toBe(500);
    expect(data.error).toBe('Failed to advance campaign');
  });

  it('advances a running campaign', async () => {
    mockedGenerateResponse
      .mockResolvedValueOnce('Opening')
      .mockResolvedValueOnce('You found treasure!');

    await request('POST', '/api/campaign/start', { name: 'Adv Test' });
    const { status, data } = await request('POST', '/api/campaign/advance', { action: 'search' });

    expect(status).toBe(200);
    expect(data.scene).toBe('You found treasure!');
    expect(data.campaign).toBeDefined();
  });
});

describe('GET /api/campaign/status', () => {
  it('returns inactive when no campaign exists', async () => {
    const { status, data } = await request('GET', '/api/campaign/status');
    expect(status).toBe(200);
    expect(data.isActive).toBe(false);
    expect(data.campaign).toBeNull();
  });

  it('returns active campaign', async () => {
    mockedGenerateResponse.mockResolvedValue('Scene');
    await request('POST', '/api/campaign/start', { name: 'Status Test' });

    const { status, data } = await request('GET', '/api/campaign/status');
    expect(status).toBe(200);
    expect(data.isActive).toBe(true);
    expect(data.campaign.name).toBe('Status Test');
  });
});

describe('POST /api/campaign/objective', () => {
  it('returns 400 when objective is missing', async () => {
    const { status, data } = await request('POST', '/api/campaign/objective', {});
    expect(status).toBe(400);
    expect(data.error).toBe('Objective is required');
  });
});

describe('POST /api/campaign/reset', () => {
  it('resets the campaign', async () => {
    mockedGenerateResponse.mockResolvedValue('Scene');
    await request('POST', '/api/campaign/start', { name: 'Reset Test' });

    const { status, data } = await request('POST', '/api/campaign/reset');
    expect(status).toBe(200);
    expect(data.message).toBe('Campaign reset');

    const statusRes = await request('GET', '/api/campaign/status');
    expect(statusRes.data.isActive).toBe(false);
  });
});
