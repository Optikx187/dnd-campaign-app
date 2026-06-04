const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface FetchOptions {
  method?: string;
  body?: unknown;
}

export async function apiRequest<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body } = options;

  const config: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Request failed: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'POST', body });
}

export function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint);
}
