import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireBody } from '../middleware/validate';

const router = Router();

router.post(
  '/login',
  requireBody('username', 'password'),
  asyncHandler(async (req, res) => {
    const { username } = req.body;

    // Demo: Accept any username/password for now
    // In production, verify against database with bcrypt
    const user = {
      id: 'demo-user-id',
      username,
      createdAt: new Date().toISOString(),
    };

    res.json({ user, message: 'Login successful' });
  }, 'Login failed')
);

router.post(
  '/register',
  requireBody('username', 'password'),
  asyncHandler(async (req, res) => {
    const { username, email } = req.body;

    // Demo: Create user without database
    // In production, save to database with bcrypt
    const user = {
      id: 'new-user-id',
      username,
      email: email || null,
      createdAt: new Date().toISOString(),
    };

    res.json({ user, message: 'Registration successful' });
  }, 'Registration failed')
);

export default router;
