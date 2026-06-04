import express from 'express';
import authRoutes from '../../routes/auth';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Express 5 compatible: use node's built-in test client approach
async function request(method: 'GET' | 'POST', path: string, body?: object) {
  const server = app.listen(0);
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;

  try {
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`http://127.0.0.1:${port}${path}`, options);
    const data = await res.json();
    return { status: res.status, data };
  } finally {
    server.close();
  }
}

describe('POST /api/auth/login', () => {
  it('returns 400 when username is missing', async () => {
    const { status, data } = await request('POST', '/api/auth/login', { password: 'pass' });
    expect(status).toBe(400);
    expect(data.error).toBe('Username and password are required');
  });

  it('returns 400 when password is missing', async () => {
    const { status, data } = await request('POST', '/api/auth/login', { username: 'user' });
    expect(status).toBe(400);
    expect(data.error).toBe('Username and password are required');
  });

  it('returns 400 when body is empty', async () => {
    const { status, data } = await request('POST', '/api/auth/login', {});
    expect(status).toBe(400);
    expect(data.error).toBe('Username and password are required');
  });

  it('returns user on valid login', async () => {
    const { status, data } = await request('POST', '/api/auth/login', {
      username: 'testuser',
      password: 'testpass',
    });
    expect(status).toBe(200);
    expect(data.user.username).toBe('testuser');
    expect(data.message).toBe('Login successful');
  });
});

describe('POST /api/auth/register', () => {
  it('returns 400 when username is missing', async () => {
    const { status, data } = await request('POST', '/api/auth/register', { password: 'pass' });
    expect(status).toBe(400);
    expect(data.error).toBe('Username and password are required');
  });

  it('returns 400 when password is missing', async () => {
    const { status, data } = await request('POST', '/api/auth/register', { username: 'user' });
    expect(status).toBe(400);
    expect(data.error).toBe('Username and password are required');
  });

  it('registers user successfully', async () => {
    const { status, data } = await request('POST', '/api/auth/register', {
      username: 'newuser',
      password: 'newpass',
      email: 'new@test.com',
    });
    expect(status).toBe(200);
    expect(data.user.username).toBe('newuser');
    expect(data.user.email).toBe('new@test.com');
    expect(data.message).toBe('Registration successful');
  });

  it('registers user without email', async () => {
    const { status, data } = await request('POST', '/api/auth/register', {
      username: 'nomail',
      password: 'pass',
    });
    expect(status).toBe(200);
    expect(data.user.email).toBeNull();
  });
});
