import { generateResponse, checkOllamaConnection } from '../../services/ollama';

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('generateResponse', () => {
  it('sends correct request to Ollama API', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ model: 'llama3', response: 'Hello adventurer', done: true }),
    });

    const result = await generateResponse('Hello', 'llama3');

    expect(result).toBe('Hello adventurer');
    expect(mockFetch).toHaveBeenCalledWith(
      'http://127.0.0.1:11434/api/generate',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'llama3', prompt: 'Hello', stream: false }),
      }),
    );
  });

  it('uses default model when none specified', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ model: 'llama3', response: 'resp', done: true }),
    });

    await generateResponse('test');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.model).toBe('llama3');
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      statusText: 'Service Unavailable',
    });

    await expect(generateResponse('fail')).rejects.toThrow('Ollama API error: Service Unavailable');
  });

  it('propagates network errors', async () => {
    mockFetch.mockRejectedValue(new Error('ECONNREFUSED'));

    await expect(generateResponse('fail')).rejects.toThrow('ECONNREFUSED');
  });
});

describe('checkOllamaConnection', () => {
  it('returns true when Ollama is reachable', async () => {
    mockFetch.mockResolvedValue({ ok: true });

    const result = await checkOllamaConnection();
    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith('http://127.0.0.1:11434/api/tags');
  });

  it('returns false when Ollama responds with error', async () => {
    mockFetch.mockResolvedValue({ ok: false });

    const result = await checkOllamaConnection();
    expect(result).toBe(false);
  });

  it('returns false when network is unreachable', async () => {
    mockFetch.mockRejectedValue(new Error('network down'));

    const result = await checkOllamaConnection();
    expect(result).toBe(false);
  });
});
