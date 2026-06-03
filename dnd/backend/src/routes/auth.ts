import { Router } from 'express';

const router = Router();

// Simple demo authentication - in production, use proper password hashing and JWT
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Demo: Accept any username/password for now
    // In production, verify against database with bcrypt
    const user = {
      id: 'demo-user-id',
      username,
      createdAt: new Date().toISOString(),
    };

    res.json({ user, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Demo: Create user without database
    // In production, save to database with bcrypt
    const user = {
      id: 'new-user-id',
      username,
      email: email || null,
      createdAt: new Date().toISOString(),
    };

    res.json({ user, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;
